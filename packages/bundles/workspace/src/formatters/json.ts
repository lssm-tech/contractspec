/**
 * JSON output formatter.
 *
 * Formats CI check results as machine-readable JSON
 * for parsing in CI/CD scripts and integrations.
 */

import type { CICheckResult } from '../services/ci-check/types';
import type { DriftResult } from '../services/drift';

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
  /** Drift detection result to include in the output. */
  driftResult?: DriftResult;
}

/**
 * CI JSON output structure (v1.0).
 */
export interface CiJsonOutput extends BaseJsonOutput {
  success: boolean;
  checks: CiCheckJson[];
  categories: {
    category: string;
    label: string;
    passed: boolean;
    errors: number;
    warnings: number;
    notes: number;
    durationMs: number;
  }[];
  drift: {
    status: 'none' | 'detected';
    files: string[];
  };
  summary: {
    pass: number;
    fail: number;
    warn: number;
    note: number;
    total: number;
    totalErrors: number;
    totalWarnings: number;
    totalNotes: number;
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
  const { pretty = true, driftResult } = options;

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
  const pass = result.categories.filter((category) => category.passed).length;
  const fail = result.totalErrors;
  const warn = result.totalWarnings;
  const note = result.totalNotes;

  const output: CiJsonOutput = {
    schemaVersion: '1.0',
    success: result.success,
    checks,
    categories: result.categories.map((category) => ({
      category: category.category,
      label: category.label,
      passed: category.passed,
      errors: category.errors,
      warnings: category.warnings,
      notes: category.notes,
      durationMs: category.durationMs,
    })),
    drift: {
      status: driftResult?.hasDrift ? 'detected' : 'none',
      files: driftResult?.files ?? [],
    },
    summary: {
      pass,
      fail,
      warn,
      note,
      total: pass + fail + warn + note,
      totalErrors: result.totalErrors,
      totalWarnings: result.totalWarnings,
      totalNotes: result.totalNotes,
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
