import { Command } from 'commander';
import chalk from 'chalk';
import { resolve, dirname } from 'node:path';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  parseOpenApi,
  importFromOpenApi,
} from '@lssm/lib.contracts-transformers/openapi';
import { getErrorMessage } from '../../utils/errors';
import { loadConfig } from '../../utils/config';

interface ImportOptions {
  outputDir?: string;
  prefix?: string;
  tags?: string[];
  exclude?: string[];
  stability?: string;
  owners?: string[];
  auth?: string;
  dryRun?: boolean;
}

/**
 * Import specs from an OpenAPI document.
 */
export const importCommand = new Command('import')
  .description('Import ContractSpec specs from an OpenAPI document')
  .argument('<source>', 'OpenAPI source URL or file path')
  .option('--output-dir <dir>', 'Output directory for generated spec files')
  .option('--prefix <prefix>', 'Prefix for generated spec names')
  .option('--tags <tags...>', 'Only import operations with these tags')
  .option('--exclude <ids...>', 'Exclude operations with these operationIds')
  .option(
    '--stability <stability>',
    'Default stability for imported specs',
    'stable'
  )
  .option('--owners <owners...>', 'Default owners for imported specs')
  .option('--auth <auth>', 'Default auth level for imported specs', 'user')
  .option('--dry-run', 'Show what would be imported without writing files')
  .action(async (source: string, options: ImportOptions) => {
    try {
      const config = await loadConfig();
      const outputDir = options.outputDir ?? config.outputDir ?? './src/specs';

      console.log(chalk.blue(`📥 Importing from OpenAPI: ${source}`));

      // Parse the OpenAPI document
      const parseResult = await parseOpenApi(source, {
        fetch: globalThis.fetch,
        readFile: async (path) => {
          const content = await readFile(path, 'utf-8');
          return content;
        },
      });

      if (parseResult.warnings.length > 0) {
        for (const warning of parseResult.warnings) {
          console.log(chalk.yellow(`⚠️ ${warning}`));
        }
      }

      console.log(
        chalk.gray(
          `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title} v${parseResult.info.version}`
        )
      );

      // Import operations
      const importResult = importFromOpenApi(parseResult, {
        prefix: options.prefix,
        tags: options.tags,
        exclude: options.exclude,
        defaultStability: options.stability as
          | 'experimental'
          | 'beta'
          | 'stable'
          | 'deprecated',
        defaultOwners: options.owners,
        defaultAuth: options.auth as 'anonymous' | 'user' | 'admin',
      });

      // Write imported specs
      let importedCount = 0;
      for (const spec of importResult.specs) {
        const filePath = resolve(outputDir, spec.fileName);

        if (options.dryRun) {
          console.log(
            chalk.gray(`[DRY RUN] Would create: ${filePath}`)
          );
        } else {
          // Ensure directory exists
          const dir = dirname(filePath);
          if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
          }

          // Write spec file
          await writeFile(filePath, spec.code, 'utf-8');
          console.log(chalk.green(`✅ Created: ${filePath}`));
        }
        importedCount++;
      }

      // Report skipped operations
      if (importResult.skipped.length > 0) {
        console.log(chalk.yellow(`\nSkipped ${importResult.skipped.length} operations:`));
        for (const skipped of importResult.skipped) {
          console.log(chalk.gray(`  - ${skipped.sourceId}: ${skipped.reason}`));
        }
      }

      // Report errors
      if (importResult.errors.length > 0) {
        console.log(chalk.red(`\nErrors for ${importResult.errors.length} operations:`));
        for (const error of importResult.errors) {
          console.log(chalk.red(`  - ${error.sourceId}: ${error.error}`));
        }
      }

      // Summary
      console.log(
        chalk.blue(
          `\n📊 Import summary: ${importedCount} imported, ${importResult.skipped.length} skipped, ${importResult.errors.length} errors`
        )
      );

      if (options.dryRun) {
        console.log(chalk.yellow('\n⚠️ Dry run - no files were written'));
      }
    } catch (error) {
      console.error(
        chalk.red(`OpenAPI import failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });

