# @contractspec/module.lifecycle-core

Website: https://contractspec.io

**Core lifecycle stage definitions and transitions.**

## What It Provides

- **Layer**: module.
- **Consumers**: modules (lifecycle-advisor), bundles (library, contractspec-studio), apps (web-landing, cli).
- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.

## Installation

`npm install @contractspec/module.lifecycle-core`

or

`bun add @contractspec/module.lifecycle-core`

## Usage

Import the root entrypoint from `@contractspec/module.lifecycle-core`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/collectors` is part of the package's public or composition surface.
- `src/data/` contains static content, registries, and package-local datasets.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/orchestrator` is part of the package's public or composition surface.
- `src/planning` is part of the package's public or composition surface.

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
- Resolve lint/test regressions after voice capability updates.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- Depends on `lib.lifecycle` for foundational types -- this module adds orchestration on top.
- Stage transition rules are the source of truth; changes here cascade to lifecycle-advisor and all consuming bundles.
- Stage data in `src/data/` must remain backward-compatible to avoid breaking persisted project states.
