# Implementation Plan: Extension and Override Model

- **Spec:** 09_extension_and_override_model.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Enables widgets, field renderers, actions, commands, and surface patches as extensions with trust tiers. Aligns with lib.overlay-engine for durable overrides. Supports customization mode (Phase 6).

## Objectives

1. Align OverlaySpec with lib.overlay-engine (SignedOverlaySpec, OverlayTargetRef, OverlayRenderableField).
2. Implement widget registry (core, workspace, signed-plugin; never ephemeral-ai for registration).
3. Implement overlay merge: base → system → workspace → user → session → AI proposals.
4. Implement user/workspace overlay persistence with approval flow.
5. Implement conflict resolution UI for overlay merge.

## Implementation Summary (2026-03-08)

| Deliverable | File(s) | Notes |
|-------------|---------|-------|
| Overlay alignment | `runtime/overlay-alignment.ts` | toOverlayScopeContext, toOverlayTargetRef, toOverlayRenderableField, applyEntityFieldOverlays |
| Overlay signer | `runtime/overlay-signer.ts` | signWorkspaceOverlay, verifyWorkspaceOverlay |
| Widget registry | `runtime/widget-registry.ts` | WidgetRegistryEntry, createWidgetRegistry; rejects ephemeral-ai |
| Field renderer registry | `runtime/field-renderer-registry.ts` | createMutableFieldRendererRegistry, registerFieldRenderer |
| Action/command registries | `runtime/extension-registry.ts` | createActionRegistry, createCommandRegistry, createBundleExtensionRegistry |
| Override store | `runtime/override-store.ts` | BundleOverrideStore, createInMemoryOverrideStore, buildOverrideTargetKey |
| Overlay merge in resolution | `runtime/resolve-bundle.ts` | OverlayMergeOptions; applies system→workspace→team→user overlays; plan.overlays metadata |

**Approval flow:** Persistence is implemented. `createOverrideStoreWithApprovalGate` enforces workspace approval when `requireApprovalForWorkspacePatches` is set.

**Deferred:** Signed plugin verification (stub).

## Non-goals (v1)

- Signed plugin verification (stub).
- Full customization mode DnD (defer to Phase 6).
- Widget palette and extension point browser (defer).
- Conflict resolution UI for overlay merge (implemented: OverlayConflictResolver).

## Codebase alignment

- lib.overlay-engine: merger, runtime, signer APIs.
- Overlay order and trust tiers from spec.
- Widgets registered in code, not from prompts.

## Workstreams

### WS1 — Overlay alignment

- [x] Map surface runtime overlay types to overlay-engine types.
- [x] Use overlay-engine merger for overlay application.
- [x] Use overlay-engine signer for workspace overlays.
- [x] Document OverlayTargetRef, OverlayRenderableField mapping.

### WS2 — Widget and extension registries

- [x] Implement WidgetRegistryEntry and registry.
- [x] Implement field renderer registry (extends 06).
- [x] Implement action and command registries.
- [x] Enforce: widgets never registered from AI prompts.

### WS3 — Overlay persistence

- [x] Implement user overlay persistence.
- [x] Implement workspace overlay persistence.
- [x] Implement approval flow for workspace overlays (persistence + caller-enforced governance; no built-in approval gate in store).
- [x] Add overlay merge diagnostics (plan.overlays with scope, overlayId, appliedOps).
- [x] Add conflict resolution UI (OverlayConflictResolver).

## Dependencies

- 01_core_bundle (extension point types).
- 02_resolution_runtime (overlay application in pipeline).
- 06_entity_surfaces (field renderer registry).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Overlay merge conflicts | Clear precedence; conflict resolution UI. |
| Trust tier bypass | Never register widgets from prompts; validate on load. |
