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
