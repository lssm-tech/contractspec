/**
 * Deep diff engine for IO schema comparison.
 *
 * Compares input/output schemas field-by-field to detect
 * breaking and non-breaking changes.
 */

import type { FieldSnapshot, IoSnapshot } from '../snapshot/types';
import type { SemanticDiffItem } from '../../types/analysis-types';

/**
 * Deep diff options.
 */
export interface DeepDiffOptions {
  /** Only report breaking changes */
  breakingOnly?: boolean;
  /** Path prefix for nested diffs */
  pathPrefix?: string;
}

/**
 * Compute deep differences between two IO schemas.
 */
export function computeIoDiff(
  base: IoSnapshot,
  head: IoSnapshot,
  options: DeepDiffOptions = {}
): SemanticDiffItem[] {
  const diffs: SemanticDiffItem[] = [];

  // Compare input schemas
  diffs.push(...computeFieldsDiff(base.input, head.input, 'io.input', options));

  // Compare output schemas
  diffs.push(
    ...computeFieldsDiff(base.output, head.output, 'io.output', options)
  );

  return options.breakingOnly
    ? diffs.filter((d) => d.type === 'breaking')
    : diffs;
}

/**
 * Compute differences between two field maps.
 */
export function computeFieldsDiff(
  baseFields: Record<string, FieldSnapshot>,
  headFields: Record<string, FieldSnapshot>,
  pathPrefix: string,
  options: DeepDiffOptions = {}
): SemanticDiffItem[] {
  const diffs: SemanticDiffItem[] = [];
  const baseNames = new Set(Object.keys(baseFields));
  const headNames = new Set(Object.keys(headFields));

  // Check for removed fields
  for (const name of baseNames) {
    if (!headNames.has(name)) {
      const baseField = baseFields[name];
      diffs.push({
        type: 'breaking',
        path: `${pathPrefix}.${name}`,
        oldValue: baseField,
        newValue: undefined,
        description: `Field '${name}' was removed`,
      });
    }
  }

  // Check for added fields
  for (const name of headNames) {
    if (!baseNames.has(name)) {
      const headField = headFields[name];
      const isBreaking = headField?.required === true;
      diffs.push({
        type: isBreaking ? 'breaking' : 'added',
        path: `${pathPrefix}.${name}`,
        oldValue: undefined,
        newValue: headField,
        description: isBreaking
          ? `Required field '${name}' was added`
          : `Optional field '${name}' was added`,
      });
    }
  }

  // Check for changed fields
  for (const name of baseNames) {
    if (headNames.has(name)) {
      const baseField = baseFields[name];
      const headField = headFields[name];
      if (baseField && headField) {
        diffs.push(
          ...computeFieldDiff(
            baseField,
            headField,
            `${pathPrefix}.${name}`,
            options
          )
        );
      }
    }
  }

  return diffs;
}

/**
 * Compute differences between two field definitions.
 */
export function computeFieldDiff(
  base: FieldSnapshot,
  head: FieldSnapshot,
  path: string,
  _options: DeepDiffOptions = {}
): SemanticDiffItem[] {
  const diffs: SemanticDiffItem[] = [];

  // Type change is always breaking
  if (base.type !== head.type) {
    diffs.push({
      type: 'breaking',
      path: `${path}.type`,
      oldValue: base.type,
      newValue: head.type,
      description: `Field type changed from '${base.type}' to '${head.type}'`,
    });
  }

  // Required change
  if (base.required !== head.required) {
    const isBreaking = !base.required && head.required; // Optional -> Required is breaking
    diffs.push({
      type: isBreaking ? 'breaking' : 'changed',
      path: `${path}.required`,
      oldValue: base.required,
      newValue: head.required,
      description: isBreaking
        ? `Field '${base.name}' changed from optional to required`
        : `Field '${base.name}' changed from required to optional`,
    });
  }

  // Nullable change
  if (base.nullable !== head.nullable) {
    const isBreaking = base.nullable && !head.nullable; // Nullable -> Non-nullable is breaking
    diffs.push({
      type: isBreaking ? 'breaking' : 'changed',
      path: `${path}.nullable`,
      oldValue: base.nullable,
      newValue: head.nullable,
      description: isBreaking
        ? `Field '${base.name}' is no longer nullable`
        : `Field '${base.name}' is now nullable`,
    });
  }

  // Enum values change
  if (base.type === 'enum' && head.type === 'enum') {
    const baseValues = new Set(base.enumValues ?? []);
    const headValues = new Set(head.enumValues ?? []);

    // Removed enum values are breaking
    for (const value of baseValues) {
      if (!headValues.has(value)) {
        diffs.push({
          type: 'breaking',
          path: `${path}.enumValues`,
          oldValue: base.enumValues,
          newValue: head.enumValues,
          description: `Enum value '${value}' was removed`,
        });
      }
    }

    // Added enum values are non-breaking
    for (const value of headValues) {
      if (!baseValues.has(value)) {
        diffs.push({
          type: 'added',
          path: `${path}.enumValues`,
          oldValue: base.enumValues,
          newValue: head.enumValues,
          description: `Enum value '${value}' was added`,
        });
      }
    }
  }

  // Nested object fields
  if (
    base.type === 'object' &&
    head.type === 'object' &&
    base.properties &&
    head.properties
  ) {
    diffs.push(
      ...computeFieldsDiff(base.properties, head.properties, path, _options)
    );
  }

  // Array items
  if (
    base.type === 'array' &&
    head.type === 'array' &&
    base.items &&
    head.items
  ) {
    diffs.push(
      ...computeFieldDiff(base.items, head.items, `${path}.items`, _options)
    );
  }

  return diffs;
}

/**
 * Classify a diff as breaking based on context.
 */
export function isBreakingChange(
  diff: SemanticDiffItem,
  context: 'input' | 'output'
): boolean {
  // In output context, removing/changing fields is always breaking
  if (context === 'output') {
    return diff.type === 'breaking' || diff.type === 'removed';
  }

  // In input context, adding required fields is breaking
  if (context === 'input') {
    if (diff.type === 'added' && diff.description?.includes('Required field')) {
      return true;
    }
    return diff.type === 'breaking';
  }

  return diff.type === 'breaking';
}
