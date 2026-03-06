# AI Agent Guide — `@contractspec/lib.schema`

Scope: `packages/libs/schema/*`

Schema primitives used across ContractSpec (Zod validation, GraphQL types, JSON Schema). Changes here have a very high blast radius.

## Quick Context

- **Layer**: lib
- **Consumers**: nearly all libs, bundles, and apps

## Public Exports

Keep these maps in sync when adding/moving exports:

- `package.json#exports` → `src/*`
- `package.json#publishConfig.exports` → `dist/*`

## Guardrails

- Preserve multi-surface consistency: Zod, GraphQL, and JSON Schema representations must stay aligned.
- Prefer additive changes; avoid silently weakening validation or changing scalar semantics.
- Do not edit `dist/`; source of truth is `src/`.

## Local Commands

- Build: `bun run build`
- Dev/watch: `bun run dev`
- Lint: `bun run lint:check` (or `bun run lint:fix`)
