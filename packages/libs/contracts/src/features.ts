import type {
  PresentationTarget,
  PresentationDescriptorV2,
} from './presentations.v2';
import type { OwnerShipMeta } from './ownership';
import type {
  CapabilityRef,
  CapabilityRequirement,
  CapabilityRegistry,
} from './capabilities';
import type { ExperimentRef } from './experiments/spec';

/** Minimal metadata to identify and categorize a feature module. */
export interface FeatureModuleMeta extends OwnerShipMeta {
  /** Stable slug key used to identify this feature (e.g., "weekly_pulse"). */
  key: string;
}

export interface OpRef {
  /** Operation name (ContractSpec.meta.name). */
  name: string;
  /** Operation version (ContractSpec.meta.version). */
  version: number;
}

export interface EventRef {
  /** Event name. */
  name: string;
  /** Event version. */
  version: number;
}

export interface PresentationRef {
  /** Presentation name. */
  name: string;
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
    /** Presentation name. */
    name: string;
    /** Presentation version. */
    version: number;
    /** Required targets that must be supported by the descriptor. */
    targets: PresentationTarget[];
  }[];
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
}

/** Validate and register a feature against optional registries/descriptors. */
export function installFeature(
  feature: FeatureModuleSpec,
  deps: {
    features: FeatureRegistry;
    ops?: import('./registry').SpecRegistry;
    presentations?: import('./presentations').PresentationRegistry;
    descriptorsV2?: PresentationDescriptorV2[];
    capabilities?: CapabilityRegistry;
  }
) {
  // Validate referenced ops exist if registry provided
  if (deps.ops && feature.operations) {
    for (const o of feature.operations) {
      const s = deps.ops.getSpec(o.name, o.version);
      if (!s)
        throw new Error(
          `installFeature: operation not found ${o.name}.v${o.version}`
        );
    }
  }
  // Validate referenced presentations exist if registry provided
  if (deps.presentations && feature.presentations) {
    for (const p of feature.presentations) {
      const pres = deps.presentations.get(p.name, p.version);
      if (!pres)
        throw new Error(
          `installFeature: presentation not found ${p.name}.v${p.version}`
        );
    }
  }
  // Validate V2 target requirements if provided
  if (feature.presentationsTargets && deps.descriptorsV2) {
    for (const req of feature.presentationsTargets) {
      const d = deps.descriptorsV2.find(
        (x) => x.meta.name === req.name && x.meta.version === req.version
      );
      if (!d)
        throw new Error(
          `installFeature: V2 descriptor not found ${req.name}.v${req.version}`
        );
      for (const t of req.targets) {
        if (!d.targets.includes(t))
          throw new Error(
            `installFeature: descriptor ${req.name}.v${req.version} missing target ${t}`
          );
      }
    }
  }
  // Validate op→presentation links
  if (feature.opToPresentation && feature.opToPresentation.length > 0) {
    for (const link of feature.opToPresentation) {
      if (deps.ops) {
        const s = deps.ops.getSpec(link.op.name, link.op.version);
        if (!s)
          throw new Error(
            `installFeature: linked op not found ${link.op.name}.v${link.op.version}`
          );
      }
      if (deps.presentations) {
        const pres = deps.presentations.get(link.pres.name, link.pres.version);
        if (!pres)
          throw new Error(
            `installFeature: linked presentation not found ${link.pres.name}.v${link.pres.version}`
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
  descriptors: PresentationDescriptorV2[]
) {
  if (
    !feature.presentationsTargets ||
    feature.presentationsTargets.length === 0
  )
    return true;
  for (const req of feature.presentationsTargets) {
    const d = descriptors.find(
      (x) => x.meta.name === req.name && x.meta.version === req.version
    );
    if (!d)
      throw new Error(`V2 descriptor not found ${req.name}.v${req.version}`);
    for (const t of req.targets)
      if (!d.targets.includes(t))
        throw new Error(
          `Descriptor ${req.name}.v${req.version} missing target ${t}`
        );
  }
  return true;
}
