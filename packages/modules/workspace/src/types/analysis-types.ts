/**
 * Analysis-related type definitions.
 */

import type { Stability } from './spec-types';
import type { ContractSpecType } from '@contractspec/lib.contracts';

/**
 * Spec type detected from file analysis.
 * Covers all contract types from @contractspec/lib.contracts.
 */
export type AnalyzedSpecType = ContractSpecType | 'unknown';

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
/**
 * Operation kind detected from file analysis.
 */
export type AnalyzedOperationKind =
  | 'command'
  | 'query'
  | 'event'
  | 'presentation'
  | 'capability'
  | 'policy'
  | 'type'
  | 'example'
  | 'app-config'
  | 'integration'
  | 'workflow'
  | 'feature'
  | 'test-spec'
  | 'unknown';

/**
 * Reference information (name + version).
 */
export interface RefInfo {
  key: string;
  version: string;
}

/**
 * Test target extracted from a TestSpec.
 * Matches the TestTarget type from @contractspec/lib.contracts.
 */
export interface ExtractedTestTarget {
  type: 'operation' | 'workflow';
  key: string;
  version?: string;
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

  // Test target (for test-spec files)
  testTarget?: ExtractedTestTarget;
  testCoverage?: {
    hasSuccess: boolean;
    hasError: boolean;
  };

  // Extracted source code
  sourceBlock?: string;
}

/**
 * Result of scanning a feature file.
 */
export interface FeatureScanResult {
  filePath: string;
  key: string;
  version?: string;
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

  // Presentation target requirements
  presentationsTargets?: {
    key: string;
    version: string;
    targets: Record<string, unknown>[]; // untyped structure to decouple
  }[];

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
