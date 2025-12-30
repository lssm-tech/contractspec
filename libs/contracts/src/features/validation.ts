import type { PresentationSpec } from '../presentations/presentations';
import type { FeatureModuleSpec } from './types';

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
