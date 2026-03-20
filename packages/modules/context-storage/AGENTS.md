# AI Agent Guide — `@contractspec/module.context-storage`

Scope: `packages/modules/context-storage/*`

Context storage module with persistence adapters.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.context-storage`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.knowledge`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/entities/` contains domain entities and value objects.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/pipeline/` contains pipeline stages and orchestration helpers.
- `src/storage/` contains persistence adapters and storage implementations.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./pipeline/context-snapshot-pipeline` resolves through `./src/pipeline/context-snapshot-pipeline.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

## Guardrails

- Depends on `lib.context-storage`, `lib.knowledge`, `lib.contracts-integrations`.
- Pipeline stages must be idempotent; re-running a snapshot should not duplicate data.
- Storage adapters are swappable -- always code against the interface, not the implementation.
- Changes here can affect downstream packages such as `@contractspec/lib.context-storage`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.knowledge`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
