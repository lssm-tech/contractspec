# AI Agent Guide — `@contractspec/module.audit-trail`

Scope: `packages/modules/audit-trail/*`

Audit trail module for tracking and querying system events.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/audit-trail.capability.ts` defines a capability surface.
- `src/audit-trail.feature.ts` defines a feature entrypoint.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/storage/` contains persistence adapters and storage implementations.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./audit-trail.capability` resolves through `./src/audit-trail.capability.ts`.
- Export `./audit-trail.feature` resolves through `./src/audit-trail.feature.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

## Guardrails

- Depends on `lib.bus` for event dispatch -- never emit events outside the bus.
- Audit records are append-only; mutations or deletions break compliance invariants.
- Storage adapters must implement the store interface; do not bypass it.
- Changes here can affect downstream packages such as `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
