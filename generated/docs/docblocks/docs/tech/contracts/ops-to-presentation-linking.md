### Ops ↔ Presentation linking (V2)

This document explains how operations (OperationSpec) are linked to Presentations (PresentationSpec) via Feature modules.

- Location: `@contractspec/lib.contracts-spec/src/features.ts`
- Field: `FeatureModuleSpec.opToPresentation?: { op: { name; version }; pres: { name; version } }[]`
- Validation: `installFeature()` validates that linked ops exist in `OperationSpecRegistry` and linked presentations exist in the registry, and that declared targets are present.

Example:

```ts
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/src/registry';
import { FeatureRegistry, createFeatureModule } from '@contractspec/lib.contracts-spec';

export function buildFeaturesWithOps(ops: OperationSpecRegistry) {
  const features = new FeatureRegistry();
  features.register(
    createFeatureModule(
      {
        key: 'myapp.widgets.linkage',
        title: 'Widgets (linked)',
        description: 'Links create/update ops to UI presentations',
        domain: 'widgets',
        tags: ['widgets', 'linkage'],
        stability: 'beta',
      },
      {
        operations: [
          { name: 'widgets.create', version: '1.0.0' },
          { name: 'widgets.update', version: '1.0.0' },
        ],
        presentations: [{ name: 'myapp.widgets.editor.page', version: '1.0.0' }],
        opToPresentation: [
          {
            op: { name: 'widgets.create', version: '1.0.0' },
            pres: { name: 'myapp.widgets.editor.page', version: '1.0.0' },
          },
          {
            op: { name: 'widgets.update', version: '1.0.0' },
            pres: { name: 'myapp.widgets.editor.page', version: '1.0.0' },
          },
        ],
        presentationsTargets: [
          {
            name: 'myapp.widgets.editor.page',
            version: '1.0.0',
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
