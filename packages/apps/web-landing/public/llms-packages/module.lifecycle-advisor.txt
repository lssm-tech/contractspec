# @contractspec/module.lifecycle-advisor

Website: https://contractspec.io

**AI-powered lifecycle recommendations and guidance.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing, cli).
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/module.lifecycle-advisor`

or

`bun add @contractspec/module.lifecycle-advisor`

## Usage

Import the root entrypoint from `@contractspec/module.lifecycle-advisor`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/ceremony` is part of the package's public or composition surface.
- `src/data/` contains static content, registries, and package-local datasets.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/recommendations` is part of the package's public or composition surface.

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
- Fix small issues.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- Depends on `lib.lifecycle` for stage definitions -- never redefine stages here.
- Recommendation data lives in `src/data/`; keep data files declarative and serializable.
- Advisory outputs must be deterministic for the same input state.
