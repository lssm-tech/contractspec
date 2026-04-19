# @contractspec/module.learning-journey

Website: https://contractspec.io

**Canonical adaptive journey runtime for onboarding, drills, coaching, LMS, flashcards, gamification, and AI personalization.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing).
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/module.learning-journey`

or

`bun add @contractspec/module.learning-journey`

## Usage

Import the root entrypoint from `@contractspec/module.learning-journey`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/engines` is part of the package's public or composition surface.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./contracts/models` resolves through `./src/contracts/models.ts`.
- Export `./contracts/journey` resolves through `./src/contracts/journey.ts`.
- Export `./contracts/operations` resolves through `./src/contracts/operations.ts`.
- Export `./contracts/shared` resolves through `./src/contracts/shared.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey.docblock` resolves through `./src/docs/learning-journey.docblock.ts`.
- Export `./engines` resolves through `./src/engines/index.ts`.
- Export `./engines/srs` resolves through `./src/engines/srs.ts`.
- Export `./runtime` resolves through `./src/runtime/index.ts`.
- The package publishes 32 total export subpaths; keep docs aligned with `package.json`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- SRS/streak/XP engines are pure functions -- keep them side-effect-free.
- i18n catalogs must stay in sync across all supported locales (en, es, fr).
- Entity schemas are shared with the UI; breaking changes propagate to all learning surfaces.
