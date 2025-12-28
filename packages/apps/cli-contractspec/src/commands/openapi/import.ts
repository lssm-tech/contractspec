import { Command } from 'commander';
import chalk from 'chalk';
import { basename, dirname, resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  importFromOpenApi,
  parseOpenApi,
} from '@lssm/lib.contracts-transformers/openapi';
import type { SchemaFormat, FormatterType } from '@lssm/lib.contracts';
import { getErrorMessage } from '../../utils/errors';
import { loadConfig, type OpenApiSourceConfig } from '../../utils/config';
import {
  getOutputDirForSpecType,
  upsertOpenApiSource,
} from '../../utils/config-writer';
import { formatFiles } from '@lssm/bundle.contractspec-workspace';

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
        schemaFormat: options.schemaFormat,
      });

      // Write imported specs
      let importedCount = 0;
      const specsByDir = new Map<
        string,
        { file: string; name: string; type: 'operation' | 'event' | 'model' }[]
      >();

      for (const spec of importResult.operationSpecs) {
        // Determine output directory based on spec type and conventions
        let targetDir: string;
        let type: 'operation' | 'event' | 'model' = 'operation';

        if (useConventions) {
          // Infer spec type from source or code content
          if (spec.code.includes('defineEvent(')) {
            targetDir = eventsDir;
            type = 'event';
          } else if (
            // ContractSpec format
            (spec.code.includes('defineSchemaModel(') ||
              spec.code.includes('new EnumType(') ||
              spec.code.includes('ScalarTypeEnum.') ||
              // Zod format
              spec.code.includes('new ZodSchemaType(') ||
              spec.code.includes('z.enum(') ||
              // JSON Schema format
              spec.code.includes('new JsonSchemaType(') ||
              // GraphQL format
              spec.code.includes('new GraphQLSchemaType(')) &&
            !spec.code.includes('defineCommand(') &&
            !spec.code.includes('defineQuery(')
          ) {
            targetDir = modelsDir;
            type = 'model';
          } else {
            targetDir = operationsDir;
            type = 'operation';
          }
        } else {
          if (!options.outputDir) {
            throw new Error(
              '`outputDir` is required when not using conventions'
            );
          }
          targetDir = options.outputDir;
          // Infer type even if outputDir is fixed
          if (spec.code.includes('defineEvent(')) {
            type = 'event';
          } else if (
            // ContractSpec format
            (spec.code.includes('defineSchemaModel(') ||
              spec.code.includes('new EnumType(') ||
              spec.code.includes('ScalarTypeEnum.') ||
              // Zod format
              spec.code.includes('new ZodSchemaType(') ||
              spec.code.includes('z.enum(') ||
              // JSON Schema format
              spec.code.includes('new JsonSchemaType(') ||
              // GraphQL format
              spec.code.includes('new GraphQLSchemaType(')) &&
            !spec.code.includes('defineCommand(') &&
            !spec.code.includes('defineQuery(')
          ) {
            type = 'model';
          }
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

        // Track for registry generation
        const dir = dirname(filePath); // handle potential subdirectories in fileName or targetDir
        const existing = specsByDir.get(dir) || [];

        let match: RegExpMatchArray | null = null;
        if (type === 'operation') {
          match = spec.code.match(
            /export const (\w+)\s*=\s*define(?:Command|Query)/
          );
        } else if (type === 'event') {
          match = spec.code.match(/export const (\w+)\s*=\s*defineEvent/);
        }

        // Fallback to any export if specific one not found (or for models)
        if (!match) {
          // For Zod format models, prefer the ZodSchemaType wrapper export
          if (type === 'model' && spec.code.includes('new ZodSchemaType(')) {
            match = spec.code.match(
              /export const (\w+)\s*=\s*new ZodSchemaType\(/
            );
          }
          // For JSON Schema format models
          if (
            !match &&
            type === 'model' &&
            spec.code.includes('new JsonSchemaType(')
          ) {
            match = spec.code.match(
              /export const (\w+)\s*=\s*new JsonSchemaType\(/
            );
          }
          // For GraphQL format models
          if (
            !match &&
            type === 'model' &&
            spec.code.includes('new GraphQLSchemaType(')
          ) {
            match = spec.code.match(
              /export const (\w+)\s*=\s*new GraphQLSchemaType\(/
            );
          }
          // General fallback
          if (!match) {
            match = spec.code.match(/export const (\w+)\s*=/);
          }
        }

        if (match) {
          existing.push({
            file: basename(filePath),
            // eslint-disable-next-line
            name: match[1]!,
            type,
          });
          specsByDir.set(dir, existing);
        }

        importedCount++;
      }

      // Generate registries
      if (!options.dryRun && importedCount > 0) {
        for (const [dir, specs] of specsByDir.entries()) {
          if (specs.length === 0) continue;

          // Check dominant type in this directory
          const types = specs.map((s) => s.type);
          const isOperations = types.every((t) => t === 'operation');
          const isEvents = types.every((t) => t === 'event');
          const isModels = types.every((t) => t === 'model');

          let registryCode = `/**\n * Auto-generated registry file.\n */\n`;
          // Imports
          specs.forEach((s) => {
            const importPath = `./${basename(s.file, '.ts')}`;
            registryCode += `import { ${s.name} } from '${importPath}';\n`;
          });
          registryCode += '\n';

          if (isOperations) {
            registryCode += `import { OperationSpecRegistry } from '@lssm/lib.contracts';\n\n`;
            registryCode += `export const operationRegistry = new OperationSpecRegistry();\n`;
            specs.forEach((s) => {
              registryCode += `operationRegistry.register(${s.name});\n`;
            });
            const registryPath = resolve(dir, 'registry.ts');
            await writeFile(registryPath, registryCode, 'utf-8');
            console.log(
              chalk.green(`✅ Created/Updated registry: ${registryPath}`)
            );
          } else if (isEvents) {
            registryCode += `import { EventRegistry } from '@lssm/lib.contracts';\n\n`;
            registryCode += `export const eventRegistry = new EventRegistry();\n`;
            specs.forEach((s) => {
              registryCode += `eventRegistry.register(${s.name});\n`;
            });
            const registryPath = resolve(dir, 'registry.ts');
            await writeFile(registryPath, registryCode, 'utf-8');
            console.log(
              chalk.green(`✅ Created/Updated registry: ${registryPath}`)
            );
          } else if (isModels) {
            registryCode += `import { ModelRegistry } from '@lssm/lib.contracts';\n\n`;
            registryCode += `export const modelRegistry = new ModelRegistry();\n`;
            specs.forEach((s) => {
              registryCode += `modelRegistry.register(${s.name});\n`;
            });
            const registryPath = resolve(dir, 'registry.ts');
            await writeFile(registryPath, registryCode, 'utf-8');
            console.log(
              chalk.green(`✅ Created/Updated registry: ${registryPath}`)
            );
          } else {
            chalk.yellow(`unsupported types: ${types}`);
          }

          // Generate index.ts (barrel file) always
          let indexCode = `/**\n * Auto-generated barrel file.\n */\n\n`;
          specs.forEach((s) => {
            const importPath = `./${basename(s.file, '.ts')}`;
            indexCode += `export * from '${importPath}';\n`;
          });

          if (isOperations || isEvents) {
            indexCode += `export * from './registry';\n`;
          }

          const indexPath = resolve(dir, 'index.ts');
          await writeFile(indexPath, indexCode, 'utf-8');
          console.log(chalk.green(`✅ Created/Updated index: ${indexPath}`));
        }
      }

      // Format generated files if not skipped
      if (!options.dryRun && !options.noFormat && importedCount > 0) {
        const allGeneratedFiles: string[] = [];
        for (const [dir, specs] of specsByDir.entries()) {
          for (const spec of specs) {
            allGeneratedFiles.push(resolve(dir, spec.file));
          }
          // Also format registry and index files
          const registryPath = resolve(dir, 'registry.ts');
          const indexPath = resolve(dir, 'index.ts');
          if (existsSync(registryPath)) allGeneratedFiles.push(registryPath);
          if (existsSync(indexPath)) allGeneratedFiles.push(indexPath);
        }

        if (allGeneratedFiles.length > 0) {
          await formatFiles(allGeneratedFiles, config.formatter, {
            type: options.formatter,
            cwd: process.cwd(),
          });
        }
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
          schemaFormat: options.schemaFormat ?? 'contractspec',
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
