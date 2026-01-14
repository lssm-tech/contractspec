/**
 * OpenAPI import service - imports specs from OpenAPI documents.
 */

import {
  importFromOpenApi,
  parseOpenApi,
} from '@contractspec/lib.contracts-transformers/openapi';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type {
  OpenApiImportServiceOptions,
  OpenApiImportServiceResult,
} from './types';
import { dirname, join, basename } from 'path';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts';

/**
 * Get output directory for spec type
 */
function getOutputDir(
  type: 'operation' | 'event' | 'model',
  options: OpenApiImportServiceOptions,
  config: ResolvedContractsrcConfig
): string {
  // If outputDir is explicitly set in options, use it for all types
  if (options.outputDir) {
    return options.outputDir;
  }

  // Default base
  const baseDir = config.outputDir;
  const conventions = config.conventions;

  switch (type) {
    case 'operation':
      // Conventions usually format like "operations/**" or "operations"
      return join(
        baseDir,
        conventions.operations.split('|')[0] ?? 'operations'
      );
    case 'event':
      return join(baseDir, conventions.events);
    case 'model':
      return join(baseDir, 'models'); // Standardize on 'models' for now
    default:
      return baseDir;
  }
}

/**
 * Import ContractSpec specs from an OpenAPI document.
 */
export async function importFromOpenApiService(
  contractspecOptions: ResolvedContractsrcConfig,
  options: OpenApiImportServiceOptions,
  adapters: { fs: FsAdapter; logger: LoggerAdapter }
): Promise<OpenApiImportServiceResult> {
  const { fs, logger } = adapters;
  const {
    source,

    prefix,
    tags,
    exclude,
    defaultStability,
    defaultOwners,
    defaultAuth,
    dryRun = false,
  } = options;

  logger.info(`Importing from OpenAPI: ${source}`);

  // Parse the OpenAPI document
  // Use globalThis.fetch because adapters don't have networking yet
  // but we use fs.readFile for local files
  const parseResult = await parseOpenApi(source, {
    fetch: globalThis.fetch,
    readFile: (path) => fs.readFile(path),
  });

  if (parseResult.warnings.length > 0) {
    for (const warning of parseResult.warnings) {
      logger.warn(`Parse warning: ${warning}`);
    }
  }

  logger.info(
    `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title} v${parseResult.info.version}`
  );

  // Import operations
  const importResult = importFromOpenApi(parseResult, contractspecOptions, {
    prefix,
    tags,
    exclude,
    defaultStability,
    defaultOwners,
    defaultAuth,
  });

  logger.info(
    `Import result: ${importResult.summary.imported} imported, ${importResult.summary.skipped} skipped, ${importResult.summary.errors} errors`
  );

  const files: OpenApiImportServiceResult['files'] = [];
  const skippedOperations: OpenApiImportServiceResult['skippedOperations'] = [];
  const errorMessages: OpenApiImportServiceResult['errorMessages'] = [];

  // Write imported specs
  const specsByDir = new Map<
    string,
    { file: string; name: string; type: 'operation' | 'event' | 'model' }[]
  >();

  for (const spec of importResult.operationSpecs) {
    // Determine type FIRST to resolve output directory
    let type: 'operation' | 'event' | 'model' = 'operation';
    let match: RegExpMatchArray | null = null;
    if (spec.code.includes('defineEvent(')) {
      type = 'event';
      match = spec.code.match(/export const (\w+)\s*=\s*defineEvent/);
    } else if (
      (spec.code.includes('defineSchemaModel(') ||
        spec.code.includes('new EnumType(') ||
        spec.code.includes('ScalarTypeEnum.') ||
        spec.code.includes('new ZodSchemaType(') ||
        spec.code.includes('z.enum(') ||
        spec.code.includes('new JsonSchemaType(') ||
        spec.code.includes('new GraphQLSchemaType(')) &&
      !spec.code.includes('defineCommand(') &&
      !spec.code.includes('defineQuery(')
    ) {
      type = 'model';
    } else {
      type = 'operation';
      match = spec.code.match(
        /export const (\w+)\s*=\s*define(?:Command|Query)/
      );
    }

    // Resolve output directory based on type
    const targetDir = getOutputDir(type, options, contractspecOptions);
    const filePath = join(targetDir, spec.fileName);

    if (!match && type === 'model') {
      if (spec.code.includes('new ZodSchemaType(')) {
        match = spec.code.match(/export const (\w+)\s*=\s*new ZodSchemaType\(/);
      } else if (spec.code.includes('new JsonSchemaType(')) {
        match = spec.code.match(
          /export const (\w+)\s*=\s*new JsonSchemaType\(/
        );
      } else if (spec.code.includes('new GraphQLSchemaType(')) {
        match = spec.code.match(
          /export const (\w+)\s*=\s*new GraphQLSchemaType\(/
        );
      }
      if (!match) {
        match = spec.code.match(/export const (\w+)\s*=/);
      }
    }

    if (dryRun) {
      logger.info(`[DRY RUN] Would create: ${filePath}`);
    } else {
      // Ensure directory exists
      const dir = dirname(filePath);
      const exists = await fs.exists(dir);
      if (!exists) {
        await fs.mkdir(dir);
      }

      // Write spec file
      await fs.writeFile(filePath, spec.code);
      logger.info(`Created: ${filePath}`);
    }

    files.push({
      path: filePath,
      operationId: spec.source.sourceId,
      specName: spec.fileName.replace('.ts', ''),
    });

    if (match) {
      const dir = dirname(filePath);
      const existing = specsByDir.get(dir) || [];
      existing.push({
        file: basename(filePath),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: match[1]!,
        type,
      });
      specsByDir.set(dir, existing);
    }
  }

  // Generate registries
  if (!dryRun && files.length > 0) {
    for (const [dir, specs] of specsByDir.entries()) {
      if (specs.length === 0) continue;

      // Detect dominant type
      const types = specs.map((s) => s.type);
      const isOperations = types.every((t) => t === 'operation');
      const isEvents = types.every((t) => t === 'event');
      const isModels = types.every((t) => t === 'model');

      // Generate Registry File
      let registryCode = `/**\n * Auto-generated registry file.\n */\n`;
      specs.forEach((s) => {
        const importPath = `./${basename(s.file, '.ts')}`;
        registryCode += `import { ${s.name} } from '${importPath}';\n`;
      });
      registryCode += '\n';

      let hasRegistry = false;
      if (isOperations) {
        registryCode += `import { OperationSpecRegistry } from '@contractspec/lib.contracts';\n\n`;
        registryCode += `export const operationRegistry = new OperationSpecRegistry();\n`;
        specs.forEach((s) => {
          registryCode += `operationRegistry.register(${s.name});\n`;
        });
        hasRegistry = true;
      } else if (isEvents) {
        registryCode += `import { EventRegistry } from '@contractspec/lib.contracts';\n\n`;
        registryCode += `export const eventRegistry = new EventRegistry();\n`;
        specs.forEach((s) => {
          registryCode += `eventRegistry.register(${s.name});\n`;
        });
        hasRegistry = true;
      } else if (isModels) {
        registryCode += `import { ModelRegistry } from '@contractspec/lib.contracts';\n\n`;
        registryCode += `export const modelRegistry = new ModelRegistry();\n`;
        specs.forEach((s) => {
          registryCode += `modelRegistry.register(${s.name});\n`;
        });
        hasRegistry = true;
      }

      if (hasRegistry) {
        const registryPath = join(dir, 'registry.ts');
        await fs.writeFile(registryPath, registryCode);
        logger.info(`Created/Updated registry: ${registryPath}`);
      }

      // Generate Index File
      let indexCode = `/**\n * Auto-generated barrel file.\n */\n\n`;
      specs.forEach((s) => {
        const importPath = `./${basename(s.file, '.ts')}`;
        indexCode += `export * from '${importPath}';\n`;
      });

      if (hasRegistry) {
        indexCode += `export * from './registry';\n`;
      }

      const indexPath = join(dir, 'index.ts');
      await fs.writeFile(indexPath, indexCode);
      logger.info(`Created/Updated index: ${indexPath}`);
    }
  }

  // Record skipped operations
  for (const skipped of importResult.skipped) {
    skippedOperations.push({
      operationId: skipped.sourceId,
      reason: skipped.reason,
    });
    logger.debug(`Skipped: ${skipped.sourceId} - ${skipped.reason}`);
  }

  // Record errors
  for (const error of importResult.errors) {
    errorMessages.push({
      operationId: error.sourceId,
      error: error.error,
    });
    logger.error(`Error: ${error.sourceId} - ${error.error}`);
  }

  return {
    imported: importResult.summary.imported,
    skipped: importResult.summary.skipped,
    errors: importResult.summary.errors,
    files,
    skippedOperations,
    errorMessages,
  };
}
