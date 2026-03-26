# @contractspec/module.provider-ranking

Website: https://contractspec.io

**Provider-ranking module that adds persistence adapters and pipeline orchestration on top of lower-level ranking logic.**

## What It Provides

- Coordinates ingest, storage, scoring, and ranking refresh flows over provider benchmark data.
- Exposes entities, pipelines, and storage interfaces for ranking-aware applications.
- Sits between ranking libraries and deployable MCP or application shells.
- `src/pipeline/` contains pipeline stages and orchestration helpers.

## Installation

`npm install @contractspec/module.provider-ranking`

or

`bun add @contractspec/module.provider-ranking`

## Usage

Import the root entrypoint from `@contractspec/module.provider-ranking`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/entities/` defines ranking-related domain shapes.
- `src/pipeline/` contains ingestion and ranking orchestration stages.
- `src/storage/` contains persistence-facing interfaces and implementations.
- `src/index.ts` exposes the composed module surface.

## Public Entry Points

- Exports entities, pipeline helpers, named pipeline entrypoints, and storage surfaces.
- Export `.` resolves through `./src/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./pipeline` resolves through `./src/pipeline/index.ts`.
- Export `./pipeline/ingestion-pipeline` resolves through `./src/pipeline/ingestion-pipeline.ts`.
- Export `./pipeline/ranking-pipeline` resolves through `./src/pipeline/ranking-pipeline.ts`.
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
- Add Composio universal fallback, fix provider-ranking types, and expand package exports.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- Depends on `lib.provider-ranking` for scoring logic and ingesters -- this module adds persistence and orchestration.
- Pipeline stages must be idempotent; re-ingesting the same benchmark data should not create duplicates.
- Storage adapters are swappable -- always code against the interface, not the implementation.
