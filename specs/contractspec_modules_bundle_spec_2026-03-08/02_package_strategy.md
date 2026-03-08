# Package Strategy

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Recommended package

**Public package name:** `@contractspec/lib.modules-bundle`  
**Recommended repo path:** `packages/libs/modules-bundle`

Alternative repo layout if you insist on matching the phrase “lib/modules/bundle” literally:

- `packages/libs/modules/bundle`

That is acceptable in a monorepo, but I still recommend a flatter directory because it is more consistent with the existing package directories already visible from published package metadata.

## Why a new package is the right boundary

This package composes across multiple existing concerns:

- contracts and presentations
- overlays
- policy
- observability
- agent orchestration
- data view selection
- workflow composition
- user customization persistence
- web runtime adapters

That is too much for:
- `lib.ui-kit`
- `lib.overlay-engine`
- or `lib.contracts-spec`

Each of those already has a strong, narrower identity.

## Relationship to existing ContractSpec packages

### It should depend on

- `@contractspec/lib.contracts-spec`
- `@contractspec/lib.overlay-engine`
- `@contractspec/lib.observability`
- `@contractspec/lib.ai-agent` (or at least interoperate cleanly)

### It should interoperate with

- personalization
- data views
- workflows
- workflow composer
- runtime
- accessibility
- design system

### It should not duplicate

- operation specs
- overlay signature logic
- primitive design tokens
- generalized agent providers
- observability pipelines

## Suggested package exports

```json
{
  "name": "@contractspec/lib.modules-bundle",
  "exports": {
    ".": "./dist/index.js",
    "./spec": "./dist/spec/index.js",
    "./runtime": "./dist/runtime/index.js",
    "./react": "./dist/react/index.js",
    "./registry": "./dist/registry/index.js",
    "./persistence": "./dist/persistence/index.js",
    "./ai": "./dist/ai/index.js",
    "./eval": "./dist/eval/index.js",
    "./adapters/blocknote": "./dist/adapters/blocknote/index.js",
    "./adapters/dnd-kit": "./dist/adapters/dnd-kit/index.js",
    "./adapters/floating-ui": "./dist/adapters/floating-ui/index.js",
    "./adapters/motion": "./dist/adapters/motion/index.js",
    "./adapters/resizable-panels": "./dist/adapters/resizable-panels/index.js",
    "./adapters/ai-sdk": "./dist/adapters/ai-sdk/index.js"
  }
}
```

## Suggested internal folder structure

```text
packages/libs/modules-bundle/
  src/
    index.ts
    spec/
      types.ts
      define-module-bundle.ts
      validators.ts
    runtime/
      resolve-bundle.ts
      select-surface.ts
      apply-overlays.ts
      apply-preferences.ts
      apply-patches.ts
      cache.ts
    react/
      BundleProvider.tsx
      BundleRenderer.tsx
      SurfaceRenderer.tsx
      SlotRenderer.tsx
    registry/
      widget-registry.ts
      field-registry.ts
      action-registry.ts
      command-registry.ts
    persistence/
      layout-store.ts
      view-store.ts
      bundle-state-store.ts
    ai/
      planner.ts
      patch-schema.ts
      prompt-compiler.ts
      approval.ts
    eval/
      metrics.ts
      golden-contexts.ts
      snapshot-harness.ts
    adapters/
      blocknote/
      dnd-kit/
      floating-ui/
      motion/
      resizable-panels/
      ai-sdk/
```

## Dependencies and peers

### Hard dependencies

The core package should hard-depend on:

- `@contractspec/lib.contracts-spec`
- `@contractspec/lib.overlay-engine`
- `@contractspec/lib.observability`
- `ai`
- `zod`

### Peer dependencies

The web runtime should use peer dependencies for:

- `react`
- `react-dom`
- `@blocknote/core`
- `@blocknote/react`
- `@floating-ui/react`
- `motion`
- `react-resizable-panels`

For dnd-kit, use a peer dependency plus a local adapter boundary. The exact package line may vary depending on the chosen version in the repo lockfile.

### Why peers

These libraries are UI/runtime-level concerns and should not be forced into every non-web environment or every ContractSpec consumer.

## Adapter rule

No code outside `src/adapters/*` should import the third-party UI libraries directly.

That rule matters because:
- versions move,
- import paths change,
- capabilities shift,
- and you may want to swap implementations later.

If you break that rule, the package will calcify fast.

## Versioning strategy

Use normal semver.

Treat these changes as **major**:
- bundle spec shape changes
- surface patch operation changes
- extension API changes
- registry interface changes
- persistence schema changes

Treat these as **minor**:
- new node kinds
- new patch ops that are additive
- new adapter helpers
- new telemetry events

## Migration strategy

Adopt in this order:

1. Define bundle specs for one route family.
2. Render the bundle with a compatibility renderer that still points at existing React pages where needed.
3. Replace bespoke pages with bundle-native surfaces one by one.
4. Move layout state into bundle persistence.
5. Turn on AI planning for assistant slot first.
6. Expand to panel patches and entity surface adaptation later.

That sequence keeps risk contained and avoids a big-bang rewrite, which is how humans usually make everything worse.
