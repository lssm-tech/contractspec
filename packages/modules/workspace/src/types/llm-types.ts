/**
 * LLM Export Types
 *
 * Type definitions for converting specs to LLM-friendly markdown formats.
 */

import type { Stability } from './spec-types';

/**
 * LLM export format options.
 * - **full**: Complete information including source code and all details (for deep LLM context)
 * - **prompt**: Concise with implementation instructions (actionable for LLM)
 * - **context**: Brief summary with counts and key fields (lightweight overview)
 */
export type LLMExportFormat = 'full' | 'prompt' | 'context';

/**
 * Agent types for implementation guides.
 */
export type AgentType = 'claude-code' | 'cursor-cli' | 'generic-mcp';

/**
 * Verification tier for implementation checks.
 */
export type VerificationTier = 'quick' | 'standard' | 'thorough';

/**
 * Reference to a related spec (operation, event, policy, test, etc.)
 */
export interface SpecRef {
  name: string;
  version: string;
}

/**
 * Metadata extracted from a parsed spec.
 */
export interface ParsedSpecMeta {
  /** Unique identifier for the spec */
  key: string;
  /** Version number */
  version: string;
  /** Human-readable description */
  description?: string;
  /** Stability level */
  stability?: Stability;
  /** Team or individual owners */
  owners?: string[];
  /** Categorization tags */
  tags?: string[];
  /** Business goal this spec achieves */
  goal?: string;
  /** Additional context for implementation */
  context?: string;
}

/**
 * Lightweight representation of a spec extracted from source code.
 * This is used for LLM export without requiring full compilation.
 */
export interface ParsedSpec {
  /** Spec metadata */
  meta: ParsedSpecMeta;
  /** Type of spec (operation, event, feature, etc.) */
  specType: string;
  /** For operations: command or query */
  kind?: 'command' | 'query' | 'unknown';
  /** Whether the spec defines input/output schemas */
  hasIo?: boolean;
  /** Whether the spec defines policy rules */
  hasPolicy?: boolean;
  /** Whether the spec defines a payload */
  hasPayload?: boolean;
  /** Whether the spec defines content */
  hasContent?: boolean;
  /** Whether the spec has a definition block */
  hasDefinition?: boolean;
  /** Events this spec may emit */
  emittedEvents?: SpecRef[];
  /** Policy specs referenced by this spec */
  policyRefs?: SpecRef[];
  /** Test specs associated with this spec */
  testRefs?: SpecRef[];
  /** Path to the source file */
  filePath?: string;
  /** The actual source code block of the spec */
  sourceBlock?: string;

  // Feature-specific fields
  /** Operations included in this feature */
  operations?: SpecRef[];
  /** Events included in this feature */
  events?: SpecRef[];
  /** Presentations included in this feature */
  presentations?: SpecRef[];
}

/**
 * Options for spec-to-markdown conversion.
 */
export interface SpecToMarkdownOptions {
  /** Export format */
  format: LLMExportFormat;
  /** Indentation depth for nested specs */
  depth?: number;
  /** Include source code blocks */
  includeSource?: boolean;
  /** Include implementation instructions */
  includeInstructions?: boolean;
}

/**
 * Result of LLM export operation.
 */
export interface LLMExportResult {
  /** Generated markdown content */
  content: string;
  /** Number of specs included */
  specCount: number;
  /** Format used for export */
  format: LLMExportFormat;
}

/**
 * Result of implementation verification.
 */
export interface VerificationResult {
  /** Whether verification passed */
  passed: boolean;
  /** Issues found during verification */
  issues: VerificationIssue[];
  /** Suggestions for improvement */
  suggestions: string[];
  /** Verification tier used */
  tier: VerificationTier;
}

/**
 * Single verification issue.
 */
export interface VerificationIssue {
  /** Severity of the issue */
  severity: 'error' | 'warning' | 'info';
  /** Issue message */
  message: string;
  /** Location in the spec or implementation */
  location?: string;
  /** Suggested fix */
  suggestion?: string;
}
