# TypeScript API and Package Skeleton

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime`
- **Repo Path:** `packages/libs/surface-runtime`


## Goal

Provide a practical starting point for a real implementation.

This spec pack includes a `package-skeleton/` folder with starter files.

## Recommended package API

### Public imports

```ts
import {
  defineModuleBundle,
  type ModuleBundleSpec,
} from "@contractspec/lib.surface-runtime/spec";

import {
  resolveBundle,
  applySurfacePatch,
} from "@contractspec/lib.surface-runtime/runtime";

import {
  BundleProvider,
  BundleRenderer,
} from "@contractspec/lib.surface-runtime/react";
```

## Example usage

```ts
import { defineModuleBundle } from "@contractspec/lib.surface-runtime/spec";

export const PmWorkbenchBundle = defineModuleBundle({
  meta: {
    key: "pm.workbench",
    version: "0.1.0",
    title: "PM Workbench",
    description: "AI-native PM issue and view workbench",
    owners: ["team-pm-platform"],
    stability: "experimental",
  },
  routes: [
    {
      routeId: "pm-issue",
      path: "/operate/pm/issues/:issueId",
      defaultSurface: "issue-workbench",
    },
  ],
  surfaces: {
    "issue-workbench": {
      surfaceId: "issue-workbench",
      kind: "workbench",
      title: "Issue Workbench",
      slots: [
        { slotId: "header", role: "header", accepts: ["action-bar"], cardinality: "many" },
        { slotId: "primary", role: "primary", accepts: ["entity-section", "table", "rich-doc"], cardinality: "many", mutableByAi: true, mutableByUser: true },
        { slotId: "secondary", role: "secondary", accepts: ["entity-section", "table", "timeline"], cardinality: "many", mutableByAi: true, mutableByUser: true },
        { slotId: "assistant", role: "assistant", accepts: ["assistant-panel", "chat-thread"], cardinality: "many", mutableByAi: true, mutableByUser: true },
        { slotId: "inspector", role: "inspector", accepts: ["entity-field", "relation-graph", "custom-widget"], cardinality: "many", mutableByAi: true, mutableByUser: true },
      ],
      layouts: [
        {
          layoutId: "balanced-three-pane",
          root: {
            type: "panel-group",
            direction: "horizontal",
            persistKey: "pm.issue.balanced-three-pane",
            children: [
              { type: "slot", slotId: "primary" },
              {
                type: "panel-group",
                direction: "vertical",
                persistKey: "pm.issue.right-stack",
                children: [
                  { type: "slot", slotId: "secondary" },
                  { type: "slot", slotId: "assistant" },
                ],
              },
              { type: "slot", slotId: "inspector" },
            ],
          },
        },
      ],
      data: [
        {
          recipeId: "issue-core",
          source: { kind: "entity", entityType: "pm.issue" },
          requestedDepth: "detailed",
          hydrateInto: "issue",
        },
      ],
      verification: {
        dimensions: {
          guidance: "Can reveal walkthrough notes and inline explanations",
          density: "Can promote three-pane dense layout on desktop",
          dataDepth: "Controls relation inlining and activity window size",
          control: "Shows advanced commands and raw config tabs only when allowed",
          media: "Supports text-first, visual graph, and hybrid variants",
          pace: "Maps to motion tokens and confirmation behavior",
          narrative: "Can reorder summary and evidence blocks",
        },
      },
    },
  },
});
```

## What is included in the skeleton

- `package.json`
- `tsconfig.json`
- `README.md`
- `src/index.ts`
- `src/spec/types.ts`
- `src/spec/define-module-bundle.ts`
- `src/runtime/resolve-bundle.ts`
- `src/runtime/apply-surface-patch.ts`
- `src/react/BundleProvider.tsx`
- `src/react/BundleRenderer.tsx`
- `src/adapters/*`

The skeleton is intentionally thin. It is not pretending to implement the full runtime. It gives you a credible starting point that reflects the spec.

## API style recommendations

### 1. Prefer plain TypeScript objects
ContractSpec is already spec-first and TypeScript-first. Keep that.

### 2. Prefer small helper builders
Examples:
- `defineModuleBundle`
- `defineSurface`
- `defineLayout`
- `defineWidget`

### 3. Keep runtime return shapes serializable
Resolved plans should be easy to inspect and, when safe, easy to serialize.

### 4. Keep adapters optional
The core spec/runtime should not force all web libraries onto every user.

## Recommended validation layers

- Zod or schema-level validation for authoring
- runtime validation for patches and overlays
- lints for missing verification blocks
- tests for slot/node/patch invariants

## Lints worth adding

- surface missing verification block
- AI-enabled surface missing allowed slots
- layout references undeclared slot
- node kind used without renderer
- persistent patch op used on non-mutable slot
- route default surface missing from surface registry

## Package skeleton caveat

The included skeleton is intentionally **not** over-engineered.

It exists to shorten the first real implementation cycle, not to trick anyone into thinking the hard part is typing `export * from "./spec/types"` and calling it architecture.
