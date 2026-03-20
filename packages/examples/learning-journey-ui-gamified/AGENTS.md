# AI Agent Guide — `@contractspec/example.learning-journey-ui-gamified`

Scope: `packages/examples/learning-journey-ui-gamified/*`

Duolingo-style gamified learning UI for drills and quests.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, ...

## Architecture

- `src/components/` contains reusable UI components and view composition.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/GamifiedMiniApp.tsx` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-ui-gamified.feature.ts` defines a feature entrypoint.
- `src/views/` contains view-level composition.

## Public Surface

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

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, ....
- Changes here can affect downstream packages such as `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, ...

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
