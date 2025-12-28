import type { ExampleSpec } from './types';
import { safeParseExampleSpec } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Validation Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ExampleValidationError {
  /** Example key if available */
  exampleKey?: string;
  /** Error message */
  message: string;
  /** Path within the spec where error occurred */
  path?: string;
  /** Error code for programmatic handling */
  code?: string;
}

export interface ExampleValidationWarning {
  /** Example key if available */
  exampleKey?: string;
  /** Warning message */
  message: string;
  /** Path within the spec where warning applies */
  path?: string;
}

export type ValidateExamplesResult =
  | { ok: true; examples: ExampleSpec[] }
  | { ok: false; errors: ExampleValidationError[] };

export interface ValidateExampleResult {
  valid: boolean;
  errors: ExampleValidationError[];
  warnings: ExampleValidationWarning[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Single Example Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate a single ExampleSpec.
 *
 * @param example - The example to validate
 * @returns Validation result with errors and warnings
 */
export function validateExample(example: unknown): ValidateExampleResult {
  const errors: ExampleValidationError[] = [];
  const warnings: ExampleValidationWarning[] = [];

  // Schema validation
  const parsed = safeParseExampleSpec(example);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push({
        exampleKey: (example as { meta?: { key?: string } })?.meta?.key,
        message: issue.message,
        path: issue.path.join('.'),
        code: issue.code,
      });
    }
    return { valid: false, errors, warnings };
  }

  const spec = parsed.data;

  // Additional semantic validations
  validateSemantics(spec, errors, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateSemantics(
  spec: ExampleSpec,
  errors: ExampleValidationError[],
  warnings: ExampleValidationWarning[]
): void {
  const key = spec.meta.key;

  // Entrypoints validation
  if (!spec.entrypoints.packageName.startsWith('@')) {
    warnings.push({
      exampleKey: key,
      message:
        'Package name should be scoped (e.g., @contractspec/example.name)',
      path: 'entrypoints.packageName',
    });
  }

  // Surface consistency checks
  if (spec.surfaces.studio.installable && !spec.surfaces.studio.enabled) {
    errors.push({
      exampleKey: key,
      message: 'Studio installable requires studio.enabled to be true',
      path: 'surfaces.studio',
      code: 'STUDIO_INSTALLABLE_REQUIRES_ENABLED',
    });
  }

  if (spec.surfaces.sandbox.enabled && spec.surfaces.sandbox.modes.length === 0) {
    warnings.push({
      exampleKey: key,
      message: 'Sandbox is enabled but has no modes configured',
      path: 'surfaces.sandbox.modes',
    });
  }

  // Feature entrypoint consistency
  if (spec.features && spec.features.length > 0 && !spec.entrypoints.feature) {
    warnings.push({
      exampleKey: key,
      message:
        'Example has features but no feature entrypoint in entrypoints.feature',
      path: 'entrypoints.feature',
    });
  }

  // Blueprint consistency
  if (spec.blueprint && !spec.entrypoints.blueprint) {
    warnings.push({
      exampleKey: key,
      message:
        'Example has blueprint but no blueprint entrypoint in entrypoints.blueprint',
      path: 'entrypoints.blueprint',
    });
  }

  // Visibility and stability consistency
  if (spec.meta.visibility === 'public' && spec.meta.stability === 'idea') {
    warnings.push({
      exampleKey: key,
      message: 'Public examples should not be in "idea" stability',
      path: 'meta.stability',
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate multiple examples, checking for duplicates.
 *
 * @param examples - Array of examples to validate
 * @returns Validation result with all valid examples or errors
 */
export function validateExamples(
  examples: ExampleSpec[]
): ValidateExamplesResult {
  const errors: ExampleValidationError[] = [];
  const seen = new Set<string>();
  const validExamples: ExampleSpec[] = [];

  for (const example of examples) {
    // Check for duplicate keys
    if (seen.has(example.meta.key)) {
      errors.push({
        exampleKey: example.meta.key,
        message: `Duplicate example key: ${example.meta.key}`,
        code: 'DUPLICATE_KEY',
      });
      continue;
    }
    seen.add(example.meta.key);

    // Validate individual example
    const result = validateExample(example);
    if (!result.valid) {
      errors.push(...result.errors);
    } else {
      validExamples.push(example);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, examples: validExamples };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-Reference Validation
// ─────────────────────────────────────────────────────────────────────────────

export interface CrossValidationContext {
  /** Available feature keys */
  featureKeys?: Set<string>;
  /** Available blueprint keys */
  blueprintKeys?: Set<string>;
  /** Available package names in workspace */
  packageNames?: Set<string>;
}

/**
 * Validate example references against external registries.
 *
 * @param example - Example to validate
 * @param context - External context for cross-reference validation
 * @returns Validation result with errors and warnings
 */
export function validateExampleReferences(
  example: ExampleSpec,
  context: CrossValidationContext
): ValidateExampleResult {
  const errors: ExampleValidationError[] = [];
  const warnings: ExampleValidationWarning[] = [];
  const key = example.meta.key;

  // Validate package name exists in workspace
  if (context.packageNames && !context.packageNames.has(example.entrypoints.packageName)) {
    warnings.push({
      exampleKey: key,
      message: `Package "${example.entrypoints.packageName}" not found in workspace`,
      path: 'entrypoints.packageName',
    });
  }

  // Validate feature references
  if (example.features && context.featureKeys) {
    for (const feature of example.features) {
      if ('key' in feature && !('meta' in feature)) {
        // It's a FeatureRef
        if (!context.featureKeys.has(feature.key)) {
          warnings.push({
            exampleKey: key,
            message: `Feature "${feature.key}" not found in registry`,
            path: 'features',
          });
        }
      }
    }
  }

  // Validate blueprint reference
  if (example.blueprint && context.blueprintKeys) {
    if ('key' in example.blueprint && !('meta' in example.blueprint)) {
      // It's a SpecPointer
      if (!context.blueprintKeys.has(example.blueprint.key)) {
        warnings.push({
          exampleKey: key,
          message: `Blueprint "${example.blueprint.key}" not found in registry`,
          path: 'blueprint',
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
