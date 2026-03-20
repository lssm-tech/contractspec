# @contractspec/module.product-intent-core

Website: https://contractspec.io

**Core product intent orchestration and adapters.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (contractspec-studio), apps (web-landing).
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/module.product-intent-core`

or

`bun add @contractspec/module.product-intent-core`

## Usage

Import the root entrypoint from `@contractspec/module.product-intent-core`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/evidence/` contains evidence ingestion and normalization helpers.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/orchestrator` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

- Depends on `lib.product-intent-utils` for shared utilities -- keep orchestration logic here, primitives in the lib.
- Intent resolution must be idempotent; re-processing the same input should yield the same spec output.
- Adapter interfaces are the extension point; new integrations go through the adapter pattern.
