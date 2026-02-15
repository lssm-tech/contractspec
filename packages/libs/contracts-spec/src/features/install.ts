import type { PresentationSpec } from '../presentations/presentations';
import type { CapabilityRegistry } from '../capabilities';
import type { FeatureModuleSpec } from './types';
import type { FeatureRegistry } from './registry';

/** Dependencies for installing a feature. */
export interface InstallFeatureDeps {
  features: FeatureRegistry;
  ops?: import('../operations/registry').OperationSpecRegistry;
  presentations?: import('../presentations').PresentationRegistry;
  descriptors?: PresentationSpec[];
  capabilities?: CapabilityRegistry;
}

/** Validate and register a feature against optional registries/descriptors. */
export function installFeature(
  feature: FeatureModuleSpec,
  deps: InstallFeatureDeps
) {
  // Validate referenced ops exist if registry provided
  if (deps.ops && feature.operations) {
    for (const o of feature.operations) {
      const s = deps.ops.get(o.key, o.version);
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
  if (feature.presentationsTargets && deps.descriptors) {
    for (const req of feature.presentationsTargets) {
      const d = deps.descriptors.find(
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
        const s = deps.ops.get(link.op.key, link.op.version);
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
