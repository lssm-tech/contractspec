# @contractspec/example.calendar-google

Website: https://contractspec.io

**Google Calendar integration example: list and create events.**

## What This Demonstrates

- OAuth-based Google Calendar API wiring.
- Event listing and creation flows.
- Sync logic for calendar data.
- Integration provider pattern with ContractSpec contracts.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/calendar-google`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.calendar-google` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/calendar-google.feature.ts` defines a feature entrypoint.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/run.ts` is part of the package's public or composition surface.
- `src/sync.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./calendar-google.feature` resolves through `./src/calendar-google.feature.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/calendar-google.docblock` resolves through `./src/docs/calendar-google.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./run` resolves through `./src/run.ts`.
- Export `./sync` resolves through `./src/sync.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
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

- Works alongside `@contractspec/integration.providers-impls`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
