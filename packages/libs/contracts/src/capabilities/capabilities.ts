import { compareVersions } from 'compare-versions';
import type { OwnerShipMeta } from '../ownership';
import type { VersionedSpecRef } from '../versioning';

/** Classification of capability types. */
export type CapabilityKind = 'api' | 'event' | 'data' | 'ui' | 'integration';

/** Surfaces where capabilities can be exposed or consumed. */
export type CapabilitySurface =
  | 'operation'
  | 'event'
  | 'workflow'
  | 'presentation'
  | 'resource';

/**
 * Reference to a capability on a specific surface.
 * Extends VersionedSpecRef with surface and description context.
 */
export interface CapabilitySurfaceRef {
  /** The surface type where this capability is exposed. */
  surface: CapabilitySurface;
  /** Unique key identifying the capability. */
  key: string;
  /** Semantic version of the capability. */
  version: string;
  /** Optional description of what this capability provides. */
  description?: string;
}

/** Metadata for a capability spec, extending ownership with kind. */
export interface CapabilityMeta extends OwnerShipMeta {
  /** The kind/category of this capability. */
  kind: CapabilityKind;
}

/**
 * Requirement for a capability dependency.
 * Used to declare what capabilities a spec needs.
 */
export interface CapabilityRequirement {
  /** Unique key of the required capability. */
  key: string;
  /** Optional specific version required. */
  version?: string;
  /** Optional kind filter for the requirement. */
  kind?: CapabilityKind;
  /** If true, the requirement is optional and won't block if missing. */
  optional?: boolean;
  /** Human-readable reason why this capability is required. */
  reason?: string;
}

/**
 * Reference to a capability spec.
 * Uses key and version to identify a specific capability.
 */
export type CapabilityRef = VersionedSpecRef;

export interface CapabilitySpec {
  meta: CapabilityMeta;
  provides?: CapabilitySurfaceRef[];
  requires?: CapabilityRequirement[];
}

const capKey = (key: string, version: string) => `${key}.v${version}`;

export class CapabilityRegistry {
  private readonly items = new Map<string, CapabilitySpec>();

  register(spec: CapabilitySpec): this {
    const key = capKey(spec.meta.key, spec.meta.version);
    if (this.items.has(key)) throw new Error(`Duplicate capability ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): CapabilitySpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: string): CapabilitySpec | undefined {
    if (version != null) return this.items.get(capKey(key, version));
    let candidate: CapabilitySpec | undefined;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== key) continue;
      if (
        !candidate ||
        compareVersions(spec.meta.version, candidate.meta.version) > 0
      ) {
        candidate = spec;
      }
    }
    return candidate;
  }

  satisfies(
    requirement: CapabilityRequirement,
    additional?: CapabilityRef[] | undefined
  ): boolean {
    if (requirement.optional) return true;
    if (additional?.some((ref) => matchesRequirement(ref, requirement)))
      return true;
    const spec = requirement.version
      ? this.get(requirement.key, requirement.version)
      : this.get(requirement.key);
    if (!spec) return false;
    if (requirement.kind && spec.meta.kind !== requirement.kind) return false;
    if (
      requirement.version != null &&
      spec.meta.version !== requirement.version
    )
      return false;
    return true;
  }
}

function matchesRequirement(
  ref: CapabilityRef,
  requirement: CapabilityRequirement
) {
  if (ref.key !== requirement.key) return false;
  if (requirement.version != null && ref.version !== requirement.version)
    return false;
  return true;
}

export function capabilityKey(spec: CapabilitySpec) {
  return capKey(spec.meta.key, spec.meta.version);
}

export function defineCapability(spec: CapabilitySpec): CapabilitySpec {
  return spec;
}
