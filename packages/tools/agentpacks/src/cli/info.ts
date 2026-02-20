import chalk from 'chalk';
import { createRegistryClient } from '../utils/registry-client.js';
import { loadCredentials } from '../utils/credentials.js';

/**
 * Show detailed pack info.
 */
export async function runInfo(packName: string): Promise<void> {
  const credentials = loadCredentials();
  const client = createRegistryClient({
    registryUrl: credentials.registryUrl,
    authToken: credentials.token,
  });

  try {
    const pack = await client.info(packName);

    console.log(chalk.bold(`\n${pack.displayName}`));
    console.log(chalk.dim(`  ${pack.name}`));
    console.log(`  ${pack.description}`);
    console.log();

    // Metadata
    console.log(`  ${chalk.dim('Author:')} ${pack.author}`);
    console.log(`  ${chalk.dim('License:')} ${pack.license}`);
    console.log(`  ${chalk.dim('Downloads:')} ${pack.downloads}`);
    if (pack.homepage) {
      console.log(`  ${chalk.dim('Homepage:')} ${pack.homepage}`);
    }
    if (pack.repository) {
      console.log(`  ${chalk.dim('Repository:')} ${pack.repository}`);
    }
    console.log();

    // Tags
    if (pack.tags.length > 0) {
      console.log(`  ${chalk.dim('Tags:')} ${pack.tags.join(', ')}`);
    }

    // Targets
    if (pack.targets.length > 0) {
      console.log(`  ${chalk.dim('Targets:')} ${pack.targets.join(', ')}`);
    }

    // Features
    if (pack.features.length > 0) {
      console.log(`  ${chalk.dim('Features:')} ${pack.features.join(', ')}`);
    }
    console.log();

    // Versions
    if (pack.versions.length > 0) {
      console.log(chalk.bold('  Versions:'));
      for (const v of pack.versions.slice(0, 10)) {
        console.log(
          `    ${v.version} — ${v.createdAt} (${v.fileCount} files, ${formatBytes(v.tarballSize)})`
        );
      }
      if (pack.versions.length > 10) {
        console.log(chalk.dim(`    ... and ${pack.versions.length - 10} more`));
      }
    }
    console.log();

    // Install instruction
    console.log(chalk.bold('  Install:'));
    console.log(`    registry:${pack.name}`);
    console.log();
  } catch (err) {
    console.log(
      chalk.red(
        `Failed to get pack info: ${err instanceof Error ? err.message : String(err)}`
      )
    );
    process.exit(1);
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
