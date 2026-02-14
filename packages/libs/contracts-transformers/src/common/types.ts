/**
 * Common types for contract transformations.
 */

import type { AnyOperationSpec } from '@contractspec/lib.contracts-spec';

/**
 * Source information for imported specs.
 */
export interface SpecSource {
  /** The format the spec was imported from */
  type: 'openapi' | 'asyncapi' | 'graphql' | 'protobuf';
  /** URL if fetched from remote */
  url?: string;
  /** File path if loaded from local file */
  file?: string;
  /** Original identifier in source format */
  sourceId: string;
  /** Timestamp of import */
  importedAt: Date;
}

/**
 * Transport hints preserved from external formats.
 * These enable accurate round-trip transformations.
 */
export interface TransportHints {
  rest?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    path: string;
    params?: {
      path?: string[];
      query?: string[];
      header?: string[];
      cookie?: string[];
    };
  };
  graphql?: {
    type: 'query' | 'mutation' | 'subscription';
    fieldName: string;
  };
}

/**
 * Result of importing a single spec from an external format.
 */
export interface ImportedOperationSpec {
  /**
   * The generated ContractSpec.
   * Optional because during code generation the actual spec object is not
   * available until the generated code is executed at runtime.
   */
  operationSpec?: AnyOperationSpec;
  /** Generated TypeScript code for the spec */
  code: string;
  /** Suggested file name for the spec */
  fileName: string;
  /** Group folder for organizing the file (based on grouping config) */
  groupFolder?: string;
  /** Source information for provenance tracking */
  source: SpecSource;
  /** Transport hints for accurate round-trips */
  transportHints: TransportHints;
}

/**
 * Result of an import operation.
 */
export interface ImportResult {
  /** Successfully imported specs */
  operationSpecs: ImportedOperationSpec[];
  /** Specs that were skipped (e.g., unsupported features) */
  skipped: {
    sourceId: string;
    reason: string;
  }[];
  /** Errors encountered during import */
  errors: {
    sourceId: string;
    error: string;
  }[];
  /** Summary statistics */
  summary: {
    total: number;
    imported: number;
    skipped: number;
    errors: number;
  };
}

/**
 * Type of change detected during diff.
 */
export type DiffChangeType =
  | 'added'
  | 'removed'
  | 'modified'
  | 'type_changed'
  | 'required_changed';

/**
 * A single change detected during diff.
 */
export interface DiffChange {
  /** JSON path to the changed property */
  path: string;
  /** Type of change */
  type: DiffChangeType;
  /** Previous value (for modified/removed) */
  oldValue?: unknown;
  /** New value (for modified/added) */
  newValue?: unknown;
  /** Human-readable description of the change */
  description: string;
}

/**
 * Result of diffing two specs.
 */
export interface SpecDiff {
  /** Identifier for the operation */
  operationId: string;
  /** Existing ContractSpec (if any) */
  existing?: AnyOperationSpec;
  /** Incoming imported spec */
  incoming: ImportedOperationSpec;
  /** List of detected changes */
  changes: DiffChange[];
  /** Whether specs are semantically equivalent */
  isEquivalent: boolean;
  /** User's resolution choice (for interactive sync) */
  resolution?: 'keep' | 'replace' | 'merge' | 'skip';
}

/**
 * Result of a sync operation.
 */
export interface SyncResult {
  /** Specs that were added (new imports) */
  added: ImportedOperationSpec[];
  /** Specs that were updated */
  updated: {
    spec: ImportedOperationSpec;
    changes: DiffChange[];
  }[];
  /** Specs that were kept unchanged */
  unchanged: string[];
  /** Specs that had conflicts requiring resolution */
  conflicts: SpecDiff[];
  /** Summary statistics */
  summary: {
    added: number;
    updated: number;
    unchanged: number;
    conflicts: number;
  };
}

/**
 * Validation result for a single spec.
 */
export interface ValidationResult {
  /** Whether the spec is valid against the source */
  valid: boolean;
  /** Detected differences */
  diffs: DiffChange[];
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}
