# @contractspec/lib.ui-kit

Website: https://contractspec.io

**Cross-platform UI components for React Native and web surfaces.**

## What It Provides

- **Layer**: lib
- **Consumers**: accessibility, design-system, presentation-runtime-react-native, bundles

## Installation

`npm install @contractspec/lib.ui-kit`

or

`bun add @contractspec/lib.ui-kit`

## Usage

Import the root entrypoint from `@contractspec/lib.ui-kit`, or use one of the documented subpaths when you want a narrower surface area.

## Public Entry Points

- `.` — main entry
- `./ui/*` — individual component exports (many components)

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
- Add data visualization capabilities
- Add table capabilities

## Notes

- Component API must stay cross-platform compatible (React Native + web)
- Depends on ui-kit-core — changes there propagate here
- Do not introduce web-only or native-only APIs without a platform check
