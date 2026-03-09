# Implementation Plan: Rollout Plan

- **Spec:** 13_rollout_plan.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Orchestrates phased delivery from scaffold to full PM workbench pilot and beyond. Defines acceptance criteria, risks, and team sequencing.

## Objectives

1. Execute Phase 0 (scaffold) through Phase 7 (evals) in order.
2. Pilot on `/operate/pm/issues/:issueId` (or equivalent in bundle.workspace/bundle.library).
3. Meet performance budgets: resolver <100ms p95 server, <30ms client.
4. Document rollout risks and mitigations.

## Non-goals (v1)

- All phases in one release.
- Multiple pilot routes (one first).
- Customization mode full feature set (Phase 6 can be partial).

## Codebase alignment

- Pilot route in bundle.workspace or bundle.library.
- See MASTER.md for phase-to-plan mapping.

## Deliverables (this plan)

- [x] ROLLOUT.md in `packages/libs/surface-runtime/` — phase mapping, budgets, risks, pilot route.
- [x] README updated with rollout status and link to ROLLOUT.md.
- [x] Performance instrumentation — `resolutionDurationMs` wired in resolve-bundle for p95 tracking.
- [x] Changeset `.changeset/feat-rollout-plan.md`.

## Workstreams

### WS1 — Phase 0–2 (scaffold, resolver, renderer)

- [x] Phase 0: Package scaffold, types, defineModuleBundle, adapter boundaries.
- [x] Phase 1: Resolver MVP, ResolvedSurfacePlan, fallbacks.
- [x] Phase 2: BundleProvider, BundleRenderer, panels, motion tokens.
- [x] Gate: One workbench surface renders from plan.

### WS2 — Phase 3–4 (PM pilot, assistant)

- [x] Phase 3: PM issue bundle spec, field registry, sections, saved view types (06_entity_surfaces).
- [x] Phase 3 gate: PM issue detail page uses bundle-native surfaces.
- [x] Phase 4: AI SDK adapter, planner, patch proposals, accept/reject UI (05_ai_chat).
- [x] Gate: Issue detail page bundle-native; assistant proposes patches.

### WS3 — Phase 5–7 (customization, evals)

- [x] Phase 5: User/workspace overlay persistence (07_extensions: override store, overlay merge).
- [x] Phase 5 follow-up: Approval gate for workspace overlays.
- [x] Phase 6: Customization mode (DnD, widget palette).
- [x] Phase 7 (08): Policy hooks, audit events, rollback API.
- [x] Phase 7: Golden-context harness, evals (09_observability).
- [x] Phase 7 (12): Verification matrix, snapshot coverage, review docs.
- [x] Gate: Full audit trail; regression tests pass.

## Dependencies

- All plans 00–10 (rollout orchestrates them).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Too much abstraction early | Pilot single route family first. |
| AI patch scope too broad | Start with assistant/helper slot only. |
| Saved layouts invalid after spec change | Version layouts; validate persisted patches. |
| Performance collapse | Data depth clamps; lazy panels; instrumentation. |

## Traceability

| Artifact | Path |
|----------|------|
| Rollout doc | `packages/libs/surface-runtime/ROLLOUT.md` |
| Spec | `../13_rollout_plan.md` |
| Master | `./MASTER.md` |
