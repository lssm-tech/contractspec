# @contractspec/lib.ui-link

Website: https://contractspec.io

**Deep linking utilities for cross-platform navigation.**

## What It Provides

- **Layer**: lib
- **Consumers**: bundles, apps

## Installation

`npm install @contractspec/lib.ui-link`

or

`bun add @contractspec/lib.ui-link`

## Usage

Import the root entrypoint from `@contractspec/lib.ui-link`, or use one of the documented subpaths when you want a narrower surface area.

## Public Entry Points

- `.` — `./index.ts`
- `./ui/link` — `./ui/link.tsx`

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

- Replace eslint+prettier by biomejs to optimize speed
- Package exports
- PublishConfig not supported by bun

## Notes

- Link component must stay framework-agnostic (no router-specific coupling)
- Depends on ui-kit-core — coordinate changes with that package
