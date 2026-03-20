# @contractspec/lib.testing

Website: https://contractspec.io

**Contract-aware testing utilities and runners.**

## What It Provides

- **Layer**: lib.
- **Consumers**: CLI, bundles.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.

## Installation

`npm install @contractspec/lib.testing`

or

`bun add @contractspec/lib.testing`

## Usage

Import the root entrypoint from `@contractspec/lib.testing`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/generator` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/recorder` is part of the package's public or composition surface.
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

- TrafficRecorder and GoldenTestGenerator interfaces are public API — do not break signatures.
- Test output format must stay compatible with Vitest and Jest runners.
