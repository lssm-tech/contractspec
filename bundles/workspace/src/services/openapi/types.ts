/**
 * Types for OpenAPI services.
 */

import type { OpenApiSourceConfig } from '@contractspec/lib.contracts';

/**
 * Options for OpenAPI import.
 */
export interface OpenApiImportServiceOptions {
  /** Source URL or file path */
  source: string;
  /** Output directory for generated spec files */
  outputDir: string;
  /** Prefix for generated spec names */
  prefix?: string;
  /** Only import operations with these tags */
  tags?: string[];
  /** Exclude operations with these operationIds */
  exclude?: string[];
  /** Default stability for imported specs */
  defaultStability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
  /** Default owners for imported specs */
  defaultOwners?: string[];
  /** Default auth level for imported specs */
  defaultAuth?: 'anonymous' | 'user' | 'admin';
  /** Dry run - show what would be imported without writing files */
  dryRun?: boolean;
}

/**
 * Result of OpenAPI import.
 */
export interface OpenApiImportServiceResult {
  /** Number of specs successfully imported */
  imported: number;
  /** Number of specs skipped */
  skipped: number;
  /** Number of errors */
  errors: number;
  /** List of imported spec files */
  files: {
    path: string;
    operationId: string;
    specName: string;
  }[];
  /** List of skipped operations */
  skippedOperations: {
    operationId: string;
    reason: string;
  }[];
  /** List of errors */
  errorMessages: {
    operationId: string;
    error: string;
  }[];
}

/**
 * Options for OpenAPI sync.
 */
export interface OpenApiSyncServiceOptions {
  /** Sources to sync (uses config if not provided) */
  sources?: OpenApiSourceConfig[];
  /** Source name to sync (if syncing single source) */
  sourceName?: string;
  /** Interactive mode - prompt for conflict resolution */
  interactive?: boolean;
  /** Force resolution mode */
  force?: 'openapi' | 'contractspec';
  /** Dry run - show what would change without writing */
  dryRun?: boolean;
}

/**
 * Result of OpenAPI sync.
 */
export interface OpenApiSyncServiceResult {
  /** Number of specs added */
  added: number;
  /** Number of specs updated */
  updated: number;
  /** Number of specs unchanged */
  unchanged: number;
  /** Number of conflicts */
  conflicts: number;
  /** Details of changes */
  changes: {
    operationId: string;
    action: 'added' | 'updated' | 'unchanged' | 'conflict';
    path?: string;
    changeCount?: number;
  }[];
}

/**
 * Options for OpenAPI validation.
 */
export interface OpenApiValidateServiceOptions {
  /** Spec file or directory to validate */
  specPath: string;
  /** OpenAPI source to validate against */
  openApiSource: string;
  /** Ignore description differences */
  ignoreDescriptions?: boolean;
  /** Ignore tag differences */
  ignoreTags?: boolean;
  /** Ignore transport differences (path, method) */
  ignoreTransport?: boolean;
}

/**
 * Result of OpenAPI validation.
 */
export interface OpenApiValidateServiceResult {
  /** Whether validation passed */
  valid: boolean;
  /** Number of specs validated */
  specsValidated: number;
  /** Number of specs with differences */
  specsWithDiffs: number;
  /** Validation details */
  results: {
    specPath: string;
    operationId?: string;
    valid: boolean;
    diffs: {
      path: string;
      type: string;
      description: string;
    }[];
  }[];
}

/**
 * Options for OpenAPI export.
 */
export interface OpenApiExportServiceOptions {
  /** Path to module exporting OperationSpecRegistry */
  registryPath: string;
  /** Output file path */
  outputPath?: string;
  /** Output format */
  format?: 'json' | 'yaml';
  /** OpenAPI title */
  title?: string;
  /** OpenAPI version */
  version?: string;
  /** OpenAPI description */
  description?: string;
  /** Server URLs to include */
  servers?: {
    url: string;
    description?: string;
  }[];
}

/**
 * Result of OpenAPI export.
 */
export interface OpenApiExportServiceResult {
  /** Output file path */
  outputPath: string;
  /** Generated content */
  content: string;
  /** Number of operations exported */
  operationCount: number;
}
