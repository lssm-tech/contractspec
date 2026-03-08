# Implementation Plan: Core Bundle Spec

- **Spec:** 03_core_bundle_spec.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`
- **Completed:** 2026-03-08

## Why this exists

Defines the canonical TypeScript shape for ModuleBundleSpec and related types. This is the contract layer that all resolution, rendering, and AI planning depend on.

## Objectives

1. Implement ModuleBundleSpec, BundleContext, PreferenceDimensions, SurfaceSpec, SlotSpec, LayoutBlueprintSpec, DataRecipeSpec.
2. Implement SurfacePatchOp, SurfaceNode, and patch grammar.
3. Implement defineModuleBundle and validators.
4. Add `requires` field for FeatureModuleSpec alignment (ai-chat, metering).

## Non-goals (v1)

- Full entity registry types (defer to 06).
- Full extension point types (defer to 07).
- Runtime resolution logic (defer to 02).

## Codebase alignment

- Align with contracts-spec `defineFeature` / FeatureModuleSpec.
- Types live in `packages/libs/surface-runtime/src/spec/types.ts`.
- defineModuleBundle in `packages/libs/surface-runtime/src/spec/define-module-bundle.ts`.

## Workstreams

### WS1 — Core types

- [x] Implement BundleMeta, BundleContext, PreferenceDimensions.
- [x] Implement ModuleBundleSpec with `requires` field.
- [x] Implement BundleRouteSpec, SurfaceSpec, SlotSpec.
- [x] Implement LayoutBlueprintSpec, RegionNode variants.
- [x] Implement DataRecipeSpec, ActionSpec, CommandSpec.

### WS2 — Patch grammar

- [x] Implement SurfacePatchOp union type.
- [x] Implement SurfaceNode interface.
- [x] Add patch validator (schema check, reversibility).

### WS3 — defineModuleBundle

- [x] Implement defineModuleBundle function.
- [x] Add runtime validation for spec shape.
- [x] Ensure example pm-workbench.bundle.ts typechecks.

## Dependencies

- 00_foundation (package scaffold).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Type explosion | Keep spec minimal; add types incrementally. |
| PreferenceDimensions drift | Reference 01_preference_dimensions.md; keep in sync. |
