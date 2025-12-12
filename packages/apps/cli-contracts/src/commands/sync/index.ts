import { Command } from 'commander';
import chalk from 'chalk';
import { discoverSpecFiles } from '../../utils/spec-files';
import { loadConfig, mergeConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';
import { buildCommand } from '../build';
import { validateCommand } from '../validate';

export const syncCommand = new Command('sync')
  .description('Sync contracts by building all discovered specs')
  .option('--pattern <pattern>', 'File pattern to search (glob)')
  .option(
    '--buckets <buckets>',
    'Optional output buckets (comma-separated). Builds are repeated into ./generated/<bucket>/',
    ''
  )
  .option(
    '--surfaces <surfaces>',
    '(deprecated) Alias for --buckets',
    ''
  )
  .option('--validate', 'Validate each spec before building (spec-only)', false)
  .option('--dry-run', 'Show what would be synced without making changes')
  .action(async (options) => {
    const dryRun: boolean = Boolean(options.dryRun);
    const shouldValidate: boolean = Boolean(options.validate);

    const bucketsRaw: string =
      (options.buckets as string) || (options.surfaces as string) || '';
    const buckets = bucketsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(chalk.bold('🔄 Syncing contracts...'));
    if (buckets.length > 0) {
      console.log(chalk.gray(`Buckets: ${buckets.join(', ')}`));
    } else {
      console.log(chalk.gray('Mode: build-all (default outputDir)'));
    }
    if (shouldValidate) {
      console.log(chalk.gray('Validate: enabled (spec-only)'));
    }
    if (dryRun) console.log(chalk.yellow('DRY RUN - No changes will be made'));
    console.log('');

    try {
      const contractFiles = await discoverSpecFiles({
        pattern: options.pattern as string | undefined,
      });

      if (contractFiles.length === 0) {
        console.log(chalk.yellow('No spec files found.'));
        return;
      }

      console.log(chalk.cyan(`Found ${contractFiles.length} spec files\n`));

      const baseConfig = await loadConfig();
      const mergedConfig = mergeConfig(baseConfig, {});

      let successCount = 0;
      let failureCount = 0;

      for (const specFile of contractFiles) {
        console.log(chalk.bold(`📋 ${specFile}`));

        const targets: Array<string | undefined> =
          buckets.length > 0 ? buckets.map((b) => `./generated/${b}`) : [undefined];

        for (const targetOutputDir of targets) {
          const label = targetOutputDir ? `→ ${targetOutputDir}` : '→ default';
          console.log(chalk.gray(`  ${label}`));

          if (dryRun) {
            if (shouldValidate) {
              console.log(chalk.gray('    Would validate spec (spec-only)'));
            }
            console.log(chalk.gray('    Would build artifacts'));
            continue;
          }

          try {
            if (shouldValidate) {
              await validateCommand(
                specFile,
                { checkImplementation: false },
                mergedConfig
              );
            }

            const configForTarget = targetOutputDir
              ? mergeConfig(mergedConfig, { outputDir: targetOutputDir })
              : mergedConfig;

            await buildCommand(
              specFile,
              { outputDir: targetOutputDir },
              configForTarget
            );

            successCount += 1;
          } catch (error) {
            failureCount += 1;
            console.log(chalk.red(`    ❌ Failed: ${getErrorMessage(error)}`));
          }
        }
      }

      if (!dryRun) {
        console.log('');
        if (failureCount === 0) {
          console.log(chalk.green(`✅ Sync completed (${successCount} succeeded)`));
        } else {
          console.log(
            chalk.red(
              `❌ Sync completed with failures (${successCount} succeeded, ${failureCount} failed)`
            )
          );
          process.exitCode = 1;
        }
      }
    } catch (error) {
      console.error(chalk.red(`Sync failed: ${getErrorMessage(error)}`));
      process.exit(1);
    }
  });
