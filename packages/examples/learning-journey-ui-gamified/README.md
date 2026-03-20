# @contractspec/example.learning-journey-ui-gamified

Website: https://contractspec.io

**Duolingo-style gamified learning UI for drills and quests.**

## What This Demonstrates

- GamifiedMiniApp as a self-contained React application.
- FlashCard, DayCalendar, and MasteryRing components.
- Multi-view layout (Overview, Progress, Steps, Timeline).
- Integration with duo-drills and quest-challenges tracks.
- Design system and UI kit usage patterns.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/learning-journey-ui-gamified`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-journey-ui-gamified` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/components/` contains reusable UI components and view composition.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/GamifiedMiniApp.tsx` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-ui-gamified.feature.ts` defines a feature entrypoint.
- `src/views/` contains view-level composition.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./components` resolves through `./src/components/index.ts`.
- Export `./components/DayCalendar` resolves through `./src/components/DayCalendar.tsx`.
- Export `./components/FlashCard` resolves through `./src/components/FlashCard.tsx`.
- Export `./components/MasteryRing` resolves through `./src/components/MasteryRing.tsx`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey-ui-gamified.docblock` resolves through `./src/docs/learning-journey-ui-gamified.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./GamifiedMiniApp` resolves through `./src/GamifiedMiniApp.tsx`.
- Export `./learning-journey-ui-gamified.feature` resolves through `./src/learning-journey-ui-gamified.feature.ts`.
- The package publishes 15 total export subpaths; keep docs aligned with `package.json`.

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

- Works alongside `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, ...
