# Implementation Plan: Resolution Runtime

- **Spec:** 04_surface_resolution_and_runtime.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Implements the 10-step resolution pipeline that turns a ModuleBundleSpec plus request context into a concrete ResolvedSurfacePlan.

## Objectives

1. Implement resolveBundle(ctx, spec) returning ResolvedSurfacePlan.
2. Implement route → surface selection, layout selection, data recipe resolution.
3. Add preference adaptation stub and policy hooks.
4. Implement fallbacks (simpler layout → base overview → error surface).

## Non-goals (v1)

- Full overlay merge (defer to 07).
- AI planning step (defer to 05).
- Actual data fetching (stub with binding keys).

## Codebase alignment

- Resolver in `packages/libs/surface-runtime/src/runtime/resolve-bundle.ts`.
- Integrate with lib.observability for tracing.
- ResolvedSurfacePlan must be serializable and auditable.

## Workstreams

### WS1 — Resolver pipeline

- [x] Implement buildContext from request params.
- [x] Implement route → surface selection.
- [x] Implement layout selection (when predicate, priority).
- [x] Implement data recipe resolution (binding keys only).
- [x] Implement preference adaptation stub.
- [x] Implement policy hooks (allow/deny/redact stubs).

### WS2 — ResolvedSurfacePlan

- [x] Define ResolvedSurfacePlan type.
- [x] Include layout, bindings, overlays placeholder, audit metadata.
- [x] Add fallback chain logic.

### WS3 — applySurfacePatch

- [x] Implement applySurfacePatch(plan, patch) returning updated plan.
- [x] Validate patch against allowed ops and slots.
- [x] Ensure reversibility (inverse ops).

## Dependencies

- 01_core_bundle (types).
- 00_foundation (package exists).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Resolver latency > 100ms p95 | Instrument; clamp data depth; lazy panels. |
| Fallback chain too complex | Keep fallbacks simple; document clearly. |

## Implementation notes (completed)

- **Resolver** (`resolve-bundle.ts`): `resolveBundle`, `buildContext`, `selectSurface`, `selectLayout`, `resolveDataRecipes`, `buildAdaptation`, `createErrorPlan`.
- **ResolvedSurfacePlan**: `layoutRoot`, `actions`, `commands`, `adaptation`, `overlays`, `ai`, `audit.reasons`.
- **Types** (`spec/types.ts`): `ResolvedAdaptation`, `AppliedOverlayMeta`, `SurfacePatchProposal`.
- **Policy hooks**: `evaluateNode`, `redactBinding`, `evaluatePatchProposal` (stub PDP).
- **Observability**: `traceAsync('surface.resolveBundle')`, `resolutionDurationMs`, `surfaceFallbackCounter`, `Logger`.
- **Overlay merge**: Optional `overlayMerge` with `BundleOverrideStore`; applied in scope order (system → workspace → user).
- **applySurfacePatch**: Validation, inverse ops, pass-through of new plan fields.
