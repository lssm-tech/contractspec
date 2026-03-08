# Implementation Plan: Foundation (Decisions, Problem, Package Strategy)

- **Specs:** 00_decision_record.md, 01_problem_statement_and_design_principles.md, 02_package_strategy.md
- **Status:** Complete
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Establishes the architectural foundation: lib/module/bundle naming, package boundaries, and design principles before any implementation.

## Objectives

1. Lock in Decision 0: lib.surface-runtime (infrastructure) + optional module.surface-assistant + domain bundles.
2. Document package strategy with correct dependencies and interoperability.
3. Ensure all spec documents use consistent package names and paths.
4. Create package directory structure at `packages/libs/surface-runtime`.

## Non-goals (v1)

- Implementing resolver or renderer.
- Creating module.surface-assistant (defer to Phase 4).
- Migrating existing bundle.workspace to surface runtime.

## Codebase alignment

- Follow [packages/AGENTS.md](../../packages/AGENTS.md) hierarchy: libs → modules → bundles.
- Reference [references/codebase_mapping.md](../references/codebase_mapping.md) for package paths.

## Workstreams

### WS1 — Decision record and naming

- [x] Confirm lib.surface-runtime as primary package name.
- [x] Confirm packages/libs/surface-runtime as repo path.
- [x] Update all spec files to use surface-runtime (not modules-bundle).
- [x] Add terminology glossary (bundle spec vs bundle architectural).

### WS2 — Package strategy

- [x] Document hard dependencies: contracts-spec, overlay-engine, observability, ai-agent, ai-providers.
- [x] Document interoperability: contracts-runtime-client-react, presentation-runtime-react.
- [x] Document peer dependencies for React and UI libs.
- [x] Define exports map in package.json.

### WS3 — Package scaffold

- [x] Create packages/libs/surface-runtime directory.
- [x] Add package.json with correct name and dependencies.
- [x] Add tsconfig.json.
- [x] Add minimal src/ structure (spec/, runtime/, react/ stubs).

## Dependencies

None (foundation plan).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Naming confusion persists | Add glossary to README; use "surface spec" in prose. |
| Wrong layer placement | Re-read AGENTS.md; lib = infrastructure only. |
