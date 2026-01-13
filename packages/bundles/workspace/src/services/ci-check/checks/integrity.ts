/**
 * Integrity analysis checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { analyzeIntegrity } from '../../integrity';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run integrity analysis checks.
 */
export async function runIntegrityChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  const result = await analyzeIntegrity(adapters, {
    pattern: options.pattern,
    all: true,
  });

  for (const issue of result.issues) {
    issues.push({
      ruleId: `integrity-${issue.type}`,
      severity: issue.severity === 'error' ? 'error' : 'warning',
      message: issue.message,
      category: 'integrity',
      file: issue.file,
      context: {
        specKey: issue.specKey,
        specType: issue.specType,
        featureKey: issue.featureKey,
        ref: issue.ref,
      },
    });
  }

  return issues;
}
