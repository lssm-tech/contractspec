# @contractspec/lib.plugins

Website: https://contractspec.io

**Plugin API and registry for ContractSpec extensions.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, CLI.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.plugins`

or

`bun add @contractspec/lib.plugins`

## Usage

Import the root entrypoint from `@contractspec/lib.plugins`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/config.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/registry.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./config` resolves through `./src/config.ts`.
- Export `./registry` resolves through `./src/registry.ts`.
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

## Notes

- Plugin interface is a public API contract — breaking changes affect all published plugins.
- Registry must stay backward-compatible; older plugin manifests must remain loadable.
- Config schema changes require a migration path for existing plugin configurations.
