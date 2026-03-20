# AI Agent Guide — `@contractspec/lib.feature-flags`

Scope: `packages/libs/feature-flags/*`

Feature flags and experiments module for ContractSpec applications.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/evaluation` is part of the package's public or composition surface.
- `src/events.ts` is package-level event definitions.
- `src/feature-flags.capability.ts` defines a capability surface.
- `src/feature-flags.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/feature-flags.docblock` resolves through `./src/docs/feature-flags.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./evaluation` resolves through `./src/evaluation/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./feature-flags.capability` resolves through `./src/feature-flags.capability.ts`.
- Export `./feature-flags.feature` resolves through `./src/feature-flags.feature.ts`.

## Guardrails

- Flag evaluation logic must be deterministic — same input always produces same output.
- Capability and feature contracts are public API; changes are breaking.
- Follow the PostHog naming conventions defined in workspace rules for new flag names.
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
