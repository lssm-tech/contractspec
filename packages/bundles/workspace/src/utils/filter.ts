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

/**
 * Check if a file path is a library definition file that should be excluded from spec validation.
 *
 * These are files that define the spec functions/types themselves (e.g., defineEvent, defineCommand).
 * They contain spec-related keywords but are not actual spec files.
 *
 * @param filePath Path to check
 */
export function isLibraryDefinitionFile(filePath: string): boolean {
  const allowedPatterns = [
    '**/libs/contracts/src/app-config/contracts.ts',
    '**/libs/contracts/src/app-config/lifecycle-contracts.ts',
    '**/libs/contracts/src/app-config/app-config.feature.ts',
    '**/libs/contracts/src/app-config/app-config.capability.ts',
    '**/libs/contracts/src/app-config/events.ts',
  ];
  if (micromatch.isMatch(filePath, allowedPatterns)) {
    return false;
  }

  // Exclude core library files that define spec types/functions
  const libraryPatterns = [
    // Top-level files in libs/contracts/src are mostly library logic
    '**/libs/contracts/src/*.ts',
    // These specific subfolders in libs/contracts/src contain library logic, not specs
    '**/libs/contracts/src/operations/*.ts',
    '**/libs/contracts/src/presentations/*.ts',
    '**/libs/contracts/src/contract-registry/*.ts',
    '**/libs/contracts/src/model-registry/*.ts',
    '**/libs/contracts/src/registry-utils/*.ts',
    // These packages are pure library code
    '**/libs/contracts-transformers/src/**',
    '**/libs/schema/src/**',
  ];

  return micromatch.isMatch(filePath, libraryPatterns);
}
