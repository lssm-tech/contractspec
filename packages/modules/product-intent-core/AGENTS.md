# AI Agent Guide — `@contractspec/module.product-intent-core`

Scope: `packages/modules/product-intent-core/*`

Core product intent orchestration and adapters.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/evidence/` contains evidence ingestion and normalization helpers.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/orchestrator` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Depends on `lib.product-intent-utils` for shared utilities -- keep orchestration logic here, primitives in the lib.
- Intent resolution must be idempotent; re-processing the same input should yield the same spec output.
- Adapter interfaces are the extension point; new integrations go through the adapter pattern.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
