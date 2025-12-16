/**
 * Types for the Verification Service.
 */

import type { AnyContractSpec } from '@lssm/lib.contracts';
import type {
  VerificationTier,
  VerificationIssue,
  VerificationReport,
} from '@lssm/lib.contracts/llm';

/** Configuration for the verification service */
export interface VerifyConfig {
  /** Enable verbose logging */
  verbose?: boolean;
  /** API key for AI verification (tier 3) */
  aiApiKey?: string;
  /** AI provider for tier 3 verification */
  aiProvider?: 'anthropic' | 'openai' | 'local';
}

/** Options for running verification */
export interface VerifyOptions {
  /** Which tiers to run (default: all up to specified) */
  tiers?: VerificationTier[];
  /** Stop on first failure */
  failFast?: boolean;
  /** Include suggestions in report */
  includeSuggestions?: boolean;
}

/** Input for verification */
export interface VerifyInput {
  /** Spec to verify against */
  spec: AnyContractSpec;
  /** Implementation code to verify */
  implementationCode: string;
  /** Implementation file path (for error reporting) */
  implementationPath?: string;
}

/** Result of running all verification tiers */
export interface VerifyResult {
  /** Overall pass/fail */
  passed: boolean;
  /** Combined score (0-100) */
  score: number;
  /** Reports from each tier that was run */
  reports: Map<VerificationTier, VerificationReport>;
  /** All issues across all tiers */
  allIssues: VerificationIssue[];
  /** Summary message */
  summary: string;
  /** Duration in ms */
  duration: number;
}

/** Structure check result */
export interface StructureCheck {
  /** Check name */
  name: string;
  /** Check passed */
  passed: boolean;
  /** Details if failed */
  details?: string;
  /** Suggested fix */
  suggestion?: string;
}

/** Behavior check result */
export interface BehaviorCheck {
  /** Scenario or example name */
  name: string;
  /** Check type */
  type: 'scenario' | 'example' | 'error';
  /** Check passed */
  passed: boolean;
  /** Expected behavior */
  expected?: string;
  /** Actual behavior */
  actual?: string;
  /** Details */
  details?: string;
}

/** AI review result */
export interface AIReviewResult {
  /** Overall compliance */
  compliant: boolean;
  /** Confidence score (0-1) */
  confidence: number;
  /** Findings */
  findings: {
    category: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    location?: string;
    suggestion?: string;
  }[];
  /** Raw AI response */
  rawResponse?: string;
}

/** Field match type for semantic analysis */
export type FieldMatchType = 'exact' | 'compatible' | 'mismatch' | 'missing';

/** Field mapping between spec and implementation */
export interface FieldMapping {
  /** Field name from spec */
  specField: string;
  /** Field type from spec */
  specType: string;
  /** Corresponding field in implementation (if found) */
  implementationField?: string;
  /** Field type in implementation */
  implementationType?: string;
  /** Match quality */
  match: FieldMatchType;
  /** AI confidence in this mapping (0-1) */
  aiConfidence: number;
  /** Suggestion if mismatch */
  suggestion?: string;
}

/** Intent alignment analysis */
export interface IntentAlignment {
  /** Overall alignment score (0-100) */
  score: number;
  /** Issues with intent alignment */
  issues: string[];
  /** Suggestions for better alignment */
  suggestions: string[];
}

/** Full semantic verification result */
export interface SemanticVerificationResult {
  /** Field-by-field mappings */
  fieldMappings: FieldMapping[];
  /** Intent alignment analysis */
  intentAlignment: IntentAlignment;
  /** Additional semantic issues found */
  semanticIssues: {
    category: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
  }[];
  /** Raw AI response for debugging */
  rawResponse?: string;
}
