# @contractspec/lib.presentation-runtime-core

Website: https://contractspec.io

**Core presentation runtime for contract-driven UIs.**

## What It Provides

- **Layer**: lib.
- **Consumers**: presentation-runtime-react, presentation-runtime-react-native.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.presentation-runtime-core`

or

`bun add @contractspec/lib.presentation-runtime-core`

## Usage

Import the root entrypoint from `@contractspec/lib.presentation-runtime-core`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/metro.cjs` is part of the package's public or composition surface.
- `src/next.mjs` is part of the package's public or composition surface.
- `src/table.ts` is part of the package's public or composition surface.
- `src/visualization.echarts.ts` is part of the package's public or composition surface.
- `src/visualization.model.builders.ts` is part of the package's public or composition surface.
- `src/visualization.model.helpers.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./table` resolves through `./src/table.ts`.
- Export `./visualization` resolves through `./src/visualization.ts`.
- Export `./visualization.echarts` resolves through `./src/visualization.echarts.ts`.
- Export `./visualization.model` resolves through `./src/visualization.model.ts`.
- Export `./visualization.model.builders` resolves through `./src/visualization.model.builders.ts`.
- Export `./visualization.model.helpers` resolves through `./src/visualization.model.helpers.ts`.
- Export `./visualization.types` resolves through `./src/visualization.types.ts`.
- Export `./visualization.utils` resolves through `./src/visualization.utils.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit -p tsconfig.json
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add data visualization capabilities.
- Add table capabilities.

## Notes

- Core runtime interface is consumed by all presentation runtimes — changes here affect both web and mobile.
- Must remain platform-agnostic; no React or React Native imports allowed.
- API surface changes require coordinated updates in both downstream runtimes.
