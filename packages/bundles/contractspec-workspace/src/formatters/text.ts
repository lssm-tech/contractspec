/**
 * Text output formatter.
 *
 * Formats CI check results as human-readable text output.
 * This formatter is designed to be used by CLI wrappers that add colors.
 */

import type {
  CICheckResult,
  CICheckCategorySummary,
  CIIssue,
} from '../services/ci-check/types';

/**
 * Options for text formatting.
 */
export interface TextFormatOptions {
  /** Show verbose output with all details. */
  verbose?: boolean;
  /** Include timing information. */
  showTiming?: boolean;
  /** Group issues by file. */
  groupByFile?: boolean;
}

/**
 * Text output lines with optional styling hints.
 */
export interface TextLine {
  text: string;
  style?: 'normal' | 'bold' | 'error' | 'warning' | 'success' | 'muted';
  indent?: number;
}

/**
 * Format CI check results as text lines.
 * Returns structured lines that can be styled by the CLI.
 */
export function formatAsTextLines(
  result: CICheckResult,
  options: TextFormatOptions = {}
): TextLine[] {
  const lines: TextLine[] = [];
  const { verbose = false, showTiming = true, groupByFile = false } = options;

  // Header
  lines.push({ text: '', style: 'normal' });
  lines.push({ text: '📋 ContractSpec CI Check Results', style: 'bold' });
  lines.push({ text: '', style: 'normal' });

  // Git info if available
  if (result.commitSha || result.branch) {
    const gitInfo = [
      result.branch ? `branch: ${result.branch}` : null,
      result.commitSha ? `commit: ${result.commitSha.slice(0, 7)}` : null,
    ]
      .filter(Boolean)
      .join(', ');
    lines.push({ text: `Git: ${gitInfo}`, style: 'muted' });
  }

  // Category summaries
  lines.push({ text: '', style: 'normal' });
  lines.push({ text: 'Check Results:', style: 'bold' });

  for (const category of result.categories) {
    const icon = category.passed ? '✓' : '✗';
    const style = category.passed ? 'success' : 'error';
    const stats = formatCategoryStats(category);
    const timing = showTiming ? ` (${category.durationMs}ms)` : '';

    lines.push({
      text: `  ${icon} ${category.label}: ${stats}${timing}`,
      style,
    });
  }

  // Issues section
  if (result.issues.length > 0) {
    lines.push({ text: '', style: 'normal' });
    lines.push({ text: 'Issues:', style: 'bold' });

    if (groupByFile) {
      const byFile = groupIssuesByFile(result.issues);
      for (const [file, issues] of byFile) {
        lines.push({ text: '', style: 'normal' });
        lines.push({
          text: `  ${file || '(no file)'}`,
          style: 'bold',
          indent: 1,
        });

        for (const issue of issues) {
          lines.push(...formatIssueLines(issue, verbose, 2));
        }
      }
    } else {
      // Show errors first, then warnings, then notes
      const errors = result.issues.filter((i) => i.severity === 'error');
      const warnings = result.issues.filter((i) => i.severity === 'warning');
      const notes = result.issues.filter((i) => i.severity === 'note');

      if (errors.length > 0) {
        lines.push({ text: '', style: 'normal' });
        lines.push({ text: '  Errors:', style: 'error', indent: 1 });
        for (const issue of errors) {
          lines.push(...formatIssueLines(issue, verbose, 2));
        }
      }

      if (warnings.length > 0) {
        lines.push({ text: '', style: 'normal' });
        lines.push({ text: '  Warnings:', style: 'warning', indent: 1 });
        for (const issue of warnings) {
          lines.push(...formatIssueLines(issue, verbose, 2));
        }
      }

      if (notes.length > 0 && verbose) {
        lines.push({ text: '', style: 'normal' });
        lines.push({ text: '  Notes:', style: 'muted', indent: 1 });
        for (const issue of notes) {
          lines.push(...formatIssueLines(issue, verbose, 2));
        }
      }
    }
  }

  // Summary
  lines.push({ text: '', style: 'normal' });
  lines.push({ text: '─'.repeat(50), style: 'muted' });

  const summaryParts = [
    result.totalErrors > 0 ? `${result.totalErrors} error(s)` : null,
    result.totalWarnings > 0 ? `${result.totalWarnings} warning(s)` : null,
    result.totalNotes > 0 && verbose ? `${result.totalNotes} note(s)` : null,
  ].filter(Boolean);

  if (summaryParts.length > 0) {
    lines.push({
      text: `Found: ${summaryParts.join(', ')}`,
      style: result.success ? 'warning' : 'error',
    });
  }

  if (showTiming) {
    lines.push({ text: `Duration: ${result.durationMs}ms`, style: 'muted' });
  }

  lines.push({ text: '', style: 'normal' });

  if (result.success) {
    lines.push({ text: '✅ All CI checks passed!', style: 'success' });
  } else {
    lines.push({ text: '❌ CI checks failed', style: 'error' });
  }

  lines.push({ text: '', style: 'normal' });

  return lines;
}

/**
 * Format CI check results as plain text string.
 */
export function formatAsText(
  result: CICheckResult,
  options: TextFormatOptions = {}
): string {
  const lines = formatAsTextLines(result, options);
  return lines
    .map((line) => '  '.repeat(line.indent ?? 0) + line.text)
    .join('\n');
}

/**
 * Format category stats.
 */
function formatCategoryStats(category: CICheckCategorySummary): string {
  const parts: string[] = [];

  if (category.errors > 0) {
    parts.push(`${category.errors} error(s)`);
  }
  if (category.warnings > 0) {
    parts.push(`${category.warnings} warning(s)`);
  }

  if (parts.length === 0) {
    return 'passed';
  }

  return parts.join(', ');
}

/**
 * Format a single issue as text lines.
 */
function formatIssueLines(
  issue: CIIssue,
  verbose: boolean,
  baseIndent: number
): TextLine[] {
  const lines: TextLine[] = [];

  const icon =
    issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '⚠' : '○';
  const style =
    issue.severity === 'error'
      ? 'error'
      : issue.severity === 'warning'
        ? 'warning'
        : 'muted';

  // Main issue line
  let mainLine = `${icon} ${issue.message}`;
  if (issue.file) {
    const location = issue.line ? `:${issue.line}` : '';
    mainLine += ` (${issue.file}${location})`;
  }

  lines.push({ text: mainLine, style, indent: baseIndent });

  // Additional context in verbose mode
  if (verbose && issue.context) {
    const contextStr = JSON.stringify(issue.context);
    if (contextStr !== '{}') {
      lines.push({
        text: `Context: ${contextStr}`,
        style: 'muted',
        indent: baseIndent + 1,
      });
    }
  }

  return lines;
}

/**
 * Group issues by file.
 */
function groupIssuesByFile(issues: CIIssue[]): Map<string, CIIssue[]> {
  const byFile = new Map<string, CIIssue[]>();

  for (const issue of issues) {
    const file = issue.file ?? '';
    if (!byFile.has(file)) {
      byFile.set(file, []);
    }
    const fileIssues = byFile.get(file);
    if (fileIssues) {
      fileIssues.push(issue);
    }
  }

  // Sort files alphabetically
  return new Map([...byFile.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
