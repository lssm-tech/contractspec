/**
 * Import command.
 *
 * Extracts contracts from source code and generates ContractSpec definitions.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import {
  createNodeAdapters,
  importFromSourceService,
} from '@contractspec/bundle.workspace';
import { loadConfig, mergeConfig } from '../../utils/config';

export const importCommand = new Command('import')
  .description(
    'Import contracts from existing source code (NestJS, Express, Fastify, Hono, Elysia, tRPC, Next.js)'
  )
  .option('-s, --scope <paths...>', 'Limit extraction to specific directories')
  .option(
    '-f, --framework <name>',
    'Force specific framework (nestjs, express, fastify, hono, elysia, trpc, next-api)'
  )
  .option(
    '-o, --output <dir>',
    'Output directory for generated contracts',
    '.contractspec/generated'
  )
  .option(
    '--analyze',
    'Analysis-only mode - extract IR without generating code'
  )
  .option('--dry-run', 'Preview what would be generated without writing files')
  .option('--json', 'Output IR as JSON instead of report')
  .action(async (options) => {
    try {
      const adapters = createNodeAdapters({ silent: options.json });
      const cwd = process.cwd();
      const config = await loadConfig();
      const mergedConfig = mergeConfig(config, options);

      if (!options.json) {
        console.log(chalk.bold.blue('\n📥 ContractSpec Import\n'));
      }

      const result = await importFromSourceService(
        mergedConfig,
        {
          scope: options.scope,
          framework: options.framework,
          outputDir: path.resolve(cwd, options.output),
          dryRun: options.dryRun,
          analyzeOnly: options.analyze,
        },
        adapters,
        cwd
      );

      if (options.json && result.ir) {
        console.log(JSON.stringify(result.ir, null, 2));
        return;
      }

      if (result.success) {
        console.log(chalk.green('\n✅ Import completed successfully\n'));

        if (result.ir) {
          console.log(chalk.bold('Summary:'));
          console.log(
            chalk.gray(`  Endpoints: ${result.ir.stats.endpointsFound}`)
          );
          console.log(
            chalk.gray(`  Schemas:   ${result.ir.stats.schemasFound}`)
          );
          console.log(
            chalk.gray(`  Files:     ${result.ir.stats.filesScanned} scanned`)
          );
        }

        if (result.generation) {
          console.log(chalk.bold('\nGenerated:'));
          console.log(
            chalk.gray(`  Operations: ${result.generation.operationsGenerated}`)
          );
          console.log(
            chalk.gray(`  Schemas:    ${result.generation.schemasGenerated}`)
          );
          console.log(
            chalk.gray(`  Total:      ${result.generation.files.length} files`)
          );
        }

        console.log(chalk.bold('\nNext steps:'));
        console.log(chalk.gray('  1. Review generated contracts'));
        console.log(chalk.gray('  2. Fill in TODO placeholders'));
        console.log(chalk.gray('  3. Run: contractspec validate'));
      } else {
        console.log(chalk.red('\n❌ Import failed\n'));
        if (result.errors) {
          for (const err of result.errors) {
            console.log(chalk.red(`  - ${err}`));
          }
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
