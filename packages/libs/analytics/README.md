# @contractspec/lib.analytics

Website: https://contractspec.io

**Product analytics and growth metrics.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, apps.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.analytics`

or

`bun add @contractspec/lib.analytics`

## Usage

Import the root entrypoint from `@contractspec/lib.analytics`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/churn` is part of the package's public or composition surface.
- `src/cohort` is part of the package's public or composition surface.
- `src/funnel` is part of the package's public or composition surface.
- `src/growth` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/lifecycle` is part of the package's public or composition surface.
- `src/posthog` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./churn` resolves through `./src/churn/index.ts`.
- Export `./churn/predictor` resolves through `./src/churn/predictor.ts`.
- Export `./cohort` resolves through `./src/cohort/index.ts`.
- Export `./cohort/tracker` resolves through `./src/cohort/tracker.ts`.
- Export `./funnel` resolves through `./src/funnel/index.ts`.
- Export `./funnel/analyzer` resolves through `./src/funnel/analyzer.ts`.
- Export `./growth` resolves through `./src/growth/index.ts`.
- Export `./growth/hypothesis-generator` resolves through `./src/growth/hypothesis-generator.ts`.
- Export `./lifecycle` resolves through `./src/lifecycle/index.ts`.
- The package publishes 16 total export subpaths; keep docs aligned with `package.json`.

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

- Event naming conventions must stay consistent with PostHog taxonomy.
- Metric calculations affect live dashboards; verify formulas before changing.
