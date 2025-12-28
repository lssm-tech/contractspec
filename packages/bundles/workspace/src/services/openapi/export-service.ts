/**
 * OpenAPI export service - generates OpenAPI documents from OperationSpecRegistry.
 */

import {
  type OpenApiDocument,
  openApiForRegistry,
  type OpenApiServer,
  OperationSpecRegistry,
} from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';

/**
 * Options for OpenAPI export.
 */
export interface OpenApiExportOptions {
  /**
   * Path to module exporting OperationSpecRegistry.
   */
  registryPath: string;

  /**
   * Output file path.
   */
  outputPath?: string;

  /**
   * OpenAPI title.
   */
  title?: string;

  /**
   * OpenAPI version.
   */
  version?: string;

  /**
   * OpenAPI description.
   */
  description?: string;

  /**
   * Server URLs to include.
   */
  servers?: OpenApiServer[];
}

/**
 * Result of OpenAPI export.
 */
export interface OpenApiExportResult {
  document: OpenApiDocument;
  outputPath: string;
  json: string;
}

/**
 * Module that exports a OperationSpecRegistry.
 */
interface LoadedRegistryModule {
  default?: unknown;
  createRegistry?: () => Promise<OperationSpecRegistry> | OperationSpecRegistry;
  registry?: OperationSpecRegistry;
}

/**
 * Export OpenAPI document from a OperationSpecRegistry.
 */
export async function exportOpenApi(
  options: OpenApiExportOptions,
  adapters: { fs: FsAdapter; logger: LoggerAdapter }
): Promise<OpenApiExportResult> {
  const { fs, logger } = adapters;
  const { registryPath, outputPath = './openapi.json' } = options;

  logger.info('Loading registry...', { registryPath });

  // Load the registry
  const registry = await loadRegistry(registryPath, fs);

  logger.info('Generating OpenAPI document...');

  // Generate OpenAPI document
  const document = openApiForRegistry(registry, {
    title: options.title,
    version: options.version,
    description: options.description,
    servers: options.servers,
  });

  // Serialize to JSON
  const json = JSON.stringify(document, null, 2) + '\n';

  // Resolve output path
  const resolvedPath = fs.resolve(outputPath);

  // Ensure directory exists
  await fs.mkdir(fs.dirname(resolvedPath));

  // Write file
  await fs.writeFile(resolvedPath, json);

  logger.info(`OpenAPI document written to ${resolvedPath}`);

  return {
    document,
    outputPath: resolvedPath,
    json,
  };
}

/**
 * Load a OperationSpecRegistry from a module.
 */
async function loadRegistry(
  modulePath: string,
  fs: FsAdapter
): Promise<OperationSpecRegistry> {
  // Resolve absolute path
  const absPath = fs.resolve(modulePath);

  // Dynamic import
  const exports = (await import(absPath)) as LoadedRegistryModule;

  // Check if exports is already a registry
  if (exports instanceof OperationSpecRegistry) {
    return exports;
  }

  // Check if registry property exists
  if (exports.registry instanceof OperationSpecRegistry) {
    return exports.registry;
  }

  // Check for factory function
  const factory =
    typeof exports.createRegistry === 'function'
      ? exports.createRegistry
      : typeof exports.default === 'function'
        ? (exports.default as () =>
            | Promise<OperationSpecRegistry>
            | OperationSpecRegistry)
        : undefined;

  if (factory) {
    const result = await factory();
    if (result instanceof OperationSpecRegistry) {
      return result;
    }
  }

  throw new Error(
    `Registry module ${modulePath} must export a OperationSpecRegistry instance or a factory function returning one.`
  );
}
