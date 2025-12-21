/**
 * ContractSpec configuration schema definitions.
 *
 * These schemas define the structure of .contractsrc.json files
 * and are shared across CLI tools and libraries.
 */

import * as z from 'zod';

/**
 * OpenAPI source configuration for import/sync/validate operations.
 */
export const OpenApiSourceConfigSchema = z.object({
  /** Friendly name for the source */
  name: z.string(),
  /** Remote URL to fetch OpenAPI spec from */
  url: z.url().optional(),
  /** Local file path to OpenAPI spec */
  file: z.string().optional(),
  /** Sync mode: import (one-time), sync (update), validate (check only) */
  syncMode: z.enum(['import', 'sync', 'validate']).default('validate'),
  /** Only import operations with these tags */
  tags: z.array(z.string()).optional(),
  /** Exclude operations with these operationIds */
  exclude: z.array(z.string()).optional(),
  /** Include operations with these operationIds (overrides exclude) */
  include: z.array(z.string()).optional(),
  /** Prefix for generated spec names */
  prefix: z.string().optional(),
  /** Default stability for imported specs */
  defaultStability: z
    .enum(['experimental', 'beta', 'stable', 'deprecated'])
    .optional(),
  /** Default auth level for imported specs */
  defaultAuth: z.enum(['anonymous', 'user', 'admin']).optional(),
  /** Default owners for imported specs */
  defaultOwners: z.array(z.string()).optional(),
});
export const OpenApiExportConfigSchema = z.object({
  /** Output path for exported OpenAPI document */
  outputPath: z.string().default('./openapi.json'),
  /** Output format */
  format: z.enum(['json', 'yaml']).default('json'),
  /** API title for export */
  title: z.string().optional(),
  /** API version for export */
  version: z.string().optional(),
  /** API description for export */
  description: z.string().optional(),
  /** Server URLs to include in export */
  servers: z
    .array(
      z.object({
        url: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

/**
 * OpenAPI configuration section.
 */
export const OpenApiConfigSchema = z.object({
  /** External OpenAPI sources to import/sync from */
  sources: z.array(OpenApiSourceConfigSchema).optional(),
  /** Export configuration */
  export: OpenApiExportConfigSchema.optional(),
});

/**
 * Output directory conventions for generated specs.
 */
export const FolderConventionsSchema = z.object({
  models: z.string().default('models'),
  operations: z.string().default('operations/commands|queries'),
  events: z.string().default('events'),
  presentations: z.string().default('presentations'),
  forms: z.string().default('forms'),
});

/**
 * Full ContractSpec configuration schema (.contractsrc.json).
 */
export const ContractsrcSchema = z.object({
  aiProvider: z
    .enum(['claude', 'openai', 'ollama', 'custom'])
    .default('claude'),
  aiModel: z.string().optional(),
  agentMode: z
    .enum(['simple', 'cursor', 'claude-code', 'openai-codex'])
    .default('simple'),
  customEndpoint: z.url().nullable().optional(),
  customApiKey: z.string().nullable().optional(),
  outputDir: z.string().default('./src'),
  conventions: FolderConventionsSchema,
  defaultOwners: z.array(z.string()).default([]),
  defaultTags: z.array(z.string()).default([]),
  // Monorepo configuration
  packages: z.array(z.string()).optional(),
  excludePackages: z.array(z.string()).optional(),
  recursive: z.boolean().optional(),
  // OpenAPI configuration
  openapi: OpenApiConfigSchema.optional(),
});

// Type exports
export type OpenApiSourceConfig = z.infer<typeof OpenApiSourceConfigSchema>;
export type OpenApiExportConfig = z.infer<typeof OpenApiExportConfigSchema>;
export type OpenApiConfig = z.infer<typeof OpenApiConfigSchema>;
export type FolderConventions = z.infer<typeof FolderConventionsSchema>;
export type ContractsrcConfig = z.infer<typeof ContractsrcSchema>;

/**
 * Default configuration values.
 */
export const DEFAULT_CONTRACTSRC: ContractsrcConfig = {
  aiProvider: 'claude',
  agentMode: 'simple',
  outputDir: './src',
  conventions: {
    models: 'models',
    operations: 'interactions/commands|queries',
    events: 'events',
    presentations: 'presentations',
    forms: 'forms',
  },
  defaultOwners: [],
  defaultTags: [],
};
