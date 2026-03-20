# @contractspec/module.examples

Website: https://contractspec.io

**Example contract specifications collection.**

## What It Provides

- **Layer**: module.
- **Consumers**: apps (web-landing, docs), bundles (contractspec-studio).
- Related ContractSpec packages include `@contractspec/example.agent-console`, `@contractspec/example.ai-chat-assistant`, `@contractspec/example.ai-support-bot`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.calendar-google`, `@contractspec/example.content-generation`, ...

## Installation

`npm install @contractspec/module.examples`

or

`bun add @contractspec/module.examples`

## Usage

Import the root entrypoint from `@contractspec/module.examples`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/builtins.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/registry.test.ts` is part of the package's public or composition surface.
- `src/registry.ts` is part of the package's public or composition surface.
- `src/runtime` is part of the package's public or composition surface.

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
- `bun run generate:registry` — bun ../../../scripts/generate-example-registry.ts --write
- `bun run prebuild` — bun run generate:registry && contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add table capabilities.
- Stability.
- Vnext ai-native.

## Notes

- This module is a thin aggregator -- business logic belongs in individual example packages under `packages/examples/`.
- Adding a new example requires both creating the example package and wiring it as a dependency here.
- Depends on ~30 example workspace packages; keep the dependency list in sync with `packages/examples/`.
