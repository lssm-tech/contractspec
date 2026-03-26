# @contractspec/module.context-storage

Website: https://contractspec.io

**Context storage module with persistence adapters.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (library), apps (registry-server).
- `src/pipeline/` contains pipeline stages and orchestration helpers.
- Related ContractSpec packages include `@contractspec/lib.context-storage`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.knowledge`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/pipeline/` contains pipeline stages and orchestration helpers.

## Installation

`npm install @contractspec/module.context-storage`

or

`bun add @contractspec/module.context-storage`

## Usage

Import the root entrypoint from `@contractspec/module.context-storage`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/entities/` contains domain entities and value objects.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/pipeline/` contains pipeline stages and orchestration helpers.
- `src/storage/` contains persistence adapters and storage implementations.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./pipeline/context-snapshot-pipeline` resolves through `./src/pipeline/context-snapshot-pipeline.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint, build, and type errors across nine packages.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- Depends on `lib.context-storage`, `lib.knowledge`, `lib.contracts-integrations`.
- Pipeline stages must be idempotent; re-running a snapshot should not duplicate data.
- Storage adapters are swappable -- always code against the interface, not the implementation.
