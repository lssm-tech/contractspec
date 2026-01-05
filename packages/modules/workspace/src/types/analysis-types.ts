/**
 * Analysis-related type definitions.
 */

import type { Stability } from './spec-types';

/**
 * Spec type detected from file analysis.
 * Covers all contract types from @contractspec/lib.contracts.
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
  version: string;
}

/**
 * Test target information (operation/workflow).
 */
export interface TestTargetRef extends RefInfo {
  type: 'operation' | 'workflow';
}

/**
 * A reference extracted from source code with location context.
 */
export interface ExtractedRef {
  type: RefType;
  key: string;
  version: string;
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
  version?: string;
  kind?: AnalyzedOperationKind;
  stability?: Stability;
  description?: string;
  goal?: string;
  context?: string;
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
  testTargets?: TestTargetRef[];

  // Extracted source code
  sourceBlock?: string;
}

/**
 * Result of scanning a feature file.
 */
export interface FeatureScanResult {
  filePath: string;
  key: string;
  title?: string;
  description?: string;
  goal?: string;
  context?: string;
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

  // Extracted source code
  sourceBlock?: string;
}

/**
 * Result of scanning an example file.
 */
export interface ExampleScanResult {
  filePath: string;
  key: string;
  version?: string;
  title?: string;
  description?: string;
  summary?: string;
  kind?: string;
  visibility?: string;
  stability?: Stability;
  owners?: string[];
  tags?: string[];
  domain?: string;

  // Documentation references
  docs?: {
    rootDocId?: string;
    goalDocId?: string;
    usageDocId?: string;
  };

  // Surface support
  surfaces: {
    templates: boolean;
    sandbox: { enabled: boolean; modes: string[] };
    studio: { enabled: boolean; installable: boolean };
    mcp: { enabled: boolean };
  };

  // Entrypoints
  entrypoints: {
    packageName: string;
    feature?: string;
    blueprint?: string;
    contracts?: string;
    presentations?: string;
    handlers?: string;
    ui?: string;
    docs?: string;
  };
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
