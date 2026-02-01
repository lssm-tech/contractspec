/**
 * Validation service.
 */

import {
  validateSpecStructure,
  type ValidationResult,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import { listSpecs } from '../list';

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
  code?: string;
}

/**
 * Validate a spec file.
 */
export async function validateSpec(
  specFilePath: string,
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: ValidateSpecOptions = {}
): Promise<ValidateSpecResult> {
  const { fs } = adapters;

  const exists = await fs.exists(specFilePath);
  if (!exists) {
    return {
      valid: false,
      errors: [`Spec file not found: ${specFilePath}`],
      warnings: [],
      code: undefined,
    };
  }

  const specCode = await fs.readFile(specFilePath);

  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  let structureResult: ValidationResult | undefined;

  if (!options.skipStructure) {
    const specFiles = await listSpecs(adapters, {
      pattern: specFilePath,
    });
    for (const specFile of specFiles) {
      structureResult = validateSpecStructure(specFile);
      allErrors.push(...structureResult.errors);
      allWarnings.push(...structureResult.warnings);
    }
  }

  return {
    valid: allErrors.length === 0,
    structureResult,
    errors: allErrors,
    warnings: allWarnings,
    code: specCode,
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
