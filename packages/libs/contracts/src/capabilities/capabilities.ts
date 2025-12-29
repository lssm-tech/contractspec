import { compareVersions } from 'compare-versions';
import type { OwnerShipMeta } from '../ownership';

export type CapabilityKind = 'api' | 'event' | 'data' | 'ui' | 'integration';

export type CapabilitySurface =
  | 'operation'
  | 'event'
  | 'workflow'
  | 'presentation'
  | 'resource';

export interface CapabilitySurfaceRef {
  surface: CapabilitySurface;
  key: string;
  version: string;
  description?: string;
}

export interface CapabilityMeta extends OwnerShipMeta {
  kind: CapabilityKind;
}

export interface CapabilityRequirement {
  key: string;
  version?: string;
  kind?: CapabilityKind;
  optional?: boolean;
  reason?: string;
}

export interface CapabilityRef {
  key: string;
  version: string;
}

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
