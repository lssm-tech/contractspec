# Surface Runtime Rollout Plan

- **Spec:** 13_rollout_plan.md
- **Package:** `@contractspec/lib.surface-runtime`
- **Status:** Complete

## Goal

Ship this package incrementally, with enough structure to learn from reality before it spreads across the product.

## Pilot Route

- **Path:** `/operate/pm/issues/:issueId`
- **Location:** bundle.workspace or bundle.library (PM issue workbench)
- **Why:** Exercises deep entity surfaces, saved views, dense layouts, assistant help, custom fields, relation-heavy context, cross-domain panels.

## Phase Mapping

| Phase | Focus | Implementation Plans | Gate |
|-------|-------|---------------------|------|
| 0 | Package scaffold | 00, 01, 10 | Types compile, defineModuleBundle works, package-skeleton builds |
| 1 | Resolver MVP | 02, 03 | One route resolves to ResolvedSurfacePlan, fallbacks work |
| 2 | React renderer MVP | 04 | BundleRenderer renders one workbench surface from plan |
| 3 | PM issue workbench pilot | 06 | PM issue detail page uses bundle-native surfaces |
| 4 | Assistant integration | 05 | Assistant can propose and user can accept/reject patches |
| 5 | Durable customization | 07 | User/workspace overlays persist with audit trail |
| 6 | Customization mode | 07 | DnD editing mode, widget palette functional |
| 7 | Evaluation and hardening | 08, 09, 12 | Golden-context harness, evals, dashboards in place |

## Workstreams

### WS1 — Phase 0–2 (scaffold, resolver, renderer)

- [x] Phase 0: Package scaffold, types, defineModuleBundle, adapter boundaries.
- [x] Phase 1: Resolver MVP, ResolvedSurfacePlan, fallbacks.
- [x] Phase 2: BundleProvider, BundleRenderer, panels, motion tokens.
- **Gate:** One workbench surface renders from plan.

### WS2 — Phase 3–4 (PM pilot, assistant)

- [x] Phase 3: PM issue bundle spec, field registry, sections, saved view types (06_entity_surfaces).
- [x] Phase 3 gate: PM issue detail page uses bundle-native surfaces.
- [x] Phase 4: AI SDK adapter, planner, patch proposals, accept/reject UI (05_ai_chat).
- **Gate:** Issue detail page bundle-native; assistant proposes patches.

### WS3 — Phase 5–7 (customization, evals)

- [x] Phase 5: User/workspace overlay persistence (07_extensions: override store, overlay merge in resolve).
- [x] Phase 5 follow-up: Approval gate for workspace overlays (createOverrideStoreWithApprovalGate).
- [x] Phase 6: Customization mode (DnD, widget palette).
- [x] Phase 7: Golden-context harness, evals (09_observability).
- [x] Phase 7 (08): Policy hooks, audit events, rollback API.
- [x] Phase 7 (12): Verification matrix, snapshot coverage, review docs.
- **Gate:** Full audit trail; regression tests pass.

## Performance Budgets

| Metric | Budget | Notes |
|--------|--------|-------|
| Resolver (server) | <100ms p95 | Before data fetch |
| Resolver (client) | <30ms p95 | Preference/layout-only updates |
| Initial plan size | Modest | Avoid sending full raw datasets; use recipe binding keys |
| AI planning | No planner on first paint | Planner can run after initial render for enhancement |

**Instrumentation:** `resolutionDurationMs` histogram records resolution time. Use `bundle_surface_resolution_duration_ms` in dashboards to track p95.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Too much abstraction early | Pilot single route family first. |
| AI patch scope too broad | Start with assistant/helper slot patches only. |
| Saved layouts invalid after spec change | Version layouts; validate persisted patches. |
| Performance collapse | Data depth clamps; lazy panels; instrumentation. |
| Bundle specs become unreadable | Keep surface specs modular; link to named layouts/widgets. |

## Team Sequencing

If parallelizing:

- One engineer on spec/runtime
- One on React renderer/adapters
- One on PM pilot surface + field registry
- One on AI patching + observability

**Do not** let four people invent four different local abstractions. Align on shared types and patterns early.

## Dependencies

- All implementation plans 00–10 (rollout orchestrates them).
- See `specs/contractspec_modules_bundle_spec_2026-03-08/implementation_plans/MASTER.md` for plan status.
