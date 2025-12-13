/**
 * Analysis-related type definitions.
 */

import type { Stability } from './spec-types';

/**
 * Spec type detected from file analysis.
 */
export type AnalyzedSpecType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'workflow'
  | 'data-view'
  | 'migration'
  | 'telemetry'
  | 'experiment'
  | 'app-config'
  | 'integration'
  | 'knowledge'
  | 'form'
  | 'unknown';

/**
 * Operation kind detected from file analysis.
 */
export type AnalyzedOperationKind = 'command' | 'query' | 'unknown';

/**
 * Result of scanning a spec source file.
 */
export interface SpecScanResult {
  filePath: string;
  specType: AnalyzedSpecType;
  name?: string;
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
  name: string;
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
