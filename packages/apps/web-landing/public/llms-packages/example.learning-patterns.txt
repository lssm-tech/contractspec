# @contractspec/example.learning-patterns

Website: https://contractspec.io

**Example: drills + ambient coach + quests learning patterns, powered by Learning Journey (event-driven, deterministic).**

## What This Demonstrates

- Three distinct learning track patterns: drills, ambient-coach, quests.
- Event-driven track progression.
- Deterministic state transitions via the Learning Journey module.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/learning-patterns`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-patterns` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-patterns.feature.ts` defines a feature entrypoint.
- `src/learning-patterns.test.ts` is part of the package's public or composition surface.
- `src/tracks` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-patterns.docblock` resolves through `./src/docs/learning-patterns.docblock.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./learning-patterns.feature` resolves through `./src/learning-patterns.feature.ts`.
- Export `./tracks` resolves through `./src/tracks/index.ts`.
- Export `./tracks/ambient-coach` resolves through `./src/tracks/ambient-coach.ts`.
- Export `./tracks/drills` resolves through `./src/tracks/drills.ts`.
- Export `./tracks/quests` resolves through `./src/tracks/quests.ts`.

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

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
