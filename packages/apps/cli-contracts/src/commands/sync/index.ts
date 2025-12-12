import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import { execSync } from 'child_process';
import path from 'path';

export const syncCommand = new Command('sync')
  .description('Sync contracts across multiple surfaces (API, DB, UI)')
  .option('--surfaces <surfaces>', 'Surfaces to sync (comma-separated)', 'api,db,ui')
  .option('--dry-run', 'Show what would be synced without making changes')
  .option('--force', 'Force regeneration even if specs haven\'t changed')
  .action(async (options) => {
    const { surfaces, dryRun, force } = options;
    const targetSurfaces = surfaces.split(',').map((s: string) => s.trim());

    console.log(chalk.bold('🔄 Syncing contracts across surfaces...'));
    console.log(chalk.gray(`Surfaces: ${targetSurfaces.join(', ')}`));
    if (dryRun) console.log(chalk.yellow('DRY RUN - No changes will be made'));
    console.log('');

    try {
      // Find all contract specs
      const contractFiles = await glob('**/*.contracts.ts', {
        ignore: ['node_modules/**', 'dist/**', '.turbo/**']
      });

      if (contractFiles.length === 0) {
        console.log(chalk.yellow('No contract specs found.'));
        return;
      }

      console.log(chalk.cyan(`Found ${contractFiles.length} contract specs\n`));

      // Sync each spec to target surfaces
      for (const specFile of contractFiles) {
        console.log(chalk.bold(`📋 Processing: ${specFile}`));

        for (const surface of targetSurfaces) {
          console.log(chalk.gray(`  → Syncing to ${surface}...`));

          if (dryRun) {
            console.log(chalk.gray(`    Would generate ${surface} artifacts for ${specFile}`));
          } else {
            try {
              // Build command with surface-specific options
              const buildCmd = `contractspec build "${specFile}" --output-dir "./generated/${surface}" ${force ? '--force' : ''}`;
              execSync(buildCmd, { stdio: 'pipe' });
              console.log(chalk.green(`    ✅ ${surface} sync completed`));
            } catch (error: any) {
              console.log(chalk.red(`    ❌ ${surface} sync failed: ${error.message}`));
            }
          }
        }
        console.log('');
      }

      if (!dryRun) {
        console.log(chalk.green('🎉 Contract sync completed!'));
        console.log(chalk.gray('Generated artifacts are in ./generated/'));
      }

    } catch (error: any) {
      console.error(chalk.red(`Sync failed: ${error.message}`));
      process.exit(1);
    }
  });
