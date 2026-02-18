import { existsSync } from 'fs';
import { resolve, join } from 'path';
import chalk from 'chalk';
import { loadWorkspaceConfig, loadPackManifest } from '../../core/config.js';
import { listFiles, listDirs } from '../../utils/filesystem.js';

/**
 * Validate all configured packs.
 */
export function runPackValidate(projectRoot: string): void {
  const config = loadWorkspaceConfig(projectRoot);
  let hasErrors = false;

  for (const packRef of config.packs) {
    const packDir = resolvePackDir(projectRoot, packRef);

    console.log(chalk.bold(`\nValidating pack: ${packRef}`));

    if (!packDir || !existsSync(packDir)) {
      console.log(chalk.red(`  ERROR: Pack directory not found: ${packRef}`));
      hasErrors = true;
      continue;
    }

    // Validate pack.json
    const packJsonPath = resolve(packDir, 'pack.json');
    if (!existsSync(packJsonPath)) {
      console.log(
        chalk.yellow(
          '  warn: No pack.json found. Name will be inferred from directory.'
        )
      );
    } else {
      try {
        loadPackManifest(packDir);
        console.log(chalk.green('  pack.json: valid'));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(chalk.red(`  ERROR pack.json: ${message}`));
        hasErrors = true;
      }
    }

    // Validate structure
    const subdirs = ['rules', 'commands', 'agents', 'skills'];
    for (const sub of subdirs) {
      const subDir = join(packDir, sub);
      if (existsSync(subDir)) {
        if (sub === 'skills') {
          const skillDirs = listDirs(subDir);
          for (const skillDir of skillDirs) {
            const skillMd = join(skillDir, 'SKILL.md');
            if (!existsSync(skillMd)) {
              console.log(
                chalk.yellow(
                  `  warn: skills/${skillDir.split('/').pop()} missing SKILL.md`
                )
              );
            }
          }
          console.log(chalk.green(`  ${sub}/: ${skillDirs.length} skill(s)`));
        } else {
          const files = listFiles(subDir, { extension: '.md' });
          console.log(chalk.green(`  ${sub}/: ${files.length} file(s)`));
        }
      }
    }

    // Check optional files
    const optionalFiles = ['mcp.json', 'ignore', '.aiignore'];
    for (const file of optionalFiles) {
      if (existsSync(join(packDir, file))) {
        console.log(chalk.green(`  ${file}: present`));
      }
    }

    const hooksJson = join(packDir, 'hooks', 'hooks.json');
    if (existsSync(hooksJson)) {
      console.log(chalk.green('  hooks/hooks.json: present'));
    }

    const pluginsDir = join(packDir, 'plugins');
    if (existsSync(pluginsDir)) {
      const pluginFiles = [
        ...listFiles(pluginsDir, { extension: '.ts' }),
        ...listFiles(pluginsDir, { extension: '.js' }),
      ];
      console.log(chalk.green(`  plugins/: ${pluginFiles.length} file(s)`));
    }
  }

  console.log();
  if (hasErrors) {
    console.log(chalk.red('Validation failed with errors.'));
    process.exit(1);
  } else {
    console.log(chalk.green('All packs valid.'));
  }
}

function resolvePackDir(projectRoot: string, packRef: string): string | null {
  if (packRef.startsWith('./') || packRef.startsWith('../')) {
    return resolve(projectRoot, packRef);
  }
  return resolve(projectRoot, packRef);
}
