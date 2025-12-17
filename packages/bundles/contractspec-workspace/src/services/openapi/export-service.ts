/**
 * OpenAPI export service - generates OpenAPI documents from SpecRegistry.
 */

import {
  SpecRegistry,
  openApiForRegistry,
  type OpenApiServer,
  type OpenApiDocument,
} from '@lssm/lib.contracts';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';

/**
 * Options for OpenAPI export.
 */
export interface OpenApiExportOptions {
  /**
   * Path to module exporting SpecRegistry.
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
 * Module that exports a SpecRegistry.
 */
interface LoadedRegistryModule {
  default?: unknown;
  createRegistry?: () => Promise<SpecRegistry> | SpecRegistry;
  registry?: SpecRegistry;
}

/**
 * Export OpenAPI document from a SpecRegistry.
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
 * Load a SpecRegistry from a module.
 */
async function loadRegistry(
  modulePath: string,
  fs: FsAdapter
): Promise<SpecRegistry> {
  // Resolve absolute path
  const absPath = fs.resolve(modulePath);

  // Dynamic import
  const exports = (await import(absPath)) as LoadedRegistryModule;

  // Check if exports is already a registry
  if (exports instanceof SpecRegistry) {
    return exports;
  }

  // Check if registry property exists
  if (exports.registry instanceof SpecRegistry) {
    return exports.registry;
  }

  // Check for factory function
  const factory =
    typeof exports.createRegistry === 'function'
      ? exports.createRegistry
      : typeof exports.default === 'function'
        ? (exports.default as () => Promise<SpecRegistry> | SpecRegistry)
        : undefined;

  if (factory) {
    const result = await factory();
    if (result instanceof SpecRegistry) {
      return result;
    }
  }

  throw new Error(
    `Registry module ${modulePath} must export a SpecRegistry instance or a factory function returning one.`
  );
}
