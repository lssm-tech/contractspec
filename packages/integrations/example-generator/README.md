# @contractspec/integration.example-generator

Website: https://contractspec.io

**Example plugin: Markdown documentation generator for ContractSpec specs.**

## What It Provides

- **Layer**: integration.
- **Consumers**: plugin authors, documentation pipelines.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/integration.example-generator`

or

`bun add @contractspec/integration.example-generator`

## Usage

Import the root entrypoint from `@contractspec/integration.example-generator`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/config.ts` is part of the package's public or composition surface.
- `src/generator.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./config` resolves through `./src/config.ts`.
- Export `./generator` resolves through `./src/generator.ts`.
- Export `./types` resolves through `./src/types.ts`.

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
- `bun run test:watch` — bun test --watch
- `bun run test:coverage` — bun test --coverage
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Do not add business logic; this is a reference plugin.
- Keep the export surface minimal -- new exports need a clear use-case.
- Peer-depends on `contracts-spec` and `schema`; do not bundle them.
