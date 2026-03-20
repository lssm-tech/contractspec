# @contractspec/module.audit-trail

Website: https://contractspec.io

**Audit trail module for tracking and querying system events.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing).
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- Related ContractSpec packages include `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.

## Installation

`npm install @contractspec/module.audit-trail`

or

`bun add @contractspec/module.audit-trail`

## Usage

Import the root entrypoint from `@contractspec/module.audit-trail`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/audit-trail.capability.ts` defines a capability surface.
- `src/audit-trail.feature.ts` defines a feature entrypoint.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/storage/` contains persistence adapters and storage implementations.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./audit-trail.capability` resolves through `./src/audit-trail.capability.ts`.
- Export `./audit-trail.feature` resolves through `./src/audit-trail.feature.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

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

- Depends on `lib.bus` for event dispatch -- never emit events outside the bus.
- Audit records are append-only; mutations or deletions break compliance invariants.
- Storage adapters must implement the store interface; do not bypass it.
