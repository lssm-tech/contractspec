# @contractspec/integration.providers-impls

Website: https://contractspec.io

**Integration provider implementations for email, payments, storage, and more.**

## What It Provides

- **Layer**: integration.
- **Consumers**: bundles, apps, modules that need concrete provider wiring.
- Related ContractSpec packages include `@contractspec/integration.runtime`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/integration.runtime`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/integration.providers-impls`

or

`bun add @contractspec/integration.providers-impls`

## Usage

Import the root entrypoint from `@contractspec/integration.providers-impls`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/analytics.ts` is part of the package's public or composition surface.
- `src/calendar.ts` is part of the package's public or composition surface.
- `src/database.ts` is part of the package's public or composition surface.
- `src/email.ts` is part of the package's public or composition surface.
- `src/embedding.ts` is part of the package's public or composition surface.
- `src/health.ts` is part of the package's public or composition surface.
- `src/impls` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

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

## Recent Updates

- Missing dependencies (thanks to knip).
- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint, build, and type errors across nine packages.
- Resolve lint, build, and test failures across voice, workspace, library, and composio.
- Composio.
- Normalize formatting across contracts-integrations, composio, and observability.

## Notes

- Every implementation must satisfy a contract from `contracts-integrations`.
- Never import from apps or bundles.
- Secrets must flow through `@contractspec/integration.runtime`; never hard-code credentials.
- Composio fallback is opt-in; existing code paths are unchanged when config is absent.
- Composio proxy adapters must not leak Composio-specific types into domain interfaces.
