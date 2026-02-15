/**
 * Fix service types.
 *
 * Types for fixing integrity issues found by CI checks.
 */

import type { AnalyzedSpecType, RefInfo } from '@contractspec/module.workspace';
import type { Stability } from '@contractspec/lib.contracts-spec';
import type { IntegrityIssue } from '../integrity';

/**
 * Available fix strategies.
 */
export type FixStrategyType =
  | 'remove-reference'
  | 'implement-skeleton'
  | 'implement-ai';

/**
 * Human-readable labels for fix strategies.
 */
export const FIX_STRATEGY_LABELS: Record<FixStrategyType, string> = {
  'remove-reference': 'Remove broken reference from feature',
  'implement-skeleton': 'Create skeleton spec (in_creation)',
  'implement-ai': 'Create spec with AI assistance (experimental)',
};

/**
 * Stability level for each fix strategy when creating specs.
 */
export const FIX_STRATEGY_STABILITY: Record<
  Exclude<FixStrategyType, 'remove-reference'>,
  Stability
> = {
  'implement-skeleton': 'in_creation',
  'implement-ai': 'experimental',
};

/**
 * A fixable issue with context for fix generation.
 */
export interface FixableIssue {
  /** Original integrity issue. */
  issue: IntegrityIssue;
  /** Reference info (key, version). */
  ref: RefInfo;
  /** Spec type to create. */
  specType: AnalyzedSpecType;
  /** Feature file containing the broken reference. */
  featureFile: string;
  /** Feature key that has the broken reference. */
  featureKey: string;
  /** Available strategies for this issue. */
  availableStrategies: FixStrategyType[];
  /** Deprecated: kept for compatibility if needed, or remove if unused */
  strategies: unknown[];
}

/**
 * File change result from applying a fix.
 */
export interface FixFileChange {
  /** File path. */
  path: string;
  /** Action taken. */
  action: 'created' | 'modified' | 'deleted';
  /** Previous content (for undo). */
  previousContent?: string;
}

/**
 * Result of applying a single fix.
 */
export interface FixResult {
  /** Whether the fix succeeded. */
  success: boolean;
  /** Strategy used. */
  strategy: FixStrategyType;
  /** Original issue that was fixed. */
  issue: FixableIssue;
  /** Files that were changed. */
  filesChanged: FixFileChange[];
  /** Message describing the outcome. */
  message?: string;
  /** Error message if fix failed. */
  error?: string;
}

/**
 * Result of applying multiple fixes.
 */
export interface BatchFixResult {
  /** Total number of issues processed. */
  total: number;
  /** Number of successful fixes. */
  succeeded: number;
  /** Number of failed fixes. */
  failed: number;
  /** Individual fix results. */
  results: FixResult[];
}

/**
 * AI configuration for implement-ai strategy.
 */
export interface FixAIConfig {
  /** AI provider to use. */
  provider: 'claude' | 'openai' | 'ollama' | 'custom';
  /** Model to use. */
  model?: string;
  /** Custom endpoint. */
  endpoint?: string;
  /** API key (if not using env var). */
  apiKey?: string;
}

/**
 * Options for the fix service.
 */
export interface FixOptions {
  /** Working directory. */
  workspaceRoot: string;
  /** Fix strategy to use. */
  strategy: FixStrategyType;
  /** Dry run mode (preview changes without applying). */
  dryRun?: boolean;
  /** Interactive mode for confirmations. */
  interactive?: boolean;
  /** AI config for implement-ai strategy. */
  aiConfig?: FixAIConfig;
  /** Output directory for new specs (optional, uses config default). */
  outputDir?: string;
  /** Format files after creation. */
  format?: boolean;
}

/**
 * Request to fix multiple issues.
 */
export interface BatchFixRequest {
  /** Issues to fix. */
  issues: FixableIssue[];
  /** Options for fixing. */
  options: FixOptions;
}

/**
 * Context for spec generation.
 */
export interface SpecGenerationContext {
  /** Spec key (e.g., "docs.search"). */
  key: string;
  /** Spec version (e.g., "1.0.0"). */
  version: string;
  /** Spec type. */
  specType: AnalyzedSpecType;
  /** Stability level. */
  stability: Stability;
  /** Description (may be inferred from key). */
  description?: string;
  /** Feature key that references this spec. */
  featureKey?: string;
  /** Additional enrichment from AI or user. */
  enrichment?: {
    goal?: string;
    context?: string;
    owners?: string[];
    tags?: string[];
  };
}

/**
 * Types of fix links for external surfaces.
 */
export type FixLinkType = 'cli' | 'vscode' | 'github-issue';

/**
 * A fix link for external surfaces (PR comments, etc.).
 */
export interface FixLink {
  /** Type of link. */
  type: FixLinkType;
  /** Display label. */
  label: string;
  /** Link value (command or URL). */
  value: string;
}

/**
 * Options for generating fix links.
 */
export interface FixLinkOptions {
  /** GitHub repository (owner/repo). */
  repository?: string;
  /** Base branch for issues. */
  baseBranch?: string;
  /** Include CLI commands. */
  includeCli?: boolean;
  /** Include VSCode deep links. */
  includeVscode?: boolean;
  /** Include GitHub issue links. */
  includeGithubIssue?: boolean;
}

/**
 * Extended CI issue with fix links.
 */
export interface CIIssueWithFixLinks {
  /** Original issue properties. */
  ruleId: string;
  severity: 'error' | 'warning' | 'note';
  message: string;
  category: string;
  file?: string;
  line?: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  context?: Record<string, unknown>;
  /** Fix links for this issue. */
  fixLinks?: FixLink[];
}

/**
 * Interface for a fix strategy implementation.
 */
export interface FixStrategy {
  /**
   * type of the strategy
   */
  readonly type: FixStrategyType;

  /**
   * Apply the fix.
   */
  fix(issue: FixableIssue, options: FixOptions): Promise<FixResult>;
}
