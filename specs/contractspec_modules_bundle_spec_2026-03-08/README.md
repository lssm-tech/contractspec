# ContractSpec Surface Runtime Spec Pack

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime` (+ optional `module.surface-assistant` + domain bundles)
- **Repo Path:** `packages/libs/surface-runtime`


## What this pack is

This spec pack proposes a new web-first ContractSpec library that composes existing ContractSpec primitives into an AI-native, ultra-personalisable, extensible application surface system.

Recommended package name: `@contractspec/lib.surface-runtime`  
Recommended repo directory: `packages/libs/surface-runtime`

**Terminology:** A **bundle spec** (ModuleBundleSpec) is a contract type defining a surface (routes, slots, layouts). A **bundle** (architectural) is a domain package in `packages/bundles/` (e.g. bundle.workspace). Avoid overloading "bundle" in prose.

The package is meant to sit above existing ContractSpec primitives such as:

- `lib.contracts-spec` for operations, capabilities, policies, and presentations
- `lib.overlay-engine` for typed and auditable overrides
- `lib.ui-kit` for shared primitives where practical
- `lib.ai-agent` for agent orchestration, session, tools, and provider bridges
- `lib.observability` for tracing, metrics, anomalies, intent detection, and lifecycle instrumentation

## Core recommendation

Do **not** solve this by stuffing more behavior into `lib.ui-kit`.

That would mix:
- primitive components,
- dynamic surface composition,
- personalization policy,
- AI planning,
- runtime layout persistence,
- extension/plugin registration, and
- domain-specific entity rendering

into one package.

That is how libraries become cursed.

Instead, create a dedicated orchestration package that defines **bundle specs** for routes, surfaces, panels, slots, contextual actions, AI planners, layout persistence, and extension points.

## Why this package exists

ContractSpec already has the ingredients for spec-first systems. What is missing is a stable, typed way to define and resolve:

1. what surface to show,
2. which data to load,
3. how the surface adapts to the user,
4. which slots can be modified by AI,
5. how user/workspace customizations persist safely, and
6. how complex entities with custom fields render without bespoke page code everywhere.

This package fills that gap.

## What “bundle” means

A **bundle spec** (ModuleBundleSpec) is a task-domain surface contract. It composes:

- routes
- data recipes
- surfaces
- layouts
- entity renderers
- actions
- command palette entries
- chat/assistant orchestration
- personalization rules
- extension points
- policy and audit requirements

A bundle resolves into a concrete **surface plan** for a specific user, device, route, context, entity, and conversation state.

## Strong opinion

The AI should **not** generate arbitrary JSX and bypass the spec layer.

The AI may:
- select between declared layouts,
- propose `SurfacePatch` objects,
- suggest actions,
- request additional context,
- compose supported block schemas,
- configure allowed slots,
- and explain why a surface changed.

The AI may **not**:
- invent undeclared components,
- bypass capabilities or PDP checks,
- mutate raw DOM state,
- or persist unvalidated customizations.

## File map

- `00_decision_record.md`  
  High-confidence decisions and anti-goals.
- `01_problem_statement_and_design_principles.md`  
  What this package must solve and the principles it should obey.
- `02_package_strategy.md`  
  Package naming, repo placement, exports, dependency graph, and adapter strategy.
- `03_core_bundle_spec.md`  
  Canonical TypeScript shape for `ModuleBundleSpec`.
- `04_surface_resolution_and_runtime.md`  
  The runtime pipeline that resolves a bundle into a renderable plan.
- `05_personalization_model.md`  
  Integration with the 7 preference dimensions and saved layouts/views.
- `06_ui_composition_and_adapters.md`  
  How to integrate BlockNote, dnd-kit, Floating UI, Motion, and resizable panels.
- `07_ai_native_chat_and_generative_ui.md`  
  How Vercel AI SDK should drive chat, tools, and schema-bounded UI patches.
- `08_entity_surface_and_custom_fields.md`  
  Generic entity rendering, deep PM issue customization, and field registries.
- `09_extension_and_override_model.md`  
  Widgets, plugins, overlays, trust tiers, and persistence.
- `10_policy_audit_and_safety.md`  
  PDP integration, redaction, approvals, rollback, and AI guardrails.
- `11_observability_evals_and_metrics.md`  
  Telemetry, evaluation harnesses, and success metrics.
- `12_typescript_api_and_package_skeleton.md`  
  Example API and notes on the included package skeleton.
- `13_rollout_plan.md`  
  Phased implementation with acceptance criteria.
- `14_verification_matrix.md`  
  A hard requirement that every surface accounts for all 7 preference dimensions.
- `15_design_inspirations.md`  
  Distilled product patterns from Notion, Airtable, Linear, and Retool.
- `references/current_specs/*`  
  Copies of the current specs you provided.
- `references/external_sources.md`  
  Source list used to ground the proposal.
- `examples/*`  
  Example bundle, patch, layout blueprint, and field registry files.
- `package-skeleton/*`  
  Starter files for a real package implementation.

## Recommended pilot

Pilot this package on **PM issue workbench** surfaces first.

That domain already needs:
- dense entity rendering,
- saved views,
- field registries,
- multi-supertag resolution,
- relation-heavy navigation,
- assistant help,
- and per-user/workspace customization.

It is the right place to prove whether the bundle abstraction is real or just architecture theater.

## Non-negotiables

- Web-first package.
- AI outputs objects, not JSX.
- Persistent customizations are auditable.
- Preference dimensions are first-class, not “nice to have”.
- Schema-driven field rendering is mandatory.
- Keyboard, accessibility, undo, and performance are not afterthoughts.
- Every bundle must remain ejectable and readable, consistent with ContractSpec’s “compiler, not prison” philosophy.

## Fast start

1. Read `00_decision_record.md`.
2. Read `03_core_bundle_spec.md`.
3. Read `04_surface_resolution_and_runtime.md`.
4. Read `06_ui_composition_and_adapters.md`.
5. Open `examples/pm-workbench.bundle.ts`.
6. Use `package-skeleton/` as the first implementation scaffold.
