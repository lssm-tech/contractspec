/**
 * Coverage types for contract-first test coverage enforcement.
 *
 * These types model coverage data from test runners and allow
 * validation against TestSpec.coverage requirements.
 */

import type { CoverageRequirement } from '@contractspec/lib.contracts-spec/tests';

/**
 * Coverage metrics for a single metric type.
 */
export interface CoverageMetric {
  /** Number of covered items (statements, branches, etc.) */
  covered: number;
  /** Total number of items */
  total: number;
  /** Percentage covered (0-100) */
  pct: number;
}

/**
 * Coverage data collected from a test run.
 * Matches standard Istanbul/NYC coverage format.
 */
export interface CoverageData {
  statements: CoverageMetric;
  branches: CoverageMetric;
  functions: CoverageMetric;
  lines: CoverageMetric;
}

/**
 * Result of validating coverage against requirements.
 */
export interface CoverageValidationResult {
  /** The spec key being validated */
  specKey: string;
  /** The spec version */
  specVersion: string;
  /** The coverage requirements from TestSpec */
  requirement: CoverageRequirement;
  /** The actual coverage data */
  actual: CoverageData;
  /** Whether all requirements are met */
  passed: boolean;
  /** List of failed requirements with details */
  failures: CoverageFailure[];
}

/**
 * A single coverage requirement failure.
 */
export interface CoverageFailure {
  /** The metric type that failed */
  metric: 'statements' | 'branches' | 'functions' | 'lines' | 'mutations';
  /** Required percentage */
  required: number;
  /** Actual percentage */
  actual: number;
  /** Human-readable message */
  message: string;
}

/**
 * Summary of coverage validation across multiple specs.
 */
export interface CoverageValidationSummary {
  /** Total number of specs with coverage requirements */
  totalSpecs: number;
  /** Number of specs that passed coverage requirements */
  passedSpecs: number;
  /** Number of specs that failed coverage requirements */
  failedSpecs: number;
  /** All validation results */
  results: CoverageValidationResult[];
  /** Whether all specs passed */
  allPassed: boolean;
}

/**
 * Options for coverage validation.
 */
export interface CoverageValidationOptions {
  /** Directory containing coverage reports */
  coverageDir?: string;
  /** Coverage report format */
  format?: 'istanbul' | 'lcov' | 'cobertura';
  /** Whether to skip specs without coverage requirements */
  skipWithoutRequirements?: boolean;
}

/**
 * Parsed coverage report from a test runner.
 */
export interface CoverageReport {
  /** Map from file path to file coverage data */
  files: Map<string, FileCoverage>;
  /** Aggregate coverage across all files */
  total: CoverageData;
}

/**
 * Coverage data for a single file.
 */
export interface FileCoverage {
  /** Absolute file path */
  path: string;
  /** Statement coverage */
  statements: CoverageMetric;
  /** Branch coverage */
  branches: CoverageMetric;
  /** Function coverage */
  functions: CoverageMetric;
  /** Line coverage */
  lines: CoverageMetric;
}

/**
 * Creates an empty coverage data object.
 */
export function createEmptyCoverageData(): CoverageData {
  return {
    statements: { covered: 0, total: 0, pct: 0 },
    branches: { covered: 0, total: 0, pct: 0 },
    functions: { covered: 0, total: 0, pct: 0 },
    lines: { covered: 0, total: 0, pct: 0 },
  };
}

/**
 * Calculate percentage with proper rounding.
 */
export function calculatePct(covered: number, total: number): number {
  if (total === 0) return 100; // No items means 100% covered
  return Math.round((covered / total) * 10000) / 100; // Round to 2 decimal places
}
