import type { ModuleSchemaContribution } from '@lssm/lib.schema';

/**
 * Configuration for schema generation and composition.
 */
export interface SchemaConfig {
  /** Module schema contributions to include */
  modules: ModuleSchemaContribution[];
  /** Prisma datasource provider (default: 'postgresql') */
  provider?: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'sqlserver';
  /** Output path for generated Prisma schema */
  outputPath?: string;
  /** Prisma client output directory */
  clientOutput?: string;
  /** Include Pothos generator (default: true) */
  includePothos?: boolean;
  /** Pothos output path */
  pothosOutput?: string;
}

/**
 * Define a schema configuration.
 */
export function defineSchemaConfig(config: SchemaConfig): SchemaConfig {
  return config;
}

/**
 * Load schema configuration from a file.
 */
export async function loadSchemaConfig(configPath: string): Promise<SchemaConfig | null> {
  try {
    // Try to import as ESM module
    const absolutePath = configPath.startsWith('/')
      ? configPath
      : `${process.cwd()}/${configPath}`;
    
    const module = await import(absolutePath);
    return module.default ?? module.config ?? module;
  } catch (error) {
    console.error(`Failed to load schema config from ${configPath}:`, error);
    return null;
  }
}

/**
 * Re-export types for convenience.
 */
export type { ModuleSchemaContribution };

