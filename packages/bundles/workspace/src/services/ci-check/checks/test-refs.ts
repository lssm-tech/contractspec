/**
 * Test reference validation checks.
 *
 * Validates that all tests referenced in OperationSpec.tests actually exist.
 * Missing references are reported as ERRORS (blocking CI) to enforce contract integrity.
 */

import { type SpecScanResult } from '@contractspec/module.workspace';
import type { SpecLocation } from '../../integrity';
import { validateTestRefs } from '../../test-link';
import type { CIIssue } from '../types';

/**
 * Run test reference validation checks.
 */
export async function runTestRefsChecks(
  specFiles: SpecScanResult[]
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  // Build inventory of test specs
  const testSpecIndex = new Map<string, SpecLocation>();
  const specsByFile = new Map<
    string,
    {
      key: string;
      version: string;
      testRefs?: { key: string; version: string }[];
    }[]
  >();

  // Scan all spec files to build inventory
  for (const specFile of specFiles) {
    if (!specFile.key || !specFile.version) continue;

    // Build test spec index
    if (specFile.specType === 'test-spec') {
      const testKey = `${specFile.key}.v${specFile.version}`;
      testSpecIndex.set(testKey, {
        key: specFile.key,
        version: specFile.version,
        file: specFile.filePath,
        type: 'test-spec',
      });
    }

    // Track specs with test refs for validation
    if (specFile.testRefs && specFile.testRefs.length > 0) {
      if (!specsByFile.has(specFile.filePath)) {
        specsByFile.set(specFile.filePath, []);
      }
      specsByFile.get(specFile.filePath)?.push({
        key: specFile.key,
        version: specFile.version,
        testRefs: specFile.testRefs,
      });
    }
  }

  // Validate test references for each spec
  for (const [specFile, specs] of specsByFile) {
    for (const spec of specs) {
      if (!spec.testRefs) continue;

      const result = validateTestRefs(
        specFile,
        spec.key,
        spec.version,
        spec.testRefs,
        testSpecIndex,
        { treatMissingAsError: true }
      );

      // Report errors for missing test references
      for (const error of result.errors) {
        issues.push({
          ruleId: 'test-ref-missing',
          severity: 'error', // ERRORS - block CI for contract integrity
          message: error,
          category: 'test-refs',
          file: specFile,
          context: {
            specKey: spec.key,
            specVersion: spec.version,
            missingTests: result.missingTests,
          },
        });
      }
    }
  }

  return issues;
}
