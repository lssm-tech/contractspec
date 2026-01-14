import type { FeatureScanResult } from '@contractspec/module.workspace';
import type { SpecInventory } from '../integrity';

/**
 * Validation error for a feature reference.
 */
export interface FeatureRefError {
  key: string;
  version: string | number;
  type: string;
  message: string;
}

/**
 * Validate references in a feature against the workspace inventory.
 */
export function validateFeatureRefs(
  feature: FeatureScanResult,
  inventory: SpecInventory
): FeatureRefError[] {
  const errors: FeatureRefError[] = [];

  // Helper to check refs
  const checkRefs = (
    refs: { key: string; version: string | number }[],
    inventoryMap: Map<string, unknown>,
    type: string
  ) => {
    for (const ref of refs) {
      const key = `${ref.key}.v${ref.version}`;
      if (!inventoryMap.has(key)) {
        errors.push({
          key: ref.key,
          version: ref.version,
          type,
          message: `${type} ${ref.key}.v${ref.version} not found`,
        });
      }
    }
  };

  checkRefs(feature.operations, inventory.operations, 'Operation');
  checkRefs(feature.events, inventory.events, 'Event');
  checkRefs(feature.presentations, inventory.presentations, 'Presentation');
  checkRefs(feature.experiments, inventory.experiments, 'Experiment');
  // Check workflows if/when supported in inventory

  return errors;
}
