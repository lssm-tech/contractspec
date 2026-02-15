/**
 * Coverage validator.
 *
 * Validates actual coverage data against TestSpec.coverage requirements.
 */

import type { CoverageRequirement } from '@contractspec/lib.contracts-spec/tests';
import type {
  CoverageData,
  CoverageValidationResult,
  CoverageFailure,
  CoverageValidationSummary,
} from './types';

/**
 * Validate coverage data against requirements.
 *
 * @param specKey - The spec key being validated
 * @param specVersion - The spec version
 * @param requirement - The coverage requirements from TestSpec
 * @param actual - The actual coverage data
 * @returns Validation result with pass/fail and details
 */
export function validateCoverage(
  specKey: string,
  specVersion: string,
  requirement: CoverageRequirement,
  actual: CoverageData
): CoverageValidationResult {
  const failures: CoverageFailure[] = [];

  // Check statements requirement
  if (
    requirement.statements !== undefined &&
    actual.statements.pct < requirement.statements
  ) {
    failures.push({
      metric: 'statements',
      required: requirement.statements,
      actual: actual.statements.pct,
      message: `Statement coverage ${actual.statements.pct}% is below required ${requirement.statements}%`,
    });
  }

  // Check branches requirement
  if (
    requirement.branches !== undefined &&
    actual.branches.pct < requirement.branches
  ) {
    failures.push({
      metric: 'branches',
      required: requirement.branches,
      actual: actual.branches.pct,
      message: `Branch coverage ${actual.branches.pct}% is below required ${requirement.branches}%`,
    });
  }

  // Check functions requirement
  if (
    requirement.functions !== undefined &&
    actual.functions.pct < requirement.functions
  ) {
    failures.push({
      metric: 'functions',
      required: requirement.functions,
      actual: actual.functions.pct,
      message: `Function coverage ${actual.functions.pct}% is below required ${requirement.functions}%`,
    });
  }

  // Check lines requirement
  if (requirement.lines !== undefined && actual.lines.pct < requirement.lines) {
    failures.push({
      metric: 'lines',
      required: requirement.lines,
      actual: actual.lines.pct,
      message: `Line coverage ${actual.lines.pct}% is below required ${requirement.lines}%`,
    });
  }

  // Note: Mutation coverage would require integration with a mutation testing tool
  // like Stryker. For now, we skip this check.
  if (requirement.mutations !== undefined) {
    // Mutation testing not yet supported
    failures.push({
      metric: 'mutations',
      required: requirement.mutations,
      actual: 0,
      message: `Mutation coverage required (${requirement.mutations}%) but mutation testing is not yet supported`,
    });
  }

  return {
    specKey,
    specVersion,
    requirement,
    actual,
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Validate coverage for multiple specs and create a summary.
 *
 * @param validations - Array of specs with requirements and coverage
 * @returns Summary of all validations
 */
export function validateAllCoverage(
  validations: {
    specKey: string;
    specVersion: string;
    requirement: CoverageRequirement;
    actual: CoverageData;
  }[]
): CoverageValidationSummary {
  const results: CoverageValidationResult[] = [];

  for (const v of validations) {
    results.push(
      validateCoverage(v.specKey, v.specVersion, v.requirement, v.actual)
    );
  }

  const passedSpecs = results.filter((r) => r.passed).length;
  const failedSpecs = results.filter((r) => !r.passed).length;

  return {
    totalSpecs: results.length,
    passedSpecs,
    failedSpecs,
    results,
    allPassed: failedSpecs === 0,
  };
}

/**
 * Format coverage validation result as a human-readable string.
 */
export function formatCoverageResult(result: CoverageValidationResult): string {
  const lines: string[] = [];

  lines.push(
    `${result.specKey}.v${result.specVersion}: ${result.passed ? 'PASS' : 'FAIL'}`
  );

  if (!result.passed) {
    for (const failure of result.failures) {
      lines.push(`  - ${failure.message}`);
    }
  }

  return lines.join('\n');
}

/**
 * Format coverage validation summary as a human-readable string.
 */
export function formatCoverageSummary(
  summary: CoverageValidationSummary
): string {
  const lines: string[] = [];

  lines.push('Coverage Validation Summary');
  lines.push('===========================');
  lines.push(`Total specs: ${summary.totalSpecs}`);
  lines.push(`Passed: ${summary.passedSpecs}`);
  lines.push(`Failed: ${summary.failedSpecs}`);
  lines.push('');

  for (const result of summary.results) {
    lines.push(formatCoverageResult(result));
  }

  return lines.join('\n');
}
