# AI Agent Guide — `@contractspec/lib.jobs`

Scope: `packages/libs/jobs/*`

Background jobs and scheduler module for ContractSpec applications.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.logger`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ...

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/jobs.capability.ts` defines a capability surface.
- `src/jobs.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./handlers/gmail-sync-handler` resolves through `./src/handlers/gmail-sync-handler.ts`.
- Export `./handlers/ping-job` resolves through `./src/handlers/ping-job.ts`.
- Export `./handlers/storage-document-handler` resolves through `./src/handlers/storage-document-handler.ts`.
- Export `./jobs.capability` resolves through `./src/jobs.capability.ts`.
- Export `./jobs.feature` resolves through `./src/jobs.feature.ts`.
- The package publishes 18 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Queue and scheduler interfaces are adapter boundaries — do not leak implementation details.
- Job entity schema is shared across consumers; changes require migration awareness.
- Capability contract (`jobs.capability`) is public API — treat as a breaking-change surface.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.logger`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ....

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
