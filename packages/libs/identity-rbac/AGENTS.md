# AI Agent Guide — `@contractspec/lib.identity-rbac`

Scope: `packages/libs/identity-rbac/*`

Identity, Organizations, and RBAC module for ContractSpec applications.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/identity-rbac.capability.ts` defines a capability surface.
- `src/identity-rbac.feature.ts` defines a feature entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/policies` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./contracts/organization` resolves through `./src/contracts/organization.ts`.
- Export `./contracts/rbac` resolves through `./src/contracts/rbac.ts`.
- Export `./contracts/user` resolves through `./src/contracts/user.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./entities/organization` resolves through `./src/entities/organization.ts`.
- Export `./entities/rbac` resolves through `./src/entities/rbac.ts`.
- Export `./entities/user` resolves through `./src/entities/user.ts`.
- Export `./events` resolves through `./src/events.ts`.
- The package publishes 14 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- **Security-critical** — RBAC policies control access across the platform.
- Role and permission schemas must stay backward-compatible; removals are breaking.
- Capability contract is public API; policy evaluation must be deterministic.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
