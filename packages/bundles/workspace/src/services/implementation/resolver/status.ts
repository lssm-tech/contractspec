/**
 * Logic for determining implementation status.
 */

import type {
  ImplementationStatus,
  ResolvedImplementation,
  SpecImplementationResult,
} from '../types';

/**
 * Determine overall implementation status.
 */
export function determineStatus(
  implementations: ResolvedImplementation[]
): ImplementationStatus {
  if (implementations.length === 0) {
    return 'missing';
  }

  const existingImpls = implementations.filter((i) => i.exists);
  const _nonTestImpls = implementations.filter((i) => i.type !== 'test');
  const existingNonTestImpls = existingImpls.filter((i) => i.type !== 'test');

  // If no non-test implementations exist, it's missing
  if (existingNonTestImpls.length === 0) {
    return 'missing';
  }

  // If all expected implementations exist, it's fully implemented
  if (implementations.every((i) => i.exists)) {
    return 'implemented';
  }

  // Some exist, some don't
  return 'partial';
}

/**
 * Get implementation summary statistics.
 */
export function getImplementationSummary(results: SpecImplementationResult[]): {
  total: number;
  implemented: number;
  partial: number;
  missing: number;
  coverage: number;
} {
  const implemented = results.filter((r) => r.status === 'implemented').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const missing = results.filter((r) => r.status === 'missing').length;

  return {
    total: results.length,
    implemented,
    partial,
    missing,
    coverage:
      results.length > 0
        ? Math.round((implemented / results.length) * 100)
        : 100,
  };
}
