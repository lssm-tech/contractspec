# AI Agent Guide — `@contractspec/lib.graphql-core`

Scope: `packages/libs/graphql-core/*`

Shared GraphQL core: Pothos builder factory, scalars, tracing & complexity.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Builder factory is consumed by all GraphQL packages — interface changes have high blast radius.
- Scalar definitions must stay aligned with the schema lib.
- Tracing and complexity plugins must not introduce runtime overhead in production without opt-in.
- Changes here can affect downstream packages such as `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run prebuild` — contractspec-bun-build prebuild
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
