# AI Agent Guide — `@contractspec/lib.overlay-engine`

Scope: `packages/libs/overlay-engine/*`

Runtime overlay engine for ContractSpec personalization and adaptive UI rendering.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/merger.ts` is part of the package's public or composition surface.
- `src/react.ts` is part of the package's public or composition surface.
- `src/registry.ts` is part of the package's public or composition surface.
- `src/runtime.ts` is part of the package's public or composition surface.
- `src/signer.ts` is part of the package's public or composition surface.
- `src/spec.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./merger` resolves through `./src/merger.ts`.
- Export `./react` resolves through `./src/react.ts`.
- Export `./registry` resolves through `./src/registry.ts`.
- Export `./runtime` resolves through `./src/runtime.ts`.
- Export `./signer` resolves through `./src/signer.ts`.
- Export `./spec` resolves through `./src/spec.ts`.
- Export `./types` resolves through `./src/types.ts`.
- Export `./validator` resolves through `./src/validator.ts`.

## Guardrails

- Overlay spec schema is a contract — changes are breaking for all consumers.
- Signer must preserve cryptographic integrity; do not alter signing algorithm without migration.
- Merger logic must be idempotent — applying the same overlay twice must produce identical results.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
