# @contractspec/example.learning-journey-ui-shared

Website: https://contractspec.io

**Shared UI components and hooks for learning journey mini-apps.**

## What This Demonstrates

- Reusable gamification components (XpBar, StreakCounter, BadgeDisplay, ViewTabs).
- Custom hook pattern (`useLearningProgress`) for shared state.
- Shared types for cross-mini-app consistency.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/learning-journey-ui-shared`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-journey-ui-shared` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/components/` contains reusable UI components and view composition.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/hooks/` contains custom hooks for host applications.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-ui-shared.feature.ts` defines a feature entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./components` resolves through `./src/components/index.ts`.
- Export `./components/BadgeDisplay` resolves through `./src/components/BadgeDisplay.tsx`.
- Export `./components/StreakCounter` resolves through `./src/components/StreakCounter.tsx`.
- Export `./components/ViewTabs` resolves through `./src/components/ViewTabs.tsx`.
- Export `./components/XpBar` resolves through `./src/components/XpBar.tsx`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey-ui-shared.docblock` resolves through `./src/docs/learning-journey-ui-shared.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./hooks` resolves through `./src/hooks/index.ts`.
- The package publishes 13 total export subpaths; keep docs aligned with `package.json`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, ...
