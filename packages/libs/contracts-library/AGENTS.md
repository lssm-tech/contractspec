# AI Agent Guide — `@contractspec/lib.contracts-library`

Scope: `packages/libs/contracts-library/*`

Contract definitions for library templates and local runtime.

## Quick Context

- **Layer**: lib
- **Consumers**: `bundle.library`

## Public Exports

- `./templates` — Template contracts
- `./templates/recipes` — Recipe specs
- `./templates/todos` — Todo specs

## Guardrails

- Template contracts define the shape consumed by bundle.library — breaking changes cascade to all template renderers.
- Keep contract schemas additive; avoid removing or renaming fields without a migration path.

## Local Commands

- Build: `bun run build`
- Types: `bun run build:types`
- Lint: `bun run lint`
