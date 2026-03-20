# @contractspec/lib.lifecycle

Website: https://contractspec.io

**Contract lifecycle management primitives.**

## What It Provides

- **Layer**: lib.
- **Consumers**: analytics, evolution, observability, bundles.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.lifecycle`

or

`bun add @contractspec/lib.lifecycle`

## Usage

Import the root entrypoint from `@contractspec/lib.lifecycle`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types` is part of the package's public or composition surface.
- `src/utils/` contains internal utility functions.

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
- Fix small issues.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- Lifecycle stage definitions are shared across the platform — changes are high-impact.
- Stage transitions must be deterministic; no side effects in transition logic.
- Consumed by analytics and observability — schema changes affect downstream telemetry.
