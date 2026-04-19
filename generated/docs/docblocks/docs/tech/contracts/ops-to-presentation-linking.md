### Ops to Presentation Linking (V2)

This document explains how operations (`OperationSpec`) are linked to presentations (`PresentationSpec`) via feature modules.

- Location: `packages/libs/contracts-spec/src/features/types.ts`
- Field: `FeatureModuleSpec.opToPresentation?: { op: OpRef; pres: PresentationRef }[]`
- Validation:
  - `validateFeatureSpec()` checks that linked refs are declared in the feature itself
  - `installFeature()` checks that declared refs exist in the provided registries
  - `validateFeatureTargetsV2()` checks descriptor target support

Example:

```ts
import { defineFeature, FeatureRegistry } from '@contractspec/lib.contracts-spec/features';

export const WidgetsFeature = defineFeature({
  meta: {
    key: 'myapp.widgets.linkage',
    version: '1.0.0',
    title: 'Widgets (linked)',
    description: 'Links create and update operations to UI presentations.',
    domain: 'widgets',
    owners: ['platform.widgets'],
    tags: ['widgets', 'linkage'],
    stability: 'beta',
  },
  operations: [
    { key: 'widgets.create', version: '1.0.0' },
    { key: 'widgets.update', version: '1.0.0' },
  ],
  presentations: [
    { key: 'myapp.widgets.editor.page', version: '1.0.0' },
  ],
  opToPresentation: [
    {
      op: { key: 'widgets.create', version: '1.0.0' },
      pres: { key: 'myapp.widgets.editor.page', version: '1.0.0' },
    },
    {
      op: { key: 'widgets.update', version: '1.0.0' },
      pres: { key: 'myapp.widgets.editor.page', version: '1.0.0' },
    },
  ],
  presentationsTargets: [
    {
      key: 'myapp.widgets.editor.page',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
  ],
});

const features = new FeatureRegistry().register(WidgetsFeature);
```

Notes:

- This enables traceability: the UI flow that realizes an operation is discoverable via the feature catalog.
- Presentations can target multiple outputs (`react`, `markdown`, `application/json`, `application/xml`).
- Use `renderFeaturePresentation()` to render a descriptor to a given target with a component map.
