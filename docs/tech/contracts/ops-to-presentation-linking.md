### Ops ↔ Presentation linking (V2)

This document explains how operations (ContractSpec) are linked to Presentations (PresentationDescriptorV2) via Feature modules.

- Location: `@lssm/lib.contracts/src/features.ts`
- Field: `FeatureModuleSpec.opToPresentation?: { op: { name; version }; pres: { name; version } }[]`
- Validation: `installFeature()` validates that linked ops exist in `SpecRegistry` and linked presentations exist in the registry, and that declared targets are present.

Example (Strit spots):

```ts
import type { SpecRegistry } from '@lssm/lib.contracts/src/registry';
import { FeatureRegistry, createFeatureModule } from '@lssm/lib.contracts';

export function buildStritFeaturesWithOps(ops: SpecRegistry) {
  const features = new FeatureRegistry();
  features.register(
    createFeatureModule(
      {
        key: 'strit.spots.linkage',
        title: 'Spots (linked)',
        description: 'Links create/update ops to UI presentations',
        domain: 'collectivity',
        tags: ['spots', 'linkage'],
        stability: 'beta',
      },
      {
        operations: [
          { name: 'spots.createSpot', version: 1 },
          { name: 'spots.createSpotSeries', version: 1 },
        ],
        presentations: [{ name: 'strit.spots.new.page', version: 1 }],
        opToPresentation: [
          {
            op: { name: 'spots.createSpot', version: 1 },
            pres: { name: 'strit.spots.new.page', version: 1 },
          },
          {
            op: { name: 'spots.createSpotSeries', version: 1 },
            pres: { name: 'strit.spots.new.page', version: 1 },
          },
        ],
        presentationsTargets: [
          {
            name: 'strit.spots.new.page',
            version: 1,
            targets: ['react', 'markdown'],
          },
        ],
      }
    )
  );
  return { features };
}
```

Notes

- This enables traceability: the UI flow that realizes an op is discoverable via the feature catalog.
- Presentations can target multiple outputs (`react`, `markdown`, `application/json`, `application/xml`).
- Use `renderFeaturePresentation()` to render a descriptor to a given target with a component map.
