# Decision Record

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime` (infrastructure) + optional `@contractspec/module.surface-assistant` (AI planner) + domain bundles
- **Repo Path:** `packages/libs/surface-runtime` (and `packages/modules/surface-assistant` if adopted)


## Summary

This package should be a **web-first orchestration layer** for AI-native surfaces in ContractSpec.

The target outcome is not just “generated pages”. It is a deterministic and auditable system that can resolve the right interface for the right user and moment, while still allowing AI-driven adaptation inside narrow, typed boundaries.

## Decision 1: Create a new package instead of inflating `lib.ui-kit`

**Decision:** Build `@contractspec/lib.surface-runtime` as a distinct package.

**Why:**
- `lib.ui-kit` is a primitive/component library, not a runtime surface resolver.
- The proposed behavior includes layout composition, route-aware planning, dynamic slot resolution, persistence, policy gates, and AI-driven UI adaptation.
- Mixing all of that into a primitive component package would destroy the package boundary.

**Consequence:** `lib.ui-kit` stays small, reusable, and portable. The new surface runtime package imports UI kit primitives where useful, but owns orchestration.

## Decision 0: Respect lib / module / bundle architectural hierarchy

**Decision:** Package naming and placement must follow ContractSpec's layered architecture (libs → modules → bundles).

**Why:**
- `lib.modules-bundle` conflates three distinct layers: lib (infrastructure), module (feature), and bundle (domain).
- Libs are pure infrastructure with no business logic. Modules are self-contained features. Bundles are domain-specific business logic.
- The spec's "ModuleBundleSpec" is a **contract type** (surface definition), not an architectural layer.

**Consequence:** Decompose into:
- **lib.surface-runtime** — Pure infrastructure: types, resolver, runtime, adapters. Lives in `packages/libs/surface-runtime`.
- **module.surface-assistant** (optional) — AI planner integration: prompt compiler, patch validator, approval flow. Lives in `packages/modules/surface-assistant`. Consumes lib.surface-runtime + lib.ai-agent.
- **Domain bundles** — PM workbench, schedule workbench, etc. Define their own bundle specs and consume the lib. Example: extend `bundle.workspace` or create `bundle.pm`.

## Decision 2: Web-first, not universal

**Decision:** Treat this bundle as **web-first**.

**Why:**
- BlockNote, Floating UI, Motion, and `react-resizable-panels` are web-oriented React tools.
- dnd-kit is also React/web oriented, even if some ecosystem surfaces are evolving.
- ContractSpec already has a universal `lib.ui-kit`, but these libraries are not the correct foundation for a universal native+web package.

**Consequence:** Any shared abstractions should stay framework-agnostic at the spec level, but the first runtime and renderer must explicitly target React on the web.

## Decision 3: AI generates `SurfacePatch`, not JSX

**Decision:** The model may propose **schema-bounded patch objects** only.

**Why:**
- Arbitrary JSX generation destroys deterministic validation.
- JSX is too unconstrained for policy evaluation, audit, and rollback.
- Patch objects can be validated, diffed, logged, simulated, approved, rejected, and replayed.

**Consequence:** The runtime needs a validator for patch operations and a renderer for approved plan nodes.

## Decision 4: Personalization is not a bag of feature flags

**Decision:** Use the provided 7-dimension preference model as the canonical personalization grammar.

**Why:**
- The model is already orthogonal and well-defined.
- It gives the system a small number of stable axes instead of endless boolean toggles.
- It maps directly to concrete surface behavior.

**Consequence:** Every in-scope surface must declare how it responds to all 7 dimensions.

## Decision 5: Persistent customizations must be auditable

**Decision:** Store durable customizations as overlay-compatible patches or signed overlay records.

**Why:**
- ContractSpec already has an overlay engine.
- Overlay-like persistence creates a stable audit trail and supports rollback.
- Workspace, team, and user overrides can share a single mechanism.

**Consequence:** The surface runtime should emit plans, then apply overlays, then apply ephemeral AI suggestions, in that order.

## Decision 6: Entity surfaces must be schema-driven

**Decision:** Complex entities like PM issues must render through a field/section/view registry, not bespoke pages.

**Why:**
- Your PM specs already point toward relation-rich, customizable entities.
- The number of field kinds, sections, automations, views, and cross-domain links will keep growing.
- Hardcoding page layouts for every entity type does not scale.

**Consequence:** The surface runtime package needs first-class entity surface contracts and renderer registries.

## Decision 7: Use adapter boundaries around volatile third-party UI libs

**Decision:** Wrap each selected UI library behind a local adapter contract.

**Why:**
- Libraries evolve.
- dnd-kit in particular appears to have both older `core/sortable` patterns and newer `react` package surfaces in the wild.
- Motion import paths also changed over time.
- Adapter boundaries protect the rest of ContractSpec from package churn.

**Consequence:** No internal runtime code outside adapter folders should import these libraries directly.

## Anti-goals

This package should **not**:

- become a new page builder product
- compile arbitrary DOM trees from untrusted prompts
- replace `lib.contracts-spec`
- replace `lib.overlay-engine`
- replace `lib.ui-kit`
- hide policy logic behind magic AI behavior
- force a proprietary runtime
- make universal mobile/web parity a day-one goal

## Architecture stance

This package is not a visual builder and not a chat shell.

It is a **surface orchestration compiler/runtime** that lets ContractSpec describe, resolve, and evolve application experiences with the same rigor it already brings to operations and other surfaces.
