# @contractspec/lib.ui-kit-web

Website: https://contractspec.io

**Web UI components built on Radix primitives with design-system token integration.**

## What It Provides

- **Layer**: lib
- **Consumers**: design-system, example-shared-ui, presentation-runtime-react, bundles

## Installation

`npm install @contractspec/lib.ui-kit-web`

or

`bun add @contractspec/lib.ui-kit-web`

## Usage

Import the root entrypoint from `@contractspec/lib.ui-kit-web`, or use one of the documented subpaths when you want a narrower surface area.

## Public Entry Points

- `.` — main entry
- `./ui/*` — individual component exports (many components)

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — jest --passWithNoTests
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types

## Recent Updates

- Missing dependencies (thanks to knip)
- Replace eslint+prettier by biomejs to optimize speed
- Add data visualization capabilities

## Notes

- Radix primitive wrappers must stay accessible (ARIA, keyboard nav)
- Component API must align with design-system tokens
- Do not bypass Radix for custom implementations without justification
