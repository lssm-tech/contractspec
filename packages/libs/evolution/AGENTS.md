# AI Agent Guide — `@contractspec/lib.evolution`

Scope: `packages/libs/evolution/*`

AI-powered contract evolution engine.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.observability`, ...

## Architecture

- `src/analyzer` is part of the package's public or composition surface.
- `src/approval` is part of the package's public or composition surface.
- `src/generator` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Evolution strategies affect contract migration paths; changes can break existing migrations.
- Depends on multiple core libs — verify compatibility when updating any dependency.
- Strategy selection logic must remain deterministic and auditable.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.observability`, ....

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
