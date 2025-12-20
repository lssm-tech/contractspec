import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Config, OpenApiSource, OpenApiConfig } from './config';
import { findPackageRoot } from '@lssm/bundle.contractspec-workspace';

/**
 * Path to the config file.
 */
const CONFIG_FILE = '.contractsrc.json';

/**
 * Read the current config file, or return an empty object if it doesn't exist.
 */
export async function readConfigFile(
  cwd: string = process.cwd()
): Promise<Partial<Config>> {
  const packageRoot = findPackageRoot(cwd);
  const configPath = join(packageRoot, CONFIG_FILE);

  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content) as Partial<Config>;
  } catch {
    return {};
  }
}

/**
 * Write the config file.
 */
export async function writeConfigFile(
  config: Partial<Config>,
  cwd: string = process.cwd()
): Promise<void> {
  const packageRoot = findPackageRoot(cwd);
  const configPath = join(packageRoot, CONFIG_FILE);

  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Upsert an OpenAPI source in the config.
 * If a source with the same name exists, it is updated.
 * Otherwise, the source is added.
 */
export async function upsertOpenApiSource(
  source: OpenApiSource,
  cwd: string = process.cwd()
): Promise<void> {
  const config = await readConfigFile(cwd);

  // Initialize openapi section if not present
  if (!config.openapi) {
    config.openapi = {};
  }

  // Initialize sources array if not present
  if (!config.openapi.sources) {
    config.openapi.sources = [];
  }

  // Find existing source by name
  const existingIndex = config.openapi.sources.findIndex(
    (s: OpenApiSource) => s.name === source.name
  );

  if (existingIndex >= 0) {
    // Update existing source
    config.openapi.sources[existingIndex] = source;
  } else {
    // Add new source
    config.openapi.sources.push(source);
  }

  await writeConfigFile(config, cwd);
}

/**
 * Get all configured OpenAPI sources.
 */
export async function getOpenApiSources(
  cwd: string = process.cwd()
): Promise<OpenApiSource[]> {
  const config = await readConfigFile(cwd);
  return config.openapi?.sources ?? [];
}

/**
 * Get the output directory for a spec type based on conventions.
 */
export function getOutputDirForSpecType(
  specType: 'operation' | 'event' | 'presentation' | 'form' | 'model',
  config: Config
): string {
  const baseDir = config.outputDir ?? './src';
  const conventions = config.conventions;

  switch (specType) {
    case 'operation':
      // For operations, use the first part of the convention (before |)
      const opPath = conventions.operations.split('|')[0] ?? 'operations';
      return join(baseDir, opPath);
    case 'event':
      return join(baseDir, conventions.events);
    case 'presentation':
      return join(baseDir, conventions.presentations);
    case 'form':
      return join(baseDir, conventions.forms);
    case 'model':
      // Models go in a shared 'models' or 'schemas' directory
      return join(baseDir, 'models');
    default:
      return baseDir;
  }
}
