# AI Agent Guide — `@contractspec/lib.contracts-library`

Scope: `packages/libs/contracts-library/*`

Contract definitions for library templates and local runtime.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/templates` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./templates` resolves through `./src/templates/index.ts`.
- Export `./templates/messaging` resolves through `./src/templates/messaging.ts`.
- Export `./templates/recipes` resolves through `./src/templates/recipes.ts`.
- Export `./templates/todos` resolves through `./src/templates/todos.ts`.

## Guardrails

- Template contracts define the shape consumed by bundle.library — breaking changes cascade to all template renderers.
- Keep contract schemas additive; avoid removing or renaming fields without a migration path.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
