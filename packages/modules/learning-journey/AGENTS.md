# AI Agent Guide — `@contractspec/module.learning-journey`

Scope: `packages/modules/learning-journey/*`

Comprehensive learning journey engine - onboarding, LMS, flashcards, gamification, and AI personalization.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/engines` is part of the package's public or composition surface.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./contracts/models` resolves through `./src/contracts/models.ts`.
- Export `./contracts/onboarding` resolves through `./src/contracts/onboarding.ts`.
- Export `./contracts/operations` resolves through `./src/contracts/operations.ts`.
- Export `./contracts/shared` resolves through `./src/contracts/shared.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey.docblock` resolves through `./src/docs/learning-journey.docblock.ts`.
- Export `./engines` resolves through `./src/engines/index.ts`.
- Export `./engines/srs` resolves through `./src/engines/srs.ts`.
- The package publishes 32 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- SRS/streak/XP engines are pure functions -- keep them side-effect-free.
- i18n catalogs must stay in sync across all supported locales (en, es, fr).
- Entity schemas are shared with the UI; breaking changes propagate to all learning surfaces.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
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
