# Implementation Plans Master

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime`
- **Repo Path:** `packages/libs/surface-runtime`

## Overview

This document tracks all implementation plans for the surface runtime spec pack. Each plan maps to one or more spec documents and defines workstreams with acceptance criteria.

## Plan Status

| Plan | Spec(s) | Status | Dependencies |
|------|---------|--------|--------------|
| [00_foundation.md](./00_foundation.md) | 00, 01, 02 | Done | — |
| [01_core_bundle.md](./01_core_bundle.md) | 03 | Done | 00 |
| [02_resolution_runtime.md](./02_resolution_runtime.md) | 04 | Done | 01 |
| [03_personalization.md](./03_personalization.md) | 05 | Done | 01 |
| [04_ui_adapters.md](./04_ui_adapters.md) | 06 | Done | 01 |
| [05_ai_chat.md](./05_ai_chat.md) | 07 | Done | 01, 02 |
| [06_entity_surfaces.md](./06_entity_surfaces.md) | 08 | Done | 01, 02 |
| [07_extensions.md](./07_extensions.md) | 09 | Done | 01, 02 |
| [08_policy_safety.md](./08_policy_safety.md) | 10 | Done | 01 |
| [09_observability.md](./09_observability.md) | 11 | Done | 01 |
| [10_api_skeleton.md](./10_api_skeleton.md) | 12 | Done | 00 |
| [11_rollout.md](./11_rollout.md) | 13 | Done | 01–10 |
| [12_verification.md](./12_verification.md) | 14 | Done | 06 |

## Rollout Phase Mapping (from 13_rollout_plan.md)

| Phase | Focus | Implementation Plans |
|-------|-------|---------------------|
| 0 | Package scaffold | 00, 01, 10 |
| 1 | Resolver MVP | 02, 03 |
| 2 | React renderer MVP | 04 |
| 3 | PM issue workbench pilot | 06 |
| 4 | Assistant integration | 05 |
| 5 | Durable customization | 07 |
| 6 | Customization mode | 07 |
| 7 | Evaluation and hardening | 08, 09, 12 |

## Phase Gates

- **Phase 0 → 1:** Types compile, defineModuleBundle works, package-skeleton builds
- **Phase 1 → 2:** One route resolves to ResolvedSurfacePlan, fallbacks work
- **Phase 2 → 3:** BundleRenderer renders one workbench surface from plan
- **Phase 3 → 4:** PM issue detail page uses bundle-native surfaces
- **Phase 4 → 5:** Assistant can propose and user can accept/reject patches
- **Phase 5 → 6:** User/workspace overlays persist with audit trail
- **Phase 6 → 7:** DnD editing mode, widget palette functional
- **Phase 7:** Golden-context harness, evals, dashboards in place

## Pilot Route

`/operate/pm/issues/:issueId` (or equivalent PM issue workbench route in bundle.workspace or bundle.library)

## Deferred Items (later phases)

| Plan | Item | Phase |
|------|------|-------|
| 06 | Replace/wrap existing PM issue detail page with bundle-native surface | 3 |
| 06 | Wire saved view into resolution (layout selection when view active) | 3 |
| 06 | Multi-supertag merged render schema | v2 |
| 07 | Conflict resolution UI for overlay merge | 6 |
| 11 | Approval gate for workspace overlays (governance.requireApprovalForWorkspacePatches) | 5 |
