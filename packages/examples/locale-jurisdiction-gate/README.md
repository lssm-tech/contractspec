# @contractspec/example.locale-jurisdiction-gate

Website: https://contractspec.io

**Example: enforce locale + jurisdiction + kbSnapshotId + allowed scope for assistant calls (fail-closed).**

## What This Demonstrates

- Fail-closed policy guard pattern for AI assistant calls.
- Entity models for locale/jurisdiction gating.
- Event-driven policy enforcement.
- Handler and operation separation with typed operations.
- Feature definition pattern.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/locale-jurisdiction-gate`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.locale-jurisdiction-gate` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/locale-jurisdiction-gate.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/locale-jurisdiction-gate.docblock` resolves through `./src/docs/locale-jurisdiction-gate.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./entities/models` resolves through `./src/entities/models.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./handlers/demo.handlers` resolves through `./src/handlers/demo.handlers.ts`.
- Export `./locale-jurisdiction-gate.feature` resolves through `./src/locale-jurisdiction-gate.feature.ts`.
- The package publishes 15 total export subpaths; keep docs aligned with `package.json`.

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
