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
  /** Unique key identifying the spec on that surface (e.g., operation key). */
  key: string;
  /** Semantic version of the spec on that surface. */
  version?: string;
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
  /** Capabilities this capability extends (inherits requirements from). */
  extends?: CapabilityRef;
  /** Surfaces (operations, events, presentations, etc.) this capability provides. */
  provides?: CapabilitySurfaceRef[];
  /** Capabilities that must be present for this capability to function. */
  requires?: CapabilityRequirement[];
}

const capKey = (key: string, version: string) => `${key}.v${version}`;

export class CapabilityRegistry {
  private readonly items = new Map<string, CapabilitySpec>();
  /** Reverse index: surface key -> capability key (built lazily) */
  private surfaceIndex: Map<string, Set<string>> | null = null;

  register(spec: CapabilitySpec): this {
    const key = capKey(spec.meta.key, spec.meta.version);
    if (this.items.has(key)) throw new Error(`Duplicate capability ${key}`);
    this.items.set(key, spec);
    // Invalidate reverse index on registration
    this.surfaceIndex = null;
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

  // ─────────────────────────────────────────────────────────────────────────────
  // Query Methods: Surface to Capability lookups
  // ─────────────────────────────────────────────────────────────────────────────

  /** Build reverse index from surface specs to capabilities. */
  private buildSurfaceIndex(): Map<string, Set<string>> {
    if (this.surfaceIndex) return this.surfaceIndex;
    this.surfaceIndex = new Map();
    for (const spec of this.items.values()) {
      const capabilityKey = capKey(spec.meta.key, spec.meta.version);
      for (const surface of spec.provides ?? []) {
        const surfaceKey = `${surface.surface}:${surface.key}`;
        if (!this.surfaceIndex.has(surfaceKey)) {
          this.surfaceIndex.set(surfaceKey, new Set());
        }
        this.surfaceIndex.get(surfaceKey)?.add(capabilityKey);
      }
    }
    return this.surfaceIndex;
  }

  /** Get all operation keys provided by a capability. */
  getOperationsFor(capabilityKey: string, version?: string): string[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];
    return (
      spec.provides
        ?.filter((s) => s.surface === 'operation')
        .map((s) => s.key) ?? []
    );
  }

  /** Get all event keys provided by a capability. */
  getEventsFor(capabilityKey: string, version?: string): string[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];
    return (
      spec.provides?.filter((s) => s.surface === 'event').map((s) => s.key) ??
      []
    );
  }

  /** Get all presentation keys provided by a capability. */
  getPresentationsFor(capabilityKey: string, version?: string): string[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];
    return (
      spec.provides
        ?.filter((s) => s.surface === 'presentation')
        .map((s) => s.key) ?? []
    );
  }

  /** Get all workflow keys provided by a capability. */
  getWorkflowsFor(capabilityKey: string, version?: string): string[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];
    return (
      spec.provides
        ?.filter((s) => s.surface === 'workflow')
        .map((s) => s.key) ?? []
    );
  }

  /** Get all resource keys provided by a capability. */
  getResourcesFor(capabilityKey: string, version?: string): string[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];
    return (
      spec.provides
        ?.filter((s) => s.surface === 'resource')
        .map((s) => s.key) ?? []
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Query Methods: Capability to Surface lookups (reverse)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Get capability refs that provide a specific operation. */
  getCapabilitiesForOperation(operationKey: string): CapabilityRef[] {
    const index = this.buildSurfaceIndex();
    const capKeys = index.get(`operation:${operationKey}`);
    if (!capKeys) return [];
    return [...capKeys].map((k) => {
      const spec = this.items.get(k);
      return { key: spec?.meta.key ?? '', version: spec?.meta.version ?? '' };
    });
  }

  /** Get capability refs that provide a specific event. */
  getCapabilitiesForEvent(eventKey: string): CapabilityRef[] {
    const index = this.buildSurfaceIndex();
    const capKeys = index.get(`event:${eventKey}`);
    if (!capKeys) return [];
    return [...capKeys].map((k) => {
      const spec = this.items.get(k);
      return { key: spec?.meta.key ?? '', version: spec?.meta.version ?? '' };
    });
  }

  /** Get capability refs that provide a specific presentation. */
  getCapabilitiesForPresentation(presentationKey: string): CapabilityRef[] {
    const index = this.buildSurfaceIndex();
    const capKeys = index.get(`presentation:${presentationKey}`);
    if (!capKeys) return [];
    return [...capKeys].map((k) => {
      const spec = this.items.get(k);
      return { key: spec?.meta.key ?? '', version: spec?.meta.version ?? '' };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Inheritance Methods
  // ─────────────────────────────────────────────────────────────────────────────

  /** Get the ancestor chain for a capability (from immediate parent to root). */
  getAncestors(capabilityKey: string, version?: string): CapabilitySpec[] {
    const ancestors: CapabilitySpec[] = [];
    const visited = new Set<string>();
    let current = this.get(capabilityKey, version);

    while (current?.extends) {
      const parentKey = capKey(current.extends.key, current.extends.version);
      if (visited.has(parentKey)) {
        // Circular inheritance detected, break
        break;
      }
      visited.add(parentKey);
      const parent = this.get(current.extends.key, current.extends.version);
      if (!parent) break;
      ancestors.push(parent);
      current = parent;
    }

    return ancestors;
  }

  /**
   * Get effective requirements for a capability, including inherited ones.
   * Requirements from ancestors are included, with child requirements taking
   * precedence over parent requirements for the same key.
   */
  getEffectiveRequirements(
    capabilityKey: string,
    version?: string
  ): CapabilityRequirement[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];

    const ancestors = this.getAncestors(capabilityKey, version);
    const requirementMap = new Map<string, CapabilityRequirement>();

    // Start from root ancestor (reverse order)
    for (const ancestor of [...ancestors].reverse()) {
      for (const req of ancestor.requires ?? []) {
        requirementMap.set(req.key, req);
      }
    }

    // Add/override with own requirements
    for (const req of spec.requires ?? []) {
      requirementMap.set(req.key, req);
    }

    return [...requirementMap.values()];
  }

  /**
   * Get all surfaces provided by a capability, including inherited ones.
   */
  getEffectiveSurfaces(
    capabilityKey: string,
    version?: string
  ): CapabilitySurfaceRef[] {
    const spec = this.get(capabilityKey, version);
    if (!spec) return [];

    const ancestors = this.getAncestors(capabilityKey, version);
    const surfaces: CapabilitySurfaceRef[] = [];

    // Collect from ancestors first (root to immediate parent)
    for (const ancestor of [...ancestors].reverse()) {
      surfaces.push(...(ancestor.provides ?? []));
    }

    // Add own surfaces
    surfaces.push(...(spec.provides ?? []));

    return surfaces;
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
