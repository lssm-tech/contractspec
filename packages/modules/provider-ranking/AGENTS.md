# AI Agent Guide — `@contractspec/module.provider-ranking`

Scope: `packages/modules/provider-ranking/*`

Provider-ranking module that adds persistence adapters and pipeline orchestration on top of lower-level ranking logic.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.provider-ranking`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/entities/` defines ranking-related domain shapes.
- `src/pipeline/` contains ingestion and ranking orchestration stages.
- `src/storage/` contains persistence-facing interfaces and implementations.
- `src/index.ts` exposes the composed module surface.

## Public Surface

- Exports entities, pipeline helpers, named pipeline entrypoints, and storage surfaces.
- Export `.` resolves through `./src/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./pipeline` resolves through `./src/pipeline/index.ts`.
- Export `./pipeline/ingestion-pipeline` resolves through `./src/pipeline/ingestion-pipeline.ts`.
- Export `./pipeline/ranking-pipeline` resolves through `./src/pipeline/ranking-pipeline.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

## Guardrails

- Keep scoring logic in lower-level libraries and use the module for orchestration and storage composition.
- Pipeline stages should remain idempotent and safe to rerun on repeated benchmark data.
- Storage interfaces are extension points for apps and MCP servers; avoid coupling them to one backend.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.provider-ranking`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
