import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '../../registry';

export const tech_contracts_ops_to_presentation_linking_DocBlocks: DocBlock[] = [
  {
    id: "docs.tech.contracts.ops-to-presentation-linking",
    title: "Ops \u2194 Presentation linking (V2)",
    summary: "This document explains how operations (ContractSpec) are linked to Presentations (PresentationDescriptorV2) via Feature modules.",
    kind: 'reference',
    visibility: 'public',
    route: "/docs/tech/contracts/ops-to-presentation-linking",
    tags: ["tech", "contracts", "ops-to-presentation-linking"],
    body: "### Ops \u2194 Presentation linking (V2)\n\nThis document explains how operations (ContractSpec) are linked to Presentations (PresentationDescriptorV2) via Feature modules.\n\n- Location: `@lssm/lib.contracts/src/features.ts`\n- Field: `FeatureModuleSpec.opToPresentation?: { op: { name; version }; pres: { name; version } }[]`\n- Validation: `installFeature()` validates that linked ops exist in `SpecRegistry` and linked presentations exist in the registry, and that declared targets are present.\n\nExample (Strit spots):\n\n```ts\nimport type { SpecRegistry } from '@lssm/lib.contracts/src/registry';\nimport { FeatureRegistry, createFeatureModule } from '@lssm/lib.contracts';\n\nexport function buildStritFeaturesWithOps(ops: SpecRegistry) {\n  const features = new FeatureRegistry();\n  features.register(\n    createFeatureModule(\n      {\n        key: 'strit.spots.linkage',\n        title: 'Spots (linked)',\n        description: 'Links create/update ops to UI presentations',\n        domain: 'collectivity',\n        tags: ['spots', 'linkage'],\n        stability: 'beta',\n      },\n      {\n        operations: [\n          { name: 'spots.createSpot', version: 1 },\n          { name: 'spots.createSpotSeries', version: 1 },\n        ],\n        presentations: [{ name: 'strit.spots.new.page', version: 1 }],\n        opToPresentation: [\n          {\n            op: { name: 'spots.createSpot', version: 1 },\n            pres: { name: 'strit.spots.new.page', version: 1 },\n          },\n          {\n            op: { name: 'spots.createSpotSeries', version: 1 },\n            pres: { name: 'strit.spots.new.page', version: 1 },\n          },\n        ],\n        presentationsTargets: [\n          {\n            name: 'strit.spots.new.page',\n            version: 1,\n            targets: ['react', 'markdown'],\n          },\n        ],\n      }\n    )\n  );\n  return { features };\n}\n```\n\nNotes\n\n- This enables traceability: the UI flow that realizes an op is discoverable via the feature catalog.\n- Presentations can target multiple outputs (`react`, `markdown`, `application/json`, `application/xml`).\n- Use `renderFeaturePresentation()` to render a descriptor to a given target with a component map.\n",
  },
];
registerDocBlocks(tech_contracts_ops_to_presentation_linking_DocBlocks);