/**
 * Static verification of implementation against parsed spec.
 *
 * This performs lightweight checks based on regex and static analysis
 * without requiring a full build or runtime environment.
 */

import type { VerificationTier } from '@contractspec/lib.contracts-spec/llm';
import type { ParsedSpec } from '@contractspec/module.workspace';

/**
 * Verification issue found during static check.
 */
export interface VerificationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  category: string;
  line?: number;
}

/**
 * Verify implementation against parsed spec.
 * This is a simplified verification that checks for basic patterns.
 */
export function verifyImplementationAgainstParsedSpec(
  spec: ParsedSpec,
  implementationCode: string,
  tiers: VerificationTier[]
): VerificationIssue[] {
  const issues: VerificationIssue[] = [];

  // Structure checks (Tier 1)
  if (tiers.includes('structure')) {
    // Check for function/class export
    const hasExport =
      /export\s+(async\s+)?function|export\s+class|export\s+const/.test(
        implementationCode
      );
    if (!hasExport) {
      issues.push({
        severity: 'warning',
        message: 'No exports found in implementation',
        category: 'structure',
      });
    }

    // Check for spec name reference
    if (spec.meta.key && !implementationCode.includes(spec.meta.key)) {
      issues.push({
        severity: 'info',
        message: `Spec name "${spec.meta.key}" not found in implementation`,
        category: 'structure',
      });
    }
  }

  // Behavior checks (Tier 2)
  if (tiers.includes('behavior')) {
    // Check for error handling
    const hasErrorHandling = /try\s*{|catch\s*\(|throw\s+new/.test(
      implementationCode
    );
    if (!hasErrorHandling) {
      issues.push({
        severity: 'warning',
        message: 'No error handling patterns found',
        category: 'behavior',
      });
    }

    // Check for async patterns if needed
    if (spec.specType === 'operation') {
      const hasAsyncPattern = /async\s+|await\s+|Promise/.test(
        implementationCode
      );
      if (!hasAsyncPattern) {
        issues.push({
          severity: 'info',
          message: 'No async patterns found (operations typically use async)',
          category: 'behavior',
        });
      }
    }

    // Check for event emission if spec defines emitted events
    if (spec.emittedEvents && spec.emittedEvents.length > 0) {
      const hasEventEmit = /emit|publish|dispatch|fire/i.test(
        implementationCode
      );
      if (!hasEventEmit) {
        issues.push({
          severity: 'warning',
          message: `Spec emits ${spec.emittedEvents.length} event(s) but no event emission found`,
          category: 'behavior',
        });
      }
    }
  }

  return issues;
}

/**
 * Format verification report as markdown.
 */
export function formatVerificationReport(
  spec: ParsedSpec,
  issues: VerificationIssue[]
): string {
  const lines: string[] = [];

  lines.push(`# Verification Report: ${spec.meta.key}`);
  lines.push('');

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Errors: ${errors.length}`);
  lines.push(`- Warnings: ${warnings.length}`);
  lines.push(`- Info: ${infos.length}`);
  lines.push('');

  if (errors.length > 0) {
    lines.push('## Errors');
    lines.push('');
    for (const issue of errors) {
      lines.push(`- ❌ **${issue.category}**: ${issue.message}`);
    }
    lines.push('');
  }

  if (warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    for (const issue of warnings) {
      lines.push(`- ⚠️ **${issue.category}**: ${issue.message}`);
    }
    lines.push('');
  }

  if (infos.length > 0) {
    lines.push('## Info');
    lines.push('');
    for (const issue of infos) {
      lines.push(`- ℹ️ **${issue.category}**: ${issue.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
