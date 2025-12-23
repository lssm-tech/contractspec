/**
 * JSON output formatter.
 *
 * Formats CI check results as machine-readable JSON
 * for parsing in CI/CD scripts and integrations.
 */

import type { CICheckResult } from '../services/ci-check/types';

/**
 * Options for JSON formatting.
 */
export interface JsonFormatOptions {
  /** Pretty print with indentation. */
  pretty?: boolean;
  /** Include full issue details. */
  includeDetails?: boolean;
  /** Include category summaries. */
  includeSummaries?: boolean;
}

/**
 * Compact JSON output structure.
 */
export interface JsonCompactOutput {
  success: boolean;
  errors: number;
  warnings: number;
  duration: number;
  timestamp: string;
  commit?: string;
  branch?: string;
  issues: JsonIssueCompact[];
}

/**
 * Compact issue representation.
 */
export interface JsonIssueCompact {
  rule: string;
  severity: string;
  message: string;
  file?: string;
  line?: number;
}

/**
 * Full JSON output structure.
 */
export interface JsonFullOutput {
  success: boolean;
  summary: {
    totalErrors: number;
    totalWarnings: number;
    totalNotes: number;
    durationMs: number;
    timestamp: string;
    commitSha?: string;
    branch?: string;
  };
  categories: {
    category: string;
    label: string;
    passed: boolean;
    errors: number;
    warnings: number;
    notes: number;
    durationMs: number;
  }[];
  issues: {
    ruleId: string;
    severity: string;
    message: string;
    category: string;
    file?: string;
    line?: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    context?: Record<string, unknown>;
  }[];
}

/**
 * Format CI check results as compact JSON.
 */
export function formatAsJsonCompact(result: CICheckResult): JsonCompactOutput {
  return {
    success: result.success,
    errors: result.totalErrors,
    warnings: result.totalWarnings,
    duration: result.durationMs,
    timestamp: result.timestamp,
    commit: result.commitSha,
    branch: result.branch,
    issues: result.issues.map((issue) => ({
      rule: issue.ruleId,
      severity: issue.severity,
      message: issue.message,
      file: issue.file,
      line: issue.line,
    })),
  };
}

/**
 * Format CI check results as full JSON with all details.
 */
export function formatAsJsonFull(result: CICheckResult): JsonFullOutput {
  return {
    success: result.success,
    summary: {
      totalErrors: result.totalErrors,
      totalWarnings: result.totalWarnings,
      totalNotes: result.totalNotes,
      durationMs: result.durationMs,
      timestamp: result.timestamp,
      commitSha: result.commitSha,
      branch: result.branch,
    },
    categories: result.categories.map((cat) => ({
      category: cat.category,
      label: cat.label,
      passed: cat.passed,
      errors: cat.errors,
      warnings: cat.warnings,
      notes: cat.notes,
      durationMs: cat.durationMs,
    })),
    issues: result.issues.map((issue) => ({
      ruleId: issue.ruleId,
      severity: issue.severity,
      message: issue.message,
      category: issue.category,
      file: issue.file,
      line: issue.line,
      column: issue.column,
      endLine: issue.endLine,
      endColumn: issue.endColumn,
      context: issue.context,
    })),
  };
}

/**
 * Format CI check results as JSON.
 */
export function formatAsJson(
  result: CICheckResult,
  options: JsonFormatOptions = {}
): string {
  const { pretty = true, includeDetails = true } = options;

  const output = includeDetails
    ? formatAsJsonFull(result)
    : formatAsJsonCompact(result);

  return pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output);
}
