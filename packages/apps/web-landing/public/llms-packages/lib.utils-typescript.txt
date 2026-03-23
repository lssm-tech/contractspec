# @contractspec/lib.utils-typescript

Website: https://contractspec.io

**TypeScript utility types and helpers.**

## What It Provides

- **Layer**: lib.
- **Consumers**: many libs and bundles (wide blast radius).
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.utils-typescript`

or

`bun add @contractspec/lib.utils-typescript`

## Usage

Import the root entrypoint from `@contractspec/lib.utils-typescript`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/lib/` contains package-local helper utilities and adapters.
- `src/staticShouldNotHappen.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./lib/AwaitedResult` resolves through `./src/lib/AwaitedResult.ts`.
- Export `./lib/BrowserNativeObject` resolves through `./src/lib/BrowserNativeObject.ts`.
- Export `./lib/DeepInfiniteArray` resolves through `./src/lib/DeepInfiniteArray.ts`.
- Export `./lib/DeepKeepOnly` resolves through `./src/lib/DeepKeepOnly.ts`.
- Export `./lib/DeepKey` resolves through `./src/lib/DeepKey.ts`.
- Export `./lib/DeepMap` resolves through `./src/lib/DeepMap.ts`.
- Export `./lib/DeepNullable` resolves through `./src/lib/DeepNullable.ts`.
- Export `./lib/DeepOr` resolves through `./src/lib/DeepOr.ts`.
- Export `./lib/DeepPartial` resolves through `./src/lib/DeepPartial.ts`.
- The package publishes 31 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Utility types are used across the entire monorepo — changes can break many packages.
- Must stay zero-dependency (no runtime deps).
- Test any signature change against downstream consumers before merging.
