import { Command } from 'commander';
import chalk from 'chalk';
import { createNodeAdapters } from '@lssm/bundle.contractspec-workspace';
import {
  loadWorkspaceConfig,
  syncSpecs,
  validateSpec,
} from '@lssm/bundle.contractspec-workspace';
import { loadConfig, mergeConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';
import { buildCommand } from '../build';
import type { ValidateSpecResult } from '@lssm/bundle.contractspec-workspace';

export const syncCommand = new Command('sync')
  .description('Sync contracts by building all discovered specs')
  .option('--pattern <pattern>', 'File pattern to search (glob)')
  .option(
    '--buckets <buckets>',
    'Optional output buckets (comma-separated). Builds are repeated into ./generated/<bucket>/',
    ''
  )
  .option('--surfaces <surfaces>', '(deprecated) Alias for --buckets', '')
  .option('--validate', 'Validate each spec before building (spec-only)', false)
  .option('--dry-run', 'Show what would be synced without making changes')
  .action(async (options) => {
    const dryRun = Boolean(options.dryRun);
    const shouldValidate = Boolean(options.validate);

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
    if (dryRun) {
      console.log(chalk.yellow('DRY RUN - No changes will be made'));
    }

    console.log('');

    try {
      const adapters = createNodeAdapters({ silent: true });
      const workspaceConfig = await loadWorkspaceConfig(adapters.fs);
      const baseConfig = await loadConfig();
      const mergedConfig = mergeConfig(baseConfig, {});

      const outputDirs: (string | undefined)[] =
        buckets.length > 0
          ? buckets.map((b) => `./generated/${b}`)
          : [undefined];

      let successCount = 0;
      let failureCount = 0;

      const results = await syncSpecs(
        { fs: adapters.fs, logger: adapters.logger },
        workspaceConfig,
        {
          pattern: options.pattern as string | undefined,
          outputDirs,
          validate: shouldValidate,
          dryRun,
        },
        {
          validate: async (specPath): Promise<ValidateSpecResult> =>
            validateSpec(specPath, {
              fs: adapters.fs,
              logger: adapters.logger,
            }),
          build: async (specPath, targetOutputDir) => {
            if (dryRun) return { ok: true };
            const configForTarget = targetOutputDir
              ? mergeConfig(mergedConfig, { outputDir: targetOutputDir })
              : mergedConfig;
            await buildCommand(
              specPath,
              { outputDir: targetOutputDir },
              configForTarget
            );
            return { ok: true };
          },
        }
      );

      console.log(chalk.cyan(`Found ${results.specs.length} spec files\n`));

      for (const run of results.runs) {
        const label = run.outputDir ? `→ ${run.outputDir}` : '→ default';

        console.log(chalk.bold(`📋 ${run.specPath}`));

        console.log(chalk.gray(`  ${label}`));

        if (run.error) {
          failureCount += 1;

          console.log(
            chalk.red(`    ❌ ${run.error.phase} failed: ${run.error.message}`)
          );
          continue;
        }

        if (shouldValidate && run.validation && !run.validation.valid) {
          failureCount += 1;

          console.log(chalk.red('    ❌ Validation failed'));
          for (const err of run.validation.errors) {
            console.log(chalk.red(`      • ${err}`));
          }
          continue;
        }

        successCount += 1;
      }

      if (!dryRun) {
        console.log('');
        if (failureCount === 0) {
          console.log(
            chalk.green(`✅ Sync completed (${successCount} succeeded)`)
          );
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
