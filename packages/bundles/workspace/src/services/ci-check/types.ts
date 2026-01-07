/**
 * CI Check service types.
 *
 * Types for CI/CD validation checks with support for multiple output formats.
 */

/**
 * Categories of CI checks.
 */
export type CICheckCategory =
  | 'structure'
  | 'integrity'
  | 'deps'
  | 'doctor'
  | 'handlers'
  | 'tests'
  | 'test-refs'
  | 'coverage'
  | 'implementation'
  | 'layers'
  | 'drift';

/**
 * All available CI check categories.
 */
export const ALL_CI_CHECK_CATEGORIES: CICheckCategory[] = [
  'structure',
  'integrity',
  'deps',
  'doctor',
  'handlers',
  'tests',
  'test-refs',
  'coverage',
  'implementation',
  'layers',
  'drift',
];

/**
 * Human-readable labels for CI check categories.
 */
export const CI_CHECK_CATEGORY_LABELS: Record<CICheckCategory, string> = {
  structure: 'Spec Structure Validation',
  integrity: 'Contract Integrity Analysis',
  deps: 'Dependency Analysis',
  doctor: 'Installation Health',
  handlers: 'Handler Implementation',
  tests: 'Test Coverage',
  'test-refs': 'Test Reference Validation',
  coverage: 'Coverage Goal Enforcement',
  implementation: 'Implementation Verification',
  layers: 'Contract Layers Validation',
  drift: 'Drift Detection',
};

/**
 * Severity of a CI check issue.
 */
export type CIIssueSeverity = 'error' | 'warning' | 'note';

/**
 * A single issue found during CI checks.
 */
export interface CIIssue {
  /** Unique ID for the issue type. */
  ruleId: string;
  /** Severity level. */
  severity: CIIssueSeverity;
  /** Human-readable message. */
  message: string;
  /** Category of the check. */
  category: CICheckCategory;
  /** File path where the issue was found. */
  file?: string;
  /** Line number (1-based). */
  line?: number;
  /** Column number (1-based). */
  column?: number;
  /** End line number (1-based). */
  endLine?: number;
  /** End column number (1-based). */
  endColumn?: number;
  /** Additional context. */
  context?: Record<string, unknown>;
}

/**
 * Summary statistics for a CI check category.
 */
export interface CICheckCategorySummary {
  /** Category name. */
  category: CICheckCategory;
  /** Human-readable label. */
  label: string;
  /** Number of errors. */
  errors: number;
  /** Number of warnings. */
  warnings: number;
  /** Number of notes. */
  notes: number;
  /** Whether this category passed. */
  passed: boolean;
  /** Duration in milliseconds. */
  durationMs: number;
}

/**
 * Overall CI check result.
 */
export interface CICheckResult {
  /** Whether all checks passed (no errors). */
  success: boolean;
  /** Total number of errors. */
  totalErrors: number;
  /** Total number of warnings. */
  totalWarnings: number;
  /** Total number of notes. */
  totalNotes: number;
  /** All issues found. */
  issues: CIIssue[];
  /** Summary by category. */
  categories: CICheckCategorySummary[];
  /** Total duration in milliseconds. */
  durationMs: number;
  /** Timestamp when the check was run. */
  timestamp: string;
  /** Git commit SHA if available. */
  commitSha?: string;
  /** Git branch if available. */
  branch?: string;
}

/**
 * Options for running CI checks.
 */
export interface CICheckOptions {
  /** Glob pattern for spec discovery. */
  pattern?: string;
  /** Check categories to run (defaults to all). */
  checks?: CICheckCategory[];
  /** Skip specific categories. */
  skip?: CICheckCategory[];
  /** Include handler existence checks. */
  checkHandlers?: boolean;
  /** Include test coverage checks. */
  checkTests?: boolean;
  /** Include drift detection checks. */
  checkDrift?: boolean;
  /** Fail on warnings (treat warnings as errors). */
  failOnWarnings?: boolean;
  /** Workspace root directory. */
  workspaceRoot?: string;
  /** Implementation check options. */
  implementation?: {
    /** Require all specs to be implemented. */
    requireImplemented?: boolean;
    /** Verification tier to run. */
    verificationTier?: 'structure' | 'behavior' | 'ai';
    /** Use cache for verification results. */
    useCache?: boolean;
    /** Allow partial implementations. */
    allowPartial?: boolean;
  };
}

/**
 * Output format for CI check results.
 */
export type CIOutputFormat = 'text' | 'json' | 'sarif';

/**
 * Options for formatting CI check output.
 */
export interface CIFormatOptions {
  /** Output format. */
  format: CIOutputFormat;
  /** Whether to use colors (for text format). */
  colors?: boolean;
  /** Tool name for SARIF output. */
  toolName?: string;
  /** Tool version for SARIF output. */
  toolVersion?: string;
  /** Repository URI for SARIF output. */
  repositoryUri?: string;
}
