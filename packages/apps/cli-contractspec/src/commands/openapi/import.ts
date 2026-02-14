import { Command } from 'commander';
import chalk from 'chalk';
import { basename } from 'node:path';
import { getErrorMessage } from '../../utils/errors';
import { loadConfig, type OpenApiSourceConfig } from '../../utils/config';
import { upsertOpenApiSource } from '../../utils/config-writer';
import {
  importFromOpenApiService,
  formatFiles,
  createNodeAdapters,
} from '@contractspec/bundle.workspace';
import { parseOpenApi as parseOpenApiTransformer } from '@contractspec/lib.contracts-transformers/openapi';
import type {
  FormatterType,
  SchemaFormat,
} from '@contractspec/lib.contracts-spec';

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
  schemaFormat?: SchemaFormat;
  noFormat?: boolean;
  formatter?: FormatterType;
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
  .option(
    '--schema-format <format>',
    'Output schema format: contractspec (default), zod, json-schema, graphql',
    'contractspec'
  )
  .option('--no-format', 'Skip formatting generated files')
  .option(
    '--formatter <type>',
    'Formatter to use: prettier, eslint, biome, dprint, or custom'
  )
  .action(async (source: string, options: ImportOptions) => {
    console.log('DEBUG: Starting import action');
    try {
      const config = await loadConfig();

      const adapters = createNodeAdapters({
        cwd: process.cwd(),
      });

      // Temporary solution: Use 'src/contracts' as default if not specified,
      const outputDir = options.outputDir || 'src/contracts';

      console.log(chalk.blue(`📥 Importing from OpenAPI: ${source}`));

      const result = await importFromOpenApiService(
        config,
        {
          source,
          outputDir,
          prefix: options.prefix,
          tags: options.tags,
          exclude: options.exclude,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultStability: options.stability as any,
          defaultOwners: options.owners,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultAuth: options.auth as any,
          dryRun: options.dryRun,
        },
        adapters
      );

      // Summary
      console.log(
        chalk.blue(
          `\n📊 Import summary: ${result.imported} imported, ${result.skipped} skipped, ${result.errors} errors`
        )
      );

      if (options.dryRun) {
        console.log(chalk.yellow('\n⚠️ Dry run - no files were written'));
      }

      // Formatting
      if (!options.dryRun && !options.noFormat && result.files.length > 0) {
        const files = result.files.map((f) => f.path);
        // Add registries if they exist? Service doesn't return registry paths.
        // Service should handle formatting internally?
        // Previous CLI code formatted everything.
        // Service I wrote does NOT format.
        // I need to call formatFiles here using result files.
        await formatFiles(files, config.formatter, {
          type: options.formatter,
          cwd: process.cwd(),
        });
      }

      // Save config if requested
      if (options.saveConfig && !options.dryRun) {
        // Need to parse again to get info? Or trust source?
        // We can use parseOpenApiTransformer to get title/version if needed.
        let title = options.name;
        if (!title) {
          try {
            const parsed = await parseOpenApiTransformer(source, {
              fetch: globalThis.fetch,
              readFile: async (p) => adapters.fs.readFile(p),
            });
            title = parsed.info.title;
          } catch {
            // Ignore parse errors if we just want title
          }
        }

        const sourceName = title || basename(source, '.json');
        const openApiSource: OpenApiSourceConfig = {
          name: sourceName,
          syncMode:
            (options.syncMode as 'import' | 'sync' | 'validate') ?? 'import',
          schemaFormat: options.schemaFormat ?? 'contractspec',
          prefix: options.prefix,
          tags: options.tags,
          exclude: options.exclude,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultStability: options.stability as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultAuth: options.auth as any,
        };

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
