# AI Agent Guide — `@contractspec/example.learning-journey-ui-coaching`

Scope: `packages/examples/learning-journey-ui-coaching/*`

Contextual coaching UI with tip cards and engagement tracking.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/example.learning-journey-ambient-coach`, `@contractspec/example.learning-journey-crm-onboarding`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, ...

## Architecture

- `src/CoachingMiniApp.tsx` is part of the package's public or composition surface.
- `src/components/` contains reusable UI components and view composition.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-ui-coaching.feature.ts` defines a feature entrypoint.
- `src/views/` contains view-level composition.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./CoachingMiniApp` resolves through `./src/CoachingMiniApp.tsx`.
- Export `./components` resolves through `./src/components/index.ts`.
- Export `./components/EngagementMeter` resolves through `./src/components/EngagementMeter.tsx`.
- Export `./components/TipCard` resolves through `./src/components/TipCard.tsx`.
- Export `./components/TipFeed` resolves through `./src/components/TipFeed.tsx`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey-ui-coaching.docblock` resolves through `./src/docs/learning-journey-ui-coaching.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./learning-journey-ui-coaching.feature` resolves through `./src/learning-journey-ui-coaching.feature.ts`.
- The package publishes 15 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/example.learning-journey-ambient-coach`, `@contractspec/example.learning-journey-crm-onboarding`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, ....
- Changes here can affect downstream packages such as `@contractspec/example.learning-journey-ambient-coach`, `@contractspec/example.learning-journey-crm-onboarding`, `@contractspec/example.learning-journey-ui-shared`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit-web`, ...

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
