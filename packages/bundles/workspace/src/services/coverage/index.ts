/**
 * Coverage service.
 *
 * Provides coverage parsing, validation, and enforcement for contract-first testing.
 */

// Types
export type {
  CoverageMetric,
  CoverageData,
  CoverageValidationResult,
  CoverageFailure,
  CoverageValidationSummary,
  CoverageValidationOptions,
  CoverageReport,
  FileCoverage,
} from './types';

export { createEmptyCoverageData, calculatePct } from './types';

// Parsers
export type { CoverageFormat, CoverageParser } from './parsers';
export { createParser, detectFormat, parseIstanbulCoverage } from './parsers';

// Validation
export {
  validateCoverage,
  validateAllCoverage,
  formatCoverageResult,
  formatCoverageSummary,
} from './validator';
