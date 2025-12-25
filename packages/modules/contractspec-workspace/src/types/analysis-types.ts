/**
 * Analysis-related type definitions.
 */

import type { Stability } from './spec-types';

/**
 * Spec type detected from file analysis.
 * Covers all contract types from @lssm/lib.contracts.
 */
export type AnalyzedSpecType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'feature'
  | 'capability'
  | 'data-view'
  | 'form'
  | 'migration'
  | 'workflow'
  | 'experiment'
  | 'integration'
  | 'knowledge'
  | 'telemetry'
  | 'app-config'
  | 'policy'
  | 'test-spec'
  | 'unknown';

/**
 * Types that can be referenced by features.
 */
export type RefType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'capability'
  | 'experiment'
  | 'policy'
  | 'test';

/**
 * Operation kind detected from file analysis.
 */
export type AnalyzedOperationKind = 'command' | 'query' | 'unknown';

/**
 * Reference information (name + version).
 */
export interface RefInfo {
  key: string;
  version: number;
}

/**
 * A reference extracted from source code with location context.
 */
export interface ExtractedRef {
  type: RefType;
  key: string;
  version: number;
  sourceFile: string;
  sourceLine?: number;
}

/**
 * Result of scanning a spec source file.
 */
export interface SpecScanResult {
  filePath: string;
  specType: AnalyzedSpecType;
  key?: string;
  version?: number;
  kind?: AnalyzedOperationKind;
  stability?: Stability;
  description?: string;
  owners?: string[];
  tags?: string[];

  // Structural hints (used for deps/diff heuristics without executing code)
  hasMeta: boolean;
  hasIo: boolean;
  hasPolicy: boolean;
  hasPayload: boolean;
  hasContent: boolean;
  hasDefinition: boolean;

  // References extracted from spec (e.g., emitted events)
  emittedEvents?: RefInfo[];
  policyRefs?: RefInfo[];
  testRefs?: RefInfo[];
}

/**
 * Result of scanning a feature file.
 */
export interface FeatureScanResult {
  filePath: string;
  key: string;
  title?: string;
  description?: string;
  domain?: string;
  stability?: Stability;
  owners?: string[];
  tags?: string[];

  // Referenced specs
  operations: RefInfo[];
  events: RefInfo[];
  presentations: RefInfo[];
  experiments: RefInfo[];

  // Capability bindings
  capabilities: {
    provides: RefInfo[];
    requires: RefInfo[];
  };

  // Op to presentation links
  opToPresentationLinks: { op: RefInfo; pres: RefInfo }[];
}

/**
 * Semantic diff item types.
 */
export type SemanticDiffType = 'breaking' | 'changed' | 'added' | 'removed';

/**
 * A single semantic difference between two specs.
 */
export interface SemanticDiffItem {
  type: SemanticDiffType;
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
  description: string;
}

/**
 * Options for semantic diff computation.
 */
export interface SemanticDiffOptions {
  breakingOnly?: boolean;
}

/**
 * A node in the contract dependency graph.
 */
export interface ContractNode {
  key: string;
  file: string;
  dependencies: string[];
  dependents: string[];
}

/**
 * The contract dependency graph.
 */
export type ContractGraph = Map<string, ContractNode>;

/**
 * Result of spec structure validation.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
