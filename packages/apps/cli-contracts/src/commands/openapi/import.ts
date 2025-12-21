import { Command } from 'commander';
import chalk from 'chalk';
import { basename, dirname, resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  importFromOpenApi,
  parseOpenApi,
} from '@lssm/lib.contracts-transformers/openapi';
import { getErrorMessage } from '../../utils/errors';
import { loadConfig, type OpenApiSourceConfig } from '../../utils/config';
import {
  getOutputDirForSpecType,
  upsertOpenApiSource,
} from '../../utils/config-writer';

interface ImportOptions {
  outputDir?: string;
  prefix?: string;
  tags?: string[];
  exclude?: string[];
  stability?: string;
  owners?: string[];
  auth?: string;
  dryRun?: boolean;
  saveConfig?: boolean;
  name?: string;
  syncMode?: string;
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
  .option('--save-config', 'Save OpenAPI source to .contractsrc.json')
  .option('--name <name>', 'Friendly name for the OpenAPI source')
  .option(
    '--sync-mode <mode>',
    'Sync mode: import, sync, or validate',
    'import'
  )
  .action(async (source: string, options: ImportOptions) => {
    try {
      const config = await loadConfig();
      // Use conventions for output directories
      const operationsDir = getOutputDirForSpecType('operation', config);
      const eventsDir = getOutputDirForSpecType('event', config);
      const modelsDir = getOutputDirForSpecType('model', config);
      // Allow override via --output-dir (puts everything in one place)
      const useConventions = !options.outputDir;

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
      const importResult = importFromOpenApi(parseResult, config, {
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
        // Determine output directory based on spec type and conventions
        let targetDir: string;
        if (useConventions) {
          // Infer spec type from source or code content
          if (spec.code.includes('defineEvent(')) {
            targetDir = eventsDir;
          } else if (
            (spec.code.includes('defineSchemaModel(') ||
              spec.code.includes('new EnumType(') ||
              spec.code.includes('ScalarTypeEnum.')) &&
            !spec.code.includes('defineCommand(') &&
            !spec.code.includes('defineQuery(')
          ) {
            targetDir = modelsDir;
          } else {
            targetDir = operationsDir;
          }
        } else {
          if (!options.outputDir) {
            throw new Error(
              '`outputDir` is required when not using conventions'
            );
          }
          targetDir = options.outputDir;
        }

        const filePath = resolve(targetDir, spec.fileName);

        if (options.dryRun) {
          console.log(chalk.gray(`[DRY RUN] Would create: ${filePath}`));
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
        console.log(
          chalk.yellow(`\nSkipped ${importResult.skipped.length} operations:`)
        );
        for (const skipped of importResult.skipped) {
          console.log(chalk.gray(`  - ${skipped.sourceId}: ${skipped.reason}`));
        }
      }

      // Report errors
      if (importResult.errors.length > 0) {
        console.log(
          chalk.red(`\nErrors for ${importResult.errors.length} operations:`)
        );
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

      // Save config if requested
      if (options.saveConfig && !options.dryRun) {
        const sourceName =
          options.name ?? parseResult.info.title ?? basename(source, '.json');
        const openApiSource: OpenApiSourceConfig = {
          name: sourceName,
          syncMode:
            (options.syncMode as 'import' | 'sync' | 'validate') ?? 'import',
          prefix: options.prefix,
          tags: options.tags,
          exclude: options.exclude,
          defaultStability: options.stability as
            | 'experimental'
            | 'beta'
            | 'stable'
            | 'deprecated'
            | undefined,
          defaultAuth: options.auth as
            | 'anonymous'
            | 'user'
            | 'admin'
            | undefined,
        };

        // Set URL or file based on source
        if (source.startsWith('http://') || source.startsWith('https://')) {
          openApiSource.url = source;
        } else {
          openApiSource.file = source;
        }

        await upsertOpenApiSource(openApiSource);
        console.log(
          chalk.green(
            `\n✅ Saved OpenAPI source '${sourceName}' to .contractsrc.json`
          )
        );
      }
    } catch (error) {
      console.error(
        chalk.red(`OpenAPI import failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });
