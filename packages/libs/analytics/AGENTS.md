# AI Agent Guide — `@contractspec/lib.analytics`

Scope: `packages/libs/analytics/*`

Product analytics and growth metrics.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/churn` is part of the package's public or composition surface.
- `src/cohort` is part of the package's public or composition surface.
- `src/funnel` is part of the package's public or composition surface.
- `src/growth` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/lifecycle` is part of the package's public or composition surface.
- `src/posthog` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

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

## Guardrails

- Event naming conventions must stay consistent with PostHog taxonomy.
- Metric calculations affect live dashboards; verify formulas before changing.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
