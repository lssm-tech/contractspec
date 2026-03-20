# @contractspec/lib.feature-flags

Website: https://contractspec.io

**Feature flags and experiments module for ContractSpec applications.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, apps.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/lib.feature-flags`

or

`bun add @contractspec/lib.feature-flags`

## Usage

Import the root entrypoint from `@contractspec/lib.feature-flags`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/evaluation` is part of the package's public or composition surface.
- `src/events.ts` is package-level event definitions.
- `src/feature-flags.capability.ts` defines a capability surface.
- `src/feature-flags.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/feature-flags.docblock` resolves through `./src/docs/feature-flags.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./evaluation` resolves through `./src/evaluation/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./feature-flags.capability` resolves through `./src/feature-flags.capability.ts`.
- Export `./feature-flags.feature` resolves through `./src/feature-flags.feature.ts`.

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

## Notes

- Flag evaluation logic must be deterministic — same input always produces same output.
- Capability and feature contracts are public API; changes are breaking.
- Follow the PostHog naming conventions defined in workspace rules for new flag names.
