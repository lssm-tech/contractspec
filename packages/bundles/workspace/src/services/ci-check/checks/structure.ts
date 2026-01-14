/**
 * Structure validation checks.
 */

import { validateSpecStructure } from '@contractspec/module.workspace';
import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import type { CIIssue } from '../types';

/**
 * Run spec structure validation checks.
 */
export async function runStructureChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  for (const file of specFiles) {
    const content = await fs.readFile(file);
    const result = validateSpecStructure(content, file);

    for (const error of result.errors) {
      issues.push({
        ruleId: 'spec-structure-error',
        severity: 'error',
        message: error,
        category: 'structure',
        file,
      });
    }

    for (const warning of result.warnings) {
      issues.push({
        ruleId: 'spec-structure-warning',
        severity: 'warning',
        message: warning,
        category: 'structure',
        file,
      });
    }
  }

  return issues;
}
