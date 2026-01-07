/**
 * Test reference validation checks.
 *
 * Validates that all tests referenced in OperationSpec.tests actually exist.
 * Missing references are reported as ERRORS (blocking CI) to enforce contract integrity.
 */

import { scanAllSpecsFromSource } from '@contractspec/module.workspace';
import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import type { SpecLocation } from '../../integrity';
import { validateTestRefs } from '../../test-link';
import type { CIIssue } from '../types';

/**
 * Run test reference validation checks.
 */
export async function runTestRefsChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
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
    const content = await fs.readFile(specFile);
    const scans = scanAllSpecsFromSource(content, specFile);

    for (const scan of scans) {
      if (!scan.key || !scan.version) continue;

      // Build test spec index
      if (scan.specType === 'test-spec') {
        const testKey = `${scan.key}.v${scan.version}`;
        testSpecIndex.set(testKey, {
          key: scan.key,
          version: scan.version,
          file: specFile,
          type: 'test-spec',
        });
      }

      // Track specs with test refs for validation
      if (scan.testRefs && scan.testRefs.length > 0) {
        if (!specsByFile.has(specFile)) {
          specsByFile.set(specFile, []);
        }
        specsByFile.get(specFile)?.push({
          key: scan.key,
          version: scan.version,
          testRefs: scan.testRefs,
        });
      }
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
