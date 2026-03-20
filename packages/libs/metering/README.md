# @contractspec/lib.metering

Website: https://contractspec.io

**Usage metering and billing core module for ContractSpec applications.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/lib.metering`

or

`bun add @contractspec/lib.metering`

## Usage

Import the root entrypoint from `@contractspec/lib.metering`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/aggregation` is part of the package's public or composition surface.
- `src/analytics` is part of the package's public or composition surface.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./aggregation` resolves through `./src/aggregation/index.ts`.
- Export `./analytics/posthog-metering` resolves through `./src/analytics/posthog-metering.ts`.
- Export `./analytics/posthog-metering-reader` resolves through `./src/analytics/posthog-metering-reader.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/metering.docblock` resolves through `./src/docs/metering.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./metering.capability` resolves through `./src/metering.capability.ts`.
- The package publishes 11 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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
- Stability.
- Resolve lint, build, and type errors across nine packages.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- Aggregation logic must stay deterministic — non-determinism causes billing discrepancies.
- Billing-related schemas are compliance-sensitive; changes require review.
- Capability contract (`metering.capability`) is public API — treat as a breaking-change surface.
