# AI Agent Guide — `@contractspec/lib.utils-typescript`

Scope: `packages/libs/utils-typescript/*`

TypeScript utility types and helpers shared across the monorepo.

## Quick Context

- **Layer**: lib
- **Consumers**: many libs and bundles (wide blast radius)

## Public Exports

- `.` — main entry
- `./lib/*` — individual utility modules (many utilities)

## Guardrails

- Utility types are used across the entire monorepo — changes can break many packages
- Must stay zero-dependency (no runtime deps)
- Test any signature change against downstream consumers before merging

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
