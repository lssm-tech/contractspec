# @contractspec/lib.cost-tracking

Website: https://contractspec.io

**API cost tracking and budgeting.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.cost-tracking`

or

`bun add @contractspec/lib.cost-tracking`

## Usage

Import the root entrypoint from `@contractspec/lib.cost-tracking`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/budget-alert-manager.ts` is part of the package's public or composition surface.
- `src/cost-model.ts` is part of the package's public or composition surface.
- `src/cost-tracker.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/optimization-recommender.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

## Notes

- Cost calculation logic must stay deterministic — no side effects or external calls during computation.
- Budget threshold types are shared across consumers; changes require coordination.
- Do not introduce floating-point arithmetic where precision matters; use integer cents or a decimal library.
