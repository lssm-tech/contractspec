/**
 * Doctor service types.
 *
 * Types for health checks and auto-fix functionality.
 */

/**
 * Categories of health checks.
 */
export type CheckCategory =
  | 'cli'
  | 'config'
  | 'mcp'
  | 'deps'
  | 'workspace'
  | 'ai';

/**
 * All available check categories.
 */
export const ALL_CHECK_CATEGORIES: CheckCategory[] = [
  'cli',
  'config',
  'mcp',
  'deps',
  'workspace',
  'ai',
];

/**
 * Human-readable labels for check categories.
 */
export const CHECK_CATEGORY_LABELS: Record<CheckCategory, string> = {
  cli: 'CLI Installation',
  config: 'Configuration Files',
  mcp: 'MCP Server',
  deps: 'Dependencies',
  workspace: 'Workspace Structure',
  ai: 'AI Provider',
};

/**
 * Status of a health check.
 */
export type CheckStatus = 'pass' | 'warn' | 'fail' | 'skip';

/**
 * Result of applying a fix.
 */
export interface FixResult {
  /** Whether the fix was successful. */
  success: boolean;
  /** Message describing the result. */
  message: string;
}

/**
 * An action that can fix a failed check.
 */
export interface FixAction {
  /** Description of what the fix will do. */
  description: string;
  /** Function to apply the fix. */
  apply: () => Promise<FixResult>;
}

/**
 * Result of a single health check.
 */
export interface CheckResult {
  /** Category of the check. */
  category: CheckCategory;
  /** Name of the specific check. */
  name: string;
  /** Status of the check. */
  status: CheckStatus;
  /** Human-readable message. */
  message: string;
  /** Optional fix action if status is 'fail' or 'warn'. */
  fix?: FixAction;
  /** Additional details for debugging. */
  details?: string;
}

/**
 * Options for running the doctor.
 */
export interface DoctorOptions {
  /** Root directory of the workspace. */
  workspaceRoot: string;
  /** Categories to check (defaults to all). */
  categories?: CheckCategory[];
  /** If true, auto-apply fixes without prompting. */
  autoFix?: boolean;
  /** Skip AI provider checks. */
  skipAi?: boolean;
  /** Verbose output. */
  verbose?: boolean;
}

/**
 * Summary of doctor results.
 */
export interface DoctorResult {
  /** All check results. */
  checks: CheckResult[];
  /** Number of passing checks. */
  passed: number;
  /** Number of warnings. */
  warnings: number;
  /** Number of failures. */
  failures: number;
  /** Number of skipped checks. */
  skipped: number;
  /** Overall health status. */
  healthy: boolean;
}

/**
 * Callback for interactive prompts during doctor.
 */
export interface DoctorPromptCallbacks {
  /** Confirm a fix action. */
  confirm: (message: string) => Promise<boolean>;
  /** Input a value (e.g., API key). */
  input: (message: string, options?: { password?: boolean }) => Promise<string>;
}

/**
 * Context passed to check functions.
 */
export interface CheckContext {
  /** Workspace root path (monorepo root or single project root). */
  workspaceRoot: string;
  /** Current package root (may differ from workspaceRoot in monorepos). */
  packageRoot: string;
  /** Whether this is a monorepo. */
  isMonorepo: boolean;
  /** Current package name (if in a monorepo package). */
  packageName?: string;
  /** Whether verbose output is enabled. */
  verbose: boolean;
}
