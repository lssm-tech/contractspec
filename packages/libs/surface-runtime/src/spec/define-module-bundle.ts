import type { ModuleBundleSpec } from './types';
import { validateLayoutSlots } from './validate-bundle';

/**
 * Defines a module bundle spec. Validates shape at runtime and returns the spec.
 *
 * @param spec - The bundle spec to define
 * @returns The same spec (for type inference)
 *
 * @example
 * ```ts
 * const PmWorkbenchBundle = defineModuleBundle({
 *   meta: { key: "pm.workbench", version: "0.1.0", title: "PM Workbench" },
 *   routes: [...],
 *   surfaces: {...},
 * });
 * ```
 */
export function defineModuleBundle<const T extends ModuleBundleSpec>(
  spec: T
): T {
  if (!spec.meta?.key || !spec.meta?.version || !spec.meta?.title) {
    throw new Error(
      'ModuleBundleSpec must have meta.key, meta.version, and meta.title'
    );
  }
  if (!spec.routes?.length) {
    throw new Error('ModuleBundleSpec must have at least one route');
  }
  if (!spec.surfaces || Object.keys(spec.surfaces).length === 0) {
    throw new Error('ModuleBundleSpec must have at least one surface');
  }
  if (spec.entities) {
    if (
      !spec.entities.entityTypes ||
      typeof spec.entities.entityTypes !== 'object'
    ) {
      throw new Error(
        'ModuleBundleSpec.entities must have entityTypes object when present'
      );
    }
    if (
      !spec.entities.fieldKinds ||
      typeof spec.entities.fieldKinds !== 'object'
    ) {
      throw new Error(
        'ModuleBundleSpec.entities must have fieldKinds object when present'
      );
    }
  }

  const REQUIRED_DIMENSIONS = [
    'guidance',
    'density',
    'dataDepth',
    'control',
    'media',
    'pace',
    'narrative',
  ] as const;
  const MIN_DESCRIPTION_LENGTH = 10;

  for (const surface of Object.values(spec.surfaces)) {
    if (!surface.verification?.dimensions) {
      throw new Error(
        `Surface "${surface.surfaceId}" must have verification.dimensions for all 7 preference dimensions`
      );
    }
    const dims = surface.verification.dimensions;
    for (const d of REQUIRED_DIMENSIONS) {
      const val = dims[d];
      if (!val || typeof val !== 'string') {
        throw new Error(
          `Surface "${surface.surfaceId}" verification.dimensions.${d} must be a non-empty string`
        );
      }
      const trimmed = val.trim();
      if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
        throw new Error(
          `Surface "${surface.surfaceId}" verification.dimensions.${d} must be at least ${MIN_DESCRIPTION_LENGTH} characters (got ${trimmed.length})`
        );
      }
    }
    validateLayoutSlots(surface);
  }
  return spec;
}
