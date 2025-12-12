/**
 * Validation service.
 */

import {
  validateSpecStructure,
  type ValidationResult,
} from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';

/**
 * Options for spec validation.
 */
export interface ValidateSpecOptions {
  /**
   * Skip spec structure validation (e.g., for blueprint files).
   */
  skipStructure?: boolean;
}

/**
 * Result of spec validation.
 */
export interface ValidateSpecResult {
  valid: boolean;
  structureResult?: ValidationResult;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a spec file.
 */
export async function validateSpec(
  specFile: string,
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: ValidateSpecOptions = {}
): Promise<ValidateSpecResult> {
  const { fs } = adapters;

  const exists = await fs.exists(specFile);
  if (!exists) {
    return {
      valid: false,
      errors: [`Spec file not found: ${specFile}`],
      warnings: [],
    };
  }

  const specCode = await fs.readFile(specFile);
  const fileName = fs.basename(specFile);

  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let structureResult: ValidationResult | undefined;

  if (!options.skipStructure) {
    structureResult = validateSpecStructure(specCode, fileName);
    allErrors.push(...structureResult.errors);
    allWarnings.push(...structureResult.warnings);
  }

  return {
    valid: allErrors.length === 0,
    structureResult,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Validate multiple spec files.
 */
export async function validateSpecs(
  specFiles: string[],
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: ValidateSpecOptions = {}
): Promise<Map<string, ValidateSpecResult>> {
  const results = new Map<string, ValidateSpecResult>();

  for (const specFile of specFiles) {
    const result = await validateSpec(specFile, adapters, options);
    results.set(specFile, result);
  }

  return results;
}
