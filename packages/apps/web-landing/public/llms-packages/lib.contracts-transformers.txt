# @contractspec/lib.contracts-transformers

Website: https://contractspec.io

**Contract format transformations: import/export between ContractSpec and external formats (OpenAPI, AsyncAPI, etc.).**

## What It Provides

- **Layer**: lib.
- **Consumers**: `lib.contracts-spec`, bundles, CLI.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.contracts-transformers`

or

`bun add @contractspec/lib.contracts-transformers`

## Usage

Import the root entrypoint from `@contractspec/lib.contracts-transformers`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/common` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/openapi` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./common` resolves through `./src/common/index.ts`.
- Export `./openapi` resolves through `./src/openapi/index.ts`.

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

## Notes

- Core logic must be pure functions with no I/O.
- Preserve original transport metadata (path/query/header params) for accurate round-trips.
- Track provenance — where specs came from — for sync operations.
- `@contractspec/lib.contracts-spec` re-exports this library for existing consumers; avoid breaking that contract.
