import { resolve } from 'path';
import chalk from 'chalk';
import { loadWorkspaceConfig } from '../core/config.js';
import {
  loadLockfile,
  saveLockfile,
  isLockfileFrozenValid,
} from '../core/lockfile.js';
import { isGitPackRef } from '../sources/git-ref.js';
import { isNpmPackRef } from '../sources/npm-ref.js';
import { isRegistryPackRef } from '../sources/registry-ref.js';
import { isLocalPackRef } from '../sources/local.js';
import { installGitSource } from '../sources/git.js';
import { installNpmSource } from '../sources/npm.js';
import { installRegistrySource } from '../sources/registry.js';

interface InstallCliOptions {
  update?: boolean;
  frozen?: boolean;
  verbose?: boolean;
}

/**
 * Run the install command.
 * Resolves and installs remote pack sources (git, npm) into local cache.
 */
export async function runInstall(
  projectRoot: string,
  options: InstallCliOptions
): Promise<void> {
  const config = loadWorkspaceConfig(projectRoot);
  const lockfile = loadLockfile(projectRoot);
  const verbose = options.verbose ?? config.verbose;

  // Separate remote packs from local packs
  const remotePacks = config.packs.filter(
    (ref) => isGitPackRef(ref) || isNpmPackRef(ref) || isRegistryPackRef(ref)
  );
  const localPacks = config.packs.filter((ref) => isLocalPackRef(ref));

  if (remotePacks.length === 0) {
    console.log(chalk.dim('No remote packs to install. All packs are local.'));
    return;
  }

  if (verbose) {
    console.log(
      chalk.dim(`Found ${remotePacks.length} remote pack(s) to install`)
    );
    console.log(chalk.dim(`  (${localPacks.length} local pack(s) skipped)`));
  }

  // Frozen mode check
  if (options.frozen) {
    const sourceKeys = remotePacks.map((ref) => ref); // simplified
    const frozenCheck = isLockfileFrozenValid(lockfile, sourceKeys);
    if (!frozenCheck.valid) {
      console.log(
        chalk.red(
          `Frozen install failed. Missing lockfile entries: ${frozenCheck.missing.join(', ')}`
        )
      );
      process.exit(1);
    }
  }

  let totalInstalled = 0;
  const allWarnings: string[] = [];

  for (const packRef of remotePacks) {
    if (verbose) {
      console.log(chalk.dim(`  Installing ${packRef}...`));
    }

    try {
      let result: { installed: string[]; warnings: string[] };

      if (isRegistryPackRef(packRef)) {
        result = await installRegistrySource(projectRoot, packRef, lockfile, {
          update: options.update,
          frozen: options.frozen,
        });
      } else if (isGitPackRef(packRef)) {
        const token =
          process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? undefined;
        result = await installGitSource(projectRoot, packRef, lockfile, {
          update: options.update,
          frozen: options.frozen,
          token,
        });
      } else if (isNpmPackRef(packRef)) {
        result = await installNpmSource(projectRoot, packRef, lockfile, {
          update: options.update,
          frozen: options.frozen,
        });
      } else {
        continue;
      }

      totalInstalled += result.installed.length;
      allWarnings.push(...result.warnings);

      if (verbose && result.installed.length > 0) {
        console.log(
          chalk.dim(`    ${result.installed.length} file(s) installed`)
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(chalk.red(`  error [${packRef}]: ${msg}`));
      allWarnings.push(`Failed to install ${packRef}: ${msg}`);
    }
  }

  // Print warnings
  for (const w of allWarnings) {
    console.log(chalk.yellow(`  warn: ${w}`));
  }

  // Save lockfile
  saveLockfile(projectRoot, lockfile);

  console.log(
    chalk.green(
      `Installed ${totalInstalled} file(s) from ${remotePacks.length} source(s)`
    )
  );
  if (verbose) {
    console.log(chalk.dim('Lockfile updated: agentpacks.lock'));
  }
}
