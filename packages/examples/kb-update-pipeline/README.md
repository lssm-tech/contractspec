# @contractspec/example.kb-update-pipeline

Website: https://contractspec.io

**Example: KB update automation pipeline with HITL review and auditability.**

## What This Demonstrates

- HITL (human-in-the-loop) review pipeline pattern.
- Entity models for KB articles and update proposals.
- Event-driven pipeline with typed operations.
- Feature definition with presentations and test-specs.
- In-memory handlers for demo scenarios.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/kb-update-pipeline`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.kb-update-pipeline` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/kb-update-pipeline.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/kb-update-pipeline.docblock` resolves through `./src/docs/kb-update-pipeline.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./entities/models` resolves through `./src/entities/models.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./handlers/memory.handlers` resolves through `./src/handlers/memory.handlers.ts`.
- Export `./kb-update-pipeline.feature` resolves through `./src/kb-update-pipeline.feature.ts`.
- The package publishes 14 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
