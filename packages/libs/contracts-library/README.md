# @contractspec/lib.contracts-library

**Contract definitions for library templates and local runtime.**

## What It Provides

- **Layer**: lib.
- **Consumers**: `bundle.library`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.contracts-library`

or

`bun add @contractspec/lib.contracts-library`

## Usage

Import the root entrypoint from `@contractspec/lib.contracts-library`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/templates` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./templates` resolves through `./src/templates/index.ts`.
- Export `./templates/messaging` resolves through `./src/templates/messaging.ts`.
- Export `./templates/recipes` resolves through `./src/templates/recipes.ts`.
- Export `./templates/todos` resolves through `./src/templates/todos.ts`.

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

- Template contracts define the shape consumed by bundle.library — breaking changes cascade to all template renderers.
- Keep contract schemas additive; avoid removing or renaming fields without a migration path.
