# AI Agent Guide -- `@contractspec/module.examples`

Scope: `packages/modules/examples/*`

Aggregator module that re-exports all example contract specification packages as a single collection for demos and documentation.

## Quick Context

- **Layer**: module
- **Consumers**: apps (web-landing, docs), bundles (contractspec-studio)

## Public Exports

- `.` -- root barrel (re-exports all example packages)

## Guardrails

- This module is a thin aggregator -- business logic belongs in individual example packages under `packages/examples/`
- Adding a new example requires both creating the example package and wiring it as a dependency here
- Depends on ~30 example workspace packages; keep the dependency list in sync with `packages/examples/`

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
