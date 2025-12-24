import { filterBy, getUniqueTags, groupBy } from './registry-utils';

import type {
  PresentationSpec,
  PresentationTarget,
} from './presentations/presentations';
import type { OwnerShipMeta } from './ownership';
import type {
  CapabilityRef,
  CapabilityRegistry,
  CapabilityRequirement,
} from './capabilities';
import type { ExperimentRef } from './experiments/spec';
import type { ImplementationRef } from './operations/';

/** Minimal metadata to identify and categorize a feature module. */
export type FeatureModuleMeta = OwnerShipMeta;

export interface OpRef {
  /** Operation key (Operationspec.meta.key). */
  key: string;
  /** Operation version (OperationSpec.meta.version). */
  version: number;
}

export interface EventRef {
  /** Event key. */
  key: string;
  /** Event version. */
  version: number;
}

export interface PresentationRef {
  /** Presentation key. */
  key: string;
  /** Presentation version. */
  version: number;
}

/** Group operations/events/presentations into an installable feature. */
export interface FeatureModuleSpec {
  meta: FeatureModuleMeta;
  /** Contract operations included in this feature. */
  operations?: OpRef[];
  /** Events declared/emitted by this feature. */
  events?: EventRef[];
  /** Presentations associated to this feature. */
  presentations?: PresentationRef[];
  /** Experiments related to this feature. */
  experiments?: ExperimentRef[];
  /** Capability bindings exposed/required by this feature. */
  capabilities?: {
    provides?: CapabilityRef[];
    requires?: CapabilityRequirement[];
  };
  /** Optional: link ops to presentations for traceability (e.g., ui for op) */
  opToPresentation?: { op: OpRef; pres: PresentationRef }[];
  /** Optional: declare per-presentation target requirements (V2 descriptors) */
  presentationsTargets?: {
    /** Presentation key. */
    key: string;
    /** Presentation version. */
    version: number;
    /** Required targets that must be supported by the descriptor. */
    targets: PresentationTarget[];
  }[];

  /**
   * Explicit implementation file mappings for the entire feature module.
   * Used for tracking and verifying that this feature is correctly implemented.
   */
  implementations?: ImplementationRef[];
}

export interface FeatureRef {
  key: string;
}

function keyOf(f: FeatureModuleSpec) {
  return f.meta.key;
}

/** In-memory registry for FeatureModuleSpec. */
export class FeatureRegistry {
  private items = new Map<string, FeatureModuleSpec>();

  /** Register a feature module. Throws when the key already exists. */
  register(f: FeatureModuleSpec): this {
    const key = keyOf(f);
    if (this.items.has(key)) throw new Error(`Duplicate feature ${key}`);
    this.items.set(key, f);
    return this;
  }

  /** List all registered feature modules. */
  list(): FeatureModuleSpec[] {
    return [...this.items.values()];
  }

  /** Get a feature by its key (slug). */
  get(key: string): FeatureModuleSpec | undefined {
    return this.items.get(key);
  }

  /** Filter features by criteria. */
  filter(
    criteria: import('./registry-utils').RegistryFilter
  ): FeatureModuleSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List features with specific tag. */
  listByTag(tag: string): FeatureModuleSpec[] {
    return this.list().filter((f) => f.meta.tags?.includes(tag));
  }

  /** List features by owner. */
  listByOwner(owner: string): FeatureModuleSpec[] {
    return this.list().filter((f) => f.meta.owners?.includes(owner));
  }

  /** Group features by key function. */
  groupBy(
    keyFn: import('./registry-utils').GroupKeyFn<FeatureModuleSpec>
  ): Map<string, FeatureModuleSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all features. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}

/** Validate and register a feature against optional registries/descriptors. */
export function installFeature(
  feature: FeatureModuleSpec,
  deps: {
    features: FeatureRegistry;
    ops?: import('./operations/registry').OperationSpecRegistry;
    presentations?: import('./presentations').PresentationRegistry;
    descriptorsV2?: PresentationSpec[];
    capabilities?: CapabilityRegistry;
  }
) {
  // Validate referenced ops exist if registry provided
  if (deps.ops && feature.operations) {
    for (const o of feature.operations) {
      const s = deps.ops.getSpec(o.key, o.version);
      if (!s)
        throw new Error(
          `installFeature: operation not found ${o.key}.v${o.version}`
        );
    }
  }
  // Validate referenced presentations exist if registry provided
  if (deps.presentations && feature.presentations) {
    for (const p of feature.presentations) {
      const pres = deps.presentations.get(p.key, p.version);
      if (!pres)
        throw new Error(
          `installFeature: presentation not found ${p.key}.v${p.version}`
        );
    }
  }
  // Validate V2 target requirements if provided
  if (feature.presentationsTargets && deps.descriptorsV2) {
    for (const req of feature.presentationsTargets) {
      const d = deps.descriptorsV2.find(
        (x) => x.meta.key === req.key && x.meta.version === req.version
      );
      if (!d)
        throw new Error(
          `installFeature: V2 descriptor not found ${req.key}.v${req.version}`
        );
      for (const t of req.targets) {
        if (!d.targets.includes(t))
          throw new Error(
            `installFeature: descriptor ${req.key}.v${req.version} missing target ${t}`
          );
      }
    }
  }
  // Validate op→presentation links
  if (feature.opToPresentation && feature.opToPresentation.length > 0) {
    for (const link of feature.opToPresentation) {
      if (deps.ops) {
        const s = deps.ops.getSpec(link.op.key, link.op.version);
        if (!s)
          throw new Error(
            `installFeature: linked op not found ${link.op.key}.v${link.op.version}`
          );
      }
      if (deps.presentations) {
        const pres = deps.presentations.get(link.pres.key, link.pres.version);
        if (!pres)
          throw new Error(
            `installFeature: linked presentation not found ${link.pres.key}.v${link.pres.version}`
          );
      }
    }
  }
  // Validate capability bindings when registry provided
  if (deps.capabilities && feature.capabilities?.provides) {
    for (const cap of feature.capabilities.provides) {
      const spec = deps.capabilities.get(cap.key, cap.version);
      if (!spec)
        throw new Error(
          `installFeature: capability not registered ${cap.key}.v${cap.version}`
        );
    }
  }
  if (feature.capabilities?.requires?.length) {
    if (!deps.capabilities)
      throw new Error(
        `installFeature: capability registry required to validate capability requirements for ${feature.meta.key}`
      );
    const provided = feature.capabilities.provides ?? [];
    for (const req of feature.capabilities.requires) {
      const satisfied = deps.capabilities.satisfies(req, provided);
      if (!satisfied)
        throw new Error(
          `installFeature: capability requirement not satisfied ${req.key}${req.version ? `.v${req.version}` : ''}`
        );
    }
  }
  deps.features.register(feature);
  return deps.features;
}

/** Ensure declared target requirements exist on the provided descriptors. */
export function validateFeatureTargetsV2(
  feature: FeatureModuleSpec,
  descriptors: PresentationSpec[]
) {
  if (
    !feature.presentationsTargets ||
    feature.presentationsTargets.length === 0
  )
    return true;
  for (const req of feature.presentationsTargets) {
    const d = descriptors.find(
      (x) => x.meta.key === req.key && x.meta.version === req.version
    );
    if (!d)
      throw new Error(`V2 descriptor not found ${req.key}.v${req.version}`);
    for (const t of req.targets)
      if (!d.targets.includes(t))
        throw new Error(
          `Descriptor ${req.key}.v${req.version} missing target ${t}`
        );
  }
  return true;
}
