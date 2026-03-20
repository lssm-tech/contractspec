# AI Agent Guide — `@contractspec/lib.contracts-integrations`

Scope: `packages/libs/contracts-integrations/*`

Integration contract definitions for external services.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integrations` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./integrations` resolves through `./src/integrations/index.ts`.
- Export `./integrations/auth` resolves through `./src/integrations/auth.ts`.
- Export `./integrations/auth-helpers` resolves through `./src/integrations/auth-helpers.ts`.
- Export `./integrations/binding` resolves through `./src/integrations/binding.ts`.
- Export `./integrations/byok` resolves through `./src/integrations/byok.ts`.
- Export `./integrations/connection` resolves through `./src/integrations/connection.ts`.
- Export `./integrations/docs/integrations.docblock` resolves through `./src/integrations/docs/integrations.docblock.ts`.
- Export `./integrations/health` resolves through `./src/integrations/health.ts`.
- Export `./integrations/health/contracts` resolves through `./src/integrations/health/contracts/index.ts`.
- The package publishes 121 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- High blast radius — integration contracts are consumed by many libs.
- Provider and secret catalog schemas must stay backward-compatible.
- Adding a new integration must not break existing subpath imports.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
