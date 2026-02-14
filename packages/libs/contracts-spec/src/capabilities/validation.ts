/**
 * Capability validation utilities for ensuring bidirectional consistency.
 *
 * Validates that:
 * 1. All `provides` surface references point to existing specs
 * 2. All specs with `capability` fields are listed in their capability's `provides`
 *
 * @module capabilities/validation
 */

import type { CapabilityRegistry, CapabilitySurface } from './capabilities';
import type { OperationSpecRegistry } from '../operations/registry';
import type { EventRegistry } from '../events';
import type { PresentationRegistry } from '../presentations';

// ─────────────────────────────────────────────────────────────────────────────
// Validation Result Types
// ─────────────────────────────────────────────────────────────────────────────

/** Single validation error describing an inconsistency. */
export interface CapabilityValidationError {
  /** Type of validation error. */
  type:
    | 'missing_surface_spec'
    | 'orphan_spec'
    | 'capability_not_found'
    | 'surface_not_in_provides';
  /** Human-readable error message. */
  message: string;
  /** Capability key involved (if applicable). */
  capabilityKey?: string;
  /** Surface type involved (if applicable). */
  surface?: CapabilitySurface;
  /** Spec key involved (if applicable). */
  specKey?: string;
}

/** Result of capability consistency validation. */
export interface CapabilityValidationResult {
  /** Whether validation passed with no errors. */
  valid: boolean;
  /** List of validation errors found. */
  errors: CapabilityValidationError[];
  /** List of warnings (non-blocking issues). */
  warnings: CapabilityValidationError[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Dependencies
// ─────────────────────────────────────────────────────────────────────────────

/** Registries needed for full bidirectional validation. */
export interface CapabilityValidationDeps {
  capabilities: CapabilityRegistry;
  operations?: OperationSpecRegistry;
  events?: EventRegistry;
  presentations?: PresentationRegistry;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates bidirectional consistency between capabilities and their surfaces.
 *
 * Checks:
 * 1. Forward validation: Every surface ref in capability `provides` exists
 * 2. Reverse validation: Every spec with `capability` field is in that capability's `provides`
 *
 * @param deps - Registries to validate against
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = validateCapabilityConsistency({
 *   capabilities: capabilityRegistry,
 *   operations: operationRegistry,
 *   events: eventRegistry,
 * });
 *
 * if (!result.valid) {
 *   console.error('Capability validation failed:', result.errors);
 * }
 * ```
 */
export function validateCapabilityConsistency(
  deps: CapabilityValidationDeps
): CapabilityValidationResult {
  const errors: CapabilityValidationError[] = [];
  const warnings: CapabilityValidationError[] = [];

  // Forward validation: Check all capability provides references exist
  for (const capability of deps.capabilities.list()) {
    const capKey = `${capability.meta.key}.v${capability.meta.version}`;

    for (const surface of capability.provides ?? []) {
      const exists = checkSurfaceExists(deps, surface.surface, surface.key);

      if (!exists) {
        errors.push({
          type: 'missing_surface_spec',
          message: `Capability "${capKey}" provides ${surface.surface} "${surface.key}" but spec not found`,
          capabilityKey: capKey,
          surface: surface.surface,
          specKey: surface.key,
        });
      }
    }
  }

  // Reverse validation: Check all specs with capability field are in provides
  if (deps.operations) {
    for (const op of deps.operations.list()) {
      if (op.capability) {
        const capSpec = deps.capabilities.get(
          op.capability.key,
          op.capability.version
        );
        if (!capSpec) {
          errors.push({
            type: 'capability_not_found',
            message: `Operation "${op.meta.key}" references capability "${op.capability.key}.v${op.capability.version}" but capability not found`,
            specKey: op.meta.key,
            capabilityKey: `${op.capability.key}.v${op.capability.version}`,
            surface: 'operation',
          });
        } else {
          const inProvides = capSpec.provides?.some(
            (p) => p.surface === 'operation' && p.key === op.meta.key
          );
          if (!inProvides) {
            errors.push({
              type: 'surface_not_in_provides',
              message: `Operation "${op.meta.key}" claims capability "${op.capability.key}.v${op.capability.version}" but not in capability's provides`,
              specKey: op.meta.key,
              capabilityKey: `${op.capability.key}.v${op.capability.version}`,
              surface: 'operation',
            });
          }
        }
      }
    }
  }

  if (deps.events) {
    for (const event of deps.events.list()) {
      if (event.capability) {
        const capSpec = deps.capabilities.get(
          event.capability.key,
          event.capability.version
        );
        if (!capSpec) {
          errors.push({
            type: 'capability_not_found',
            message: `Event "${event.meta.key}" references capability "${event.capability.key}.v${event.capability.version}" but capability not found`,
            specKey: event.meta.key,
            capabilityKey: `${event.capability.key}.v${event.capability.version}`,
            surface: 'event',
          });
        } else {
          const inProvides = capSpec.provides?.some(
            (p) => p.surface === 'event' && p.key === event.meta.key
          );
          if (!inProvides) {
            errors.push({
              type: 'surface_not_in_provides',
              message: `Event "${event.meta.key}" claims capability "${event.capability.key}.v${event.capability.version}" but not in capability's provides`,
              specKey: event.meta.key,
              capabilityKey: `${event.capability.key}.v${event.capability.version}`,
              surface: 'event',
            });
          }
        }
      }
    }
  }

  if (deps.presentations) {
    for (const pres of deps.presentations.list()) {
      if (pres.capability) {
        const capSpec = deps.capabilities.get(
          pres.capability.key,
          pres.capability.version
        );
        if (!capSpec) {
          errors.push({
            type: 'capability_not_found',
            message: `Presentation "${pres.meta.key}" references capability "${pres.capability.key}.v${pres.capability.version}" but capability not found`,
            specKey: pres.meta.key,
            capabilityKey: `${pres.capability.key}.v${pres.capability.version}`,
            surface: 'presentation',
          });
        } else {
          const inProvides = capSpec.provides?.some(
            (p) => p.surface === 'presentation' && p.key === pres.meta.key
          );
          if (!inProvides) {
            errors.push({
              type: 'surface_not_in_provides',
              message: `Presentation "${pres.meta.key}" claims capability "${pres.capability.key}.v${pres.capability.version}" but not in capability's provides`,
              specKey: pres.meta.key,
              capabilityKey: `${pres.capability.key}.v${pres.capability.version}`,
              surface: 'presentation',
            });
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a spec exists for a given surface type and key.
 */
function checkSurfaceExists(
  deps: CapabilityValidationDeps,
  surface: CapabilitySurface,
  key: string
): boolean {
  switch (surface) {
    case 'operation':
      return deps.operations?.has(key) ?? true; // Pass if registry not provided
    case 'event':
      return deps.events?.has(key) ?? true;
    case 'presentation':
      return deps.presentations?.has(key) ?? true;
    case 'workflow':
    case 'resource':
      // These registries aren't commonly available yet, skip validation
      return true;
    default:
      return true;
  }
}

/**
 * Finds specs that have no capability assignment (orphan specs).
 * This is informational - orphan specs are allowed but may indicate
 * incomplete capability modeling.
 *
 * @param deps - Registries to check
 * @returns List of spec keys without capability assignment
 */
export function findOrphanSpecs(deps: CapabilityValidationDeps): {
  operations: string[];
  events: string[];
  presentations: string[];
} {
  const result = {
    operations: [] as string[],
    events: [] as string[],
    presentations: [] as string[],
  };

  if (deps.operations) {
    for (const op of deps.operations.list()) {
      if (!op.capability) {
        result.operations.push(op.meta.key);
      }
    }
  }

  if (deps.events) {
    for (const event of deps.events.list()) {
      if (!event.capability) {
        result.events.push(event.meta.key);
      }
    }
  }

  if (deps.presentations) {
    for (const pres of deps.presentations.list()) {
      if (!pres.capability) {
        result.presentations.push(pres.meta.key);
      }
    }
  }

  return result;
}
