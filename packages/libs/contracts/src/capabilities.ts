import type { OwnerShipMeta } from './ownership';

export type CapabilityKind =
  | 'api'
  | 'event'
  | 'data'
  | 'ui'
  | 'integration';

export type CapabilitySurface =
  | 'operation'
  | 'event'
  | 'workflow'
  | 'presentation'
  | 'resource';

export interface CapabilitySurfaceRef {
  surface: CapabilitySurface;
  name: string;
  version: number;
  description?: string;
}

export interface CapabilityMeta extends OwnerShipMeta {
  /** Stable capability slug (e.g., "payments.stripe"). */
  key: string;
  /** Increment when the capability shape changes. */
  version: number;
  kind: CapabilityKind;
}

export interface CapabilityRequirement {
  key: string;
  version?: number;
  kind?: CapabilityKind;
  optional?: boolean;
  reason?: string;
}

export interface CapabilityRef {
  key: string;
  version: number;
}

export interface CapabilitySpec {
  meta: CapabilityMeta;
  provides?: CapabilitySurfaceRef[];
  requires?: CapabilityRequirement[];
}

const capKey = (key: string, version: number) => `${key}.v${version}`;

export class CapabilityRegistry {
  private readonly items = new Map<string, CapabilitySpec>();

  register(spec: CapabilitySpec): this {
    const key = capKey(spec.meta.key, spec.meta.version);
    if (this.items.has(key))
      throw new Error(`Duplicate capability ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): CapabilitySpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number): CapabilitySpec | undefined {
    if (version != null) return this.items.get(capKey(key, version));
    let candidate: CapabilitySpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== key) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
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
    if (
      additional?.some((ref) =>
        matchesRequirement(ref, requirement)
      )
    )
      return true;
    const spec = requirement.version
      ? this.get(requirement.key, requirement.version)
      : this.get(requirement.key);
    if (!spec) return false;
    if (requirement.kind && spec.meta.kind !== requirement.kind)
      return false;
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

