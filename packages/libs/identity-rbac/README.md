# @contractspec/lib.identity-rbac

Website: https://contractspec.io

**Identity, Organizations, and RBAC module for ContractSpec applications.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, apps.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.

## Installation

`npm install @contractspec/lib.identity-rbac`

or

`bun add @contractspec/lib.identity-rbac`

## Usage

Import the root entrypoint from `@contractspec/lib.identity-rbac`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/identity-rbac.capability.ts` defines a capability surface.
- `src/identity-rbac.feature.ts` defines a feature entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/policies` is part of the package's public or composition surface.

## Public Entry Points

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

- **Security-critical** — RBAC policies control access across the platform.
- Role and permission schemas must stay backward-compatible; removals are breaking.
- Capability contract is public API; policy evaluation must be deterministic.
