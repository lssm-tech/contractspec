# @contractspec/lib.context-storage

Website: https://contractspec.io

**Context pack and snapshot storage primitives.**

## What It Provides

- **Layer**: lib.
- **Consumers**: module.context-storage.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.context-storage`

or

`bun add @contractspec/lib.context-storage`

## Usage

Import the root entrypoint from `@contractspec/lib.context-storage`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/in-memory-store.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/store.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./in-memory-store` resolves through `./src/in-memory-store.ts`.
- Export `./store` resolves through `./src/store.ts`.
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
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- `Store` interface is the contract boundary for persistence adapters; do not change its shape without updating all adapters.
