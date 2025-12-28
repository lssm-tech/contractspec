# AI Agent Guide — `@contractspec/lib.schema`

Scope: `packages/libs/schema/*`

This library defines schema primitives used across ContractSpec (Zod validation, GraphQL types, JSON Schema). Changes here have a very high blast radius.

## Guardrails

- Preserve multi-surface consistency: Zod, GraphQL, and JSON Schema representations must stay aligned.
- Prefer additive changes; avoid silently weakening validation or changing scalar semantics.
- Do not edit `dist/`; source of truth is `src/`.

## Public entrypoints (package.json)

Keep these maps in sync when adding/moving exports:

- `packages/libs/schema/package.json#exports` → `src/*`
- `packages/libs/schema/package.json#publishConfig.exports` → `dist/*`

## Local commands

- Lint: `bun run lint:check` (or `bun run lint:fix`)
- Build: `bun run build`
- Dev/watch: `bun run dev`
