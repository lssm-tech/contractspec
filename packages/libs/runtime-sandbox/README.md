# @contractspec/lib.runtime-sandbox

**Browser-compatible database abstraction built on PGLite for client-side SQL execution.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, apps.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.

## Installation

`npm install @contractspec/lib.runtime-sandbox`

or

`bun add @contractspec/lib.runtime-sandbox`

## Usage

Import the root entrypoint from `@contractspec/lib.runtime-sandbox`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/ports` is part of the package's public or composition surface.
- `src/types` is part of the package's public or composition surface.
- `src/web` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

- DatabasePort interface is the adapter boundary — consumers depend on the port, not the implementation.
- PGLite adapter must stay browser-compatible (no Node-only APIs).
- Migration schema must remain stable — breaking changes require a migration path.
