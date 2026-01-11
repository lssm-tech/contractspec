/**
 * File filtering utilities.
 */

import micromatch from 'micromatch';
import type { ContractsrcConfig } from '@contractspec/lib.contracts/workspace-config';

/**
 * Check if a file path matches test file patterns.
 *
 * Uses configuration testing.testMatch if available, otherwise defaults to standard patterns.
 *
 * @param filePath Path to check
 * @param config Optional workspace configuration
 */
export function isTestFile(
  filePath: string,
  config?: ContractsrcConfig
): boolean {
  // Get patterns from config or use defaults
  // The default from schema is ['**/*.{test,spec}.{ts,js}']
  const patterns = config?.testing?.testMatch ?? ['**/*.{test,spec}.{ts,js}'];

  // Ensure we matched against the basename or relative path correctly
  // micromatch usually takes the whole path if patterns contain **
  return micromatch.isMatch(filePath, patterns);
}
