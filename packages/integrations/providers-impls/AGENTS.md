# AI Agent Guide — `@contractspec/integration.providers-impls`

Scope: `packages/integrations/providers-impls/*`

Integration provider implementations for email, payments, storage, and more.

## Quick Context

- Layer: `integration`.
- Package visibility: published package.
- Primary consumers are libs, modules, and apps that need runtime bridges or provider adapters.
- Related packages: `@contractspec/integration.runtime`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/analytics.ts` is part of the package's public or composition surface.
- `src/calendar.ts` is part of the package's public or composition surface.
- `src/database.ts` is part of the package's public or composition surface.
- `src/email.ts` is part of the package's public or composition surface.
- `src/embedding.ts` is part of the package's public or composition surface.
- `src/health.ts` is part of the package's public or composition surface.
- `src/impls` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./analytics` resolves through `./src/analytics.ts`.
- Export `./calendar` resolves through `./src/calendar.ts`.
- Export `./database` resolves through `./src/database.ts`.
- Export `./email` resolves through `./src/email.ts`.
- Export `./embedding` resolves through `./src/embedding.ts`.
- Export `./health` resolves through `./src/health.ts`.
- Export `./impls` resolves through `./src/impls/index.ts`.
- Export `./impls/async-event-queue` resolves through `./src/impls/async-event-queue.ts`.
- Export `./impls/composio-fallback-resolver` resolves through `./src/impls/composio-fallback-resolver.ts`.
- The package publishes 76 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Every implementation must satisfy a contract from `contracts-integrations`.
- Never import from apps or bundles.
- Secrets must flow through `@contractspec/integration.runtime`; never hard-code credentials.
- Composio fallback is opt-in; existing code paths are unchanged when config is absent.
- Composio proxy adapters must not leak Composio-specific types into domain interfaces.

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
