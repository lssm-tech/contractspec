# AI Agent Guide — `@contractspec/integration.runtime`

Scope: `packages/integrations/runtime/*`

Runtime integration with secret management.

## Quick Context

- Layer: `integration`.
- Package visibility: published package.
- Primary consumers are libs, modules, and apps that need runtime bridges or provider adapters.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/channel` is part of the package's public or composition surface.
- `src/health.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/runtime.health.test.ts` is part of the package's public or composition surface.
- `src/runtime.ts` is part of the package's public or composition surface.
- `src/secrets` is part of the package's public or composition surface.
- `src/transport` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./channel` resolves through `./src/channel/index.ts`.
- Export `./channel/dispatcher` resolves through `./src/channel/dispatcher.ts`.
- Export `./channel/github` resolves through `./src/channel/github.ts`.
- Export `./channel/memory-store` resolves through `./src/channel/memory-store.ts`.
- Export `./channel/policy` resolves through `./src/channel/policy.ts`.
- Export `./channel/postgres-queries` resolves through `./src/channel/postgres-queries.ts`.
- Export `./channel/postgres-schema` resolves through `./src/channel/postgres-schema.ts`.
- Export `./channel/postgres-store` resolves through `./src/channel/postgres-store.ts`.
- Export `./channel/replay-fixtures` resolves through `./src/channel/replay-fixtures.ts`.
- The package publishes 28 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Secret providers must implement the `provider` interface; never read secrets directly.
- Channel stores (memory, postgres) are swappable; do not couple to a specific backend.
- Never import from apps or bundles.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
