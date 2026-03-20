# AI Agent Guide — `@contractspec/lib.cost-tracking`

Scope: `packages/libs/cost-tracking/*`

API cost tracking and budgeting.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/budget-alert-manager.ts` is part of the package's public or composition surface.
- `src/cost-model.ts` is part of the package's public or composition surface.
- `src/cost-tracker.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/optimization-recommender.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Cost calculation logic must stay deterministic — no side effects or external calls during computation.
- Budget threshold types are shared across consumers; changes require coordination.
- Do not introduce floating-point arithmetic where precision matters; use integer cents or a decimal library.
- Changes here can affect downstream packages such as `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
