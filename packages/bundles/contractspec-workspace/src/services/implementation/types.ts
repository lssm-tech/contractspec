/**
 * Types for implementation tracking and verification.
 */

import type { ImplementationType } from '@lssm/lib.contracts';

/**
 * Source of how an implementation was discovered/linked.
 */
export type ImplementationSource = 'explicit' | 'discovered' | 'convention';

/**
 * Status of a spec's implementation coverage.
 */
export type ImplementationStatus = 'implemented' | 'partial' | 'missing';

/**
 * A resolved implementation file for a spec.
 */
export interface ResolvedImplementation {
  /** Path to the implementation file (relative to workspace root) */
  path: string;
  /** Type of implementation artifact */
  type: ImplementationType;
  /** How this implementation was found */
  source: ImplementationSource;
  /** Whether the file exists on disk */
  exists: boolean;
  /** Content hash for cache invalidation (SHA256) */
  contentHash?: string;
  /** Optional description */
  description?: string;
}

/**
 * Full resolution result for a spec's implementations.
 */
export interface SpecImplementationResult {
  /** Spec key */
  specKey: string;
  /** Spec version */
  specVersion: number;
  /** Path to the spec file */
  specPath: string;
  /** Spec type (operation, event, presentation, etc.) */
  specType: string;
  /** All resolved implementations */
  implementations: ResolvedImplementation[];
  /** Overall implementation status */
  status: ImplementationStatus;
  /** Content hash of the spec file */
  specHash?: string;
}

/**
 * Options for implementation discovery.
 */
export interface DiscoveryOptions {
  /** Workspace root directory */
  workspaceRoot?: string;
  /** Glob patterns to search */
  includePatterns?: string[];
  /** Glob patterns to exclude */
  excludePatterns?: string[];
  /** Whether to compute content hashes */
  computeHashes?: boolean;
}

/**
 * Result of scanning for spec references in a file.
 */
export interface SpecReferenceMatch {
  /** Path to the file containing the reference */
  filePath: string;
  /** Key of the spec being referenced */
  specKey: string;
  /** Type of reference (import, typeof, handler) */
  referenceType: 'import' | 'typeof' | 'handler' | 'unknown';
  /** Line number where reference was found */
  lineNumber?: number;
  /** Inferred implementation type based on context */
  inferredType: ImplementationType;
}
