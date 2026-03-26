# @contractspec/example.learning-journey-platform-tour

Website: https://contractspec.io

**Learning journey track covering ContractSpec platform primitives.**

## What This Demonstrates

- Platform primitives tour with step-by-step guidance.
- Feature definition with operations, presentations, and test-specs.
- Demo handlers for simulated tour flow.
- Interactive exploration of ContractSpec concepts.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/learning-journey-platform-tour`:
- `bun run dev`
- `bun run build`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-journey-platform-tour` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-platform-tour.feature.ts` defines a feature entrypoint.
- `src/operations` is part of the package's public or composition surface.
- `src/presentations` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/platform-tour.docblock` resolves through `./src/docs/platform-tour.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers/demo.handlers` resolves through `./src/handlers/demo.handlers.ts`.
- Export `./learning-journey-platform-tour.feature` resolves through `./src/learning-journey-platform-tour.feature.ts`.
- Export `./operations` resolves through `./src/operations/index.ts`.
- Export `./presentations` resolves through `./src/presentations/index.ts`.
- Export `./tests/operations.test-spec` resolves through `./src/tests/operations.test-spec.ts`.
- Export `./track` resolves through `./src/track.ts`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
