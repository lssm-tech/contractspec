/**
 * Test reference validator.
 *
 * Validates that OperationSpec.tests references point to existing TestSpecs.
 */

import type { SpecLocation } from '../integrity';
import type { RefInfo } from '@contractspec/module.workspace';

/**
 * Options for test reference validation.
 */
export interface TestRefValidationOptions {
  /**
   * Treat missing tests as errors (default: true).
   * When false, missing tests are reported as warnings.
   */
  treatMissingAsError?: boolean;
}

/**
 * Result of validating test references for a spec.
 */
export interface TestRefValidationResult {
  /**
   * Whether all referenced tests are valid.
   */
  valid: boolean;

  /**
   * Test refs that were found and valid.
   */
  foundTests: RefInfo[];

  /**
   * Test refs that were not found.
   */
  missingTests: RefInfo[];

  /**
   * Error messages for missing tests.
   */
  errors: string[];

  /**
   * The source file being validated.
   */
  specFile: string;
}

/**
 * Build a spec key from key and version.
 */
function makeSpecKey(key: string, version: string): string {
  return `${key}.v${version}`;
}

/**
 * Validate that all test references in a spec exist in the test inventory.
 *
 * @param specFile - The spec file being validated
 * @param specKey - The spec's key (for error messages)
 * @param specVersion - The spec's version (for error messages)
 * @param testRefs - Array of test references from the spec
 * @param testIndex - Map of test spec keys to their locations
 * @param options - Validation options
 * @returns Validation result with found/missing tests and errors
 */
export function validateTestRefs(
  specFile: string,
  specKey: string,
  specVersion: string,
  testRefs: RefInfo[] | undefined,
  testIndex: Map<string, SpecLocation>,
  options: TestRefValidationOptions = {}
): TestRefValidationResult {
  const { treatMissingAsError = true } = options;

  if (!testRefs || testRefs.length === 0) {
    return {
      valid: true,
      foundTests: [],
      missingTests: [],
      errors: [],
      specFile,
    };
  }

  const foundTests: RefInfo[] = [];
  const missingTests: RefInfo[] = [];
  const errors: string[] = [];

  for (const ref of testRefs) {
    const testKey = makeSpecKey(ref.key, ref.version);

    if (testIndex.has(testKey)) {
      foundTests.push(ref);
    } else {
      missingTests.push(ref);
      if (treatMissingAsError) {
        errors.push(
          `Spec ${specKey}.v${specVersion} references test ${ref.key}.v${ref.version} which does not exist`
        );
      }
    }
  }

  return {
    valid: missingTests.length === 0,
    foundTests,
    missingTests,
    errors,
    specFile,
  };
}

/**
 * Batch validate test references for multiple specs.
 *
 * @param specs - Array of specs with their test refs
 * @param testIndex - Map of test spec keys to their locations
 * @param options - Validation options
 * @returns Array of validation results
 */
export function validateAllTestRefs(
  specs: {
    specFile: string;
    specKey: string;
    specVersion: string;
    testRefs: RefInfo[] | undefined;
  }[],
  testIndex: Map<string, SpecLocation>,
  options: TestRefValidationOptions = {}
): TestRefValidationResult[] {
  return specs.map((spec) =>
    validateTestRefs(
      spec.specFile,
      spec.specKey,
      spec.specVersion,
      spec.testRefs,
      testIndex,
      options
    )
  );
}

/**
 * Aggregate validation results into a summary.
 */
export function aggregateValidationResults(
  results: TestRefValidationResult[]
): {
  totalSpecs: number;
  specsWithRefs: number;
  totalRefs: number;
  foundRefs: number;
  missingRefs: number;
  allValid: boolean;
  allErrors: string[];
} {
  let specsWithRefs = 0;
  let totalRefs = 0;
  let foundRefs = 0;
  let missingRefs = 0;
  const allErrors: string[] = [];

  for (const result of results) {
    const refCount = result.foundTests.length + result.missingTests.length;
    if (refCount > 0) {
      specsWithRefs++;
      totalRefs += refCount;
      foundRefs += result.foundTests.length;
      missingRefs += result.missingTests.length;
      allErrors.push(...result.errors);
    }
  }

  return {
    totalSpecs: results.length,
    specsWithRefs,
    totalRefs,
    foundRefs,
    missingRefs,
    allValid: missingRefs === 0,
    allErrors,
  };
}
