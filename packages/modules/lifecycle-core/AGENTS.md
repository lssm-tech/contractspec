# AI Agent Guide — `@contractspec/module.lifecycle-core`

Scope: `packages/modules/lifecycle-core/*`

Core lifecycle stage definitions and transitions.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/collectors` is part of the package's public or composition surface.
- `src/data/` contains static content, registries, and package-local datasets.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/orchestrator` is part of the package's public or composition surface.
- `src/planning` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Depends on `lib.lifecycle` for foundational types -- this module adds orchestration on top.
- Stage transition rules are the source of truth; changes here cascade to lifecycle-advisor and all consuming bundles.
- Stage data in `src/data/` must remain backward-compatible to avoid breaking persisted project states.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
