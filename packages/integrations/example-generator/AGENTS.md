# AI Agent Guide — `@contractspec/integration.example-generator`

Scope: `packages/integrations/example-generator/*`

Example plugin: Markdown documentation generator for ContractSpec specs.

## Quick Context

- Layer: `integration`.
- Package visibility: published package.
- Primary consumers are libs, modules, and apps that need runtime bridges or provider adapters.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/config.ts` is part of the package's public or composition surface.
- `src/generator.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./config` resolves through `./src/config.ts`.
- Export `./generator` resolves through `./src/generator.ts`.
- Export `./types` resolves through `./src/types.ts`.

## Guardrails

- Do not add business logic; this is a reference plugin.
- Keep the export surface minimal -- new exports need a clear use-case.
- Peer-depends on `contracts-spec` and `schema`; do not bundle them.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
- `bun run test:watch` — bun test --watch
- `bun run test:coverage` — bun test --coverage
- `bun run prebuild` — contractspec-bun-build prebuild
