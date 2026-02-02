/**
 * Structure validation checks.
 */

import {
  type SpecScanResult,
  validateSpecStructure,
} from '@contractspec/module.workspace';
import type { CIIssue } from '../types';

/**
 * Run spec structure validation checks.
 */
export async function runStructureChecks(
  specFiles: SpecScanResult[]
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  for (const specFile of specFiles) {
    const result = validateSpecStructure(specFile);

    for (const error of result.errors) {
      issues.push({
        ruleId: 'spec-structure-error',
        severity: 'error',
        message: error,
        category: 'structure',
        file: specFile.filePath,
      });
    }

    for (const warning of result.warnings) {
      issues.push({
        ruleId: 'spec-structure-warning',
        severity: 'warning',
        message: warning,
        category: 'structure',
        file: specFile.filePath,
      });
    }
  }

  return issues;
}
