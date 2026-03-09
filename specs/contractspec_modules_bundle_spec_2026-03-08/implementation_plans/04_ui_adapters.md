# Implementation Plan: UI Composition and Adapters

- **Spec:** 06_ui_composition_and_adapters.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Wraps third-party UI libraries (BlockNote, dnd-kit, Floating UI, Motion, resizable-panels, AI SDK) behind adapter boundaries. No code outside src/adapters/ imports these libs directly.

## Objectives

1. Create adapter interfaces for BlockNote, dnd-kit, Floating UI, Motion, resizable-panels.
2. Create AI SDK adapter for planner/chat integration.
3. Implement BundleProvider and BundleRenderer React components.
4. Implement slot rendering and panel groups via resizable-panels.
5. Map motion tokens to preference pace dimension.

## Non-goals (v1)

- Full BlockNote integration (stub).
- Full dnd-kit customization mode (defer to Phase 6).
- All adapter implementations complete (stubs acceptable for Phase 2).

## Codebase alignment

- Adapters in `packages/libs/surface-runtime/src/adapters/`.
- BundleRenderer composes or wraps contracts-runtime-client-react where applicable.
- Peer dependencies for React, BlockNote, dnd-kit, etc.

## Workstreams

### WS1 — Adapter boundaries

- [x] Create adapter interfaces (no direct imports outside adapters/).
- [x] Implement blocknote adapter stub.
- [x] Implement dnd-kit adapter stub.
- [x] Implement floating-ui adapter stub.
- [x] Implement motion adapter stub.
- [x] Implement resizable-panels adapter stub.
- [x] Implement ai-sdk adapter stub.

### WS2 — React components

- [x] Implement BundleProvider (context for plan, preferences).
- [x] Implement BundleRenderer (renders ResolvedSurfacePlan).
- [x] Implement SlotRenderer.
- [x] Implement panel groups via resizable-panels adapter.
- [x] Map density/pace to motion tokens.

### WS3 — Integration

- [x] Ensure BundleRenderer can render one workbench surface from plan.
- [x] Panel persistence (persistKey) works.
- [x] Dense vs compact variants visually distinct.

## Dependencies

- 01_core_bundle (types).
- 02_resolution_runtime (ResolvedSurfacePlan).
- 00_foundation (package scaffold).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Adapter interface too thin | Start with minimal interface; expand as needed. |
| Third-party lib churn | Adapters isolate; swap implementations behind interface. |

## Completion notes (2026-03-08)

- **Adapter interfaces:** `src/adapters/interfaces.ts` — BlockNote, dnd-kit, Floating UI, Motion, Panels, AI SDK.
- **Adapter stubs:** `src/adapters/*-stub.ts(x)` — No direct third-party imports.
- **ResolvedSurfacePlan:** Added `layoutRoot: RegionNode` for renderer.
- **React:** BundleProvider (plan + preferences), BundleRenderer, RegionRenderer, SlotRenderer.
- **Motion tokens:** Pace → `{ durationMs, enableEntrance, layout }` (deliberate: 300ms, balanced: 150ms, rapid: 50ms).
- **Panel persistence:** `restoreLayout` / `saveLayout` via localStorage.
- **Deferred:** contracts-runtime-client-react composition (06_entity_surfaces); BlockNote/dnd-kit/Floating UI full integration; peer deps for UI libs (stubs sufficient for Phase 2).
