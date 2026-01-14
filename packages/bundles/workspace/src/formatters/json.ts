/**
 * JSON output formatter.
 *
 * Formats CI check results as machine-readable JSON
 * for parsing in CI/CD scripts and integrations.
 */

import type { CICheckResult } from '../services/ci-check/types';

/**
 * Base interface for all standardized JSON outputs.
 */
export interface BaseJsonOutput {
  /** Schema version for output stability (e.g., "1.0"). */
  schemaVersion: string;
}

/**
 * Options for JSON formatting.
 */
export interface JsonFormatOptions {
  /** Pretty print with indentation. */
  pretty?: boolean;
}

/**
 * CI JSON output structure (v1.0).
 */
export interface CiJsonOutput extends BaseJsonOutput {
  checks: CiCheckJson[];
  drift: {
    status: 'none' | 'detected';
    files: string[];
  };
  summary: {
    pass: number;
    fail: number;
    warn: number;
    total: number;
    durationMs: number;
    timestamp: string;
  };
  details?: {
    commit?: string;
    branch?: string;
  };
}

export interface CiCheckJson {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  category: string;
  message: string;
  file?: string;
  line?: number;
  details?: Record<string, unknown>;
}

/**
 * Format CI check results as standard JSON (v1.0).
 */
export function formatAsJson(
  result: CICheckResult,
  options: JsonFormatOptions = {}
): string {
  const { pretty = true } = options;

  // Map issues to checks
  const checks: CiCheckJson[] = result.issues.map((issue) => ({
    name: issue.ruleId,
    status:
      issue.severity === 'error'
        ? 'fail'
        : issue.severity === 'warning'
          ? 'warn'
          : 'pass',
    category: issue.category,
    message: issue.message,
    file: issue.file,
    line: issue.line,
    details: issue.context as Record<string, unknown>,
  }));

  // Add passing categories as passing checks (summary level) if needed
  // Or purely rely on issues. The previous implementation had categories.
  // For v1.0 schema, we focus on list of checks.

  // Count stats
  const fail = result.totalErrors;
  const warn = result.totalWarnings;
  // Note: "pass" count is harder to derive solely from issues (which are usually negative).
  // But we can use category results to infer passing checks if we had granular per-check results.
  // For now, we'll use the issues list. If issues is empty, it's all pass?
  // Actually, let's map the categories too if they represent high-level checks.

  const output: CiJsonOutput = {
    schemaVersion: '1.0',
    checks,
    drift: {
      status: 'none', // TODO: Implement drift detection
      files: [],
    },
    summary: {
      pass: 0, // Placeholder, calculated properly if we have tracking of passed assertions
      fail,
      warn,
      total: fail + warn,
      durationMs: result.durationMs,
      timestamp: result.timestamp,
    },
    details: {
      commit: result.commitSha,
      branch: result.branch,
    },
  };

  return pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output);
}
