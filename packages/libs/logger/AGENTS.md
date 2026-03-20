# AI Agent Guide — `@contractspec/lib.logger`

Scope: `packages/libs/logger/*`

Comprehensive logging library optimized for Bun with ElysiaJS integration.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/context.browser.ts` is part of the package's public or composition surface.
- `src/context.node.ts` is part of the package's public or composition surface.
- `src/context.ts` is part of the package's public or composition surface.
- `src/elysia-plugin.ts` is part of the package's public or composition surface.
- `src/formatters.ts` is part of the package's public or composition surface.
- `src/index.browser.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `types`, `browser`, `default`.
- Export `./context` resolves through `types`, `browser`, `node`, ...
- Export `./context.browser` resolves through `./src/context.browser.ts`.
- Export `./context.node` resolves through `./src/context.node.ts`.
- Export `./elysia-plugin` resolves through `./src/elysia-plugin.ts`.
- Export `./formatters` resolves through `./src/formatters.ts`.
- Export `./index.browser` resolves through `./src/index.browser.ts`.
- Export `./logger` resolves through `types`, `browser`, `node`, ...
- Export `./logger.browser` resolves through `./src/logger.browser.ts`.
- Export `./logger.node` resolves through `./src/logger.node.ts`.
- The package publishes 15 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Logger interface is used across the entire stack — breaking changes affect everything.
- Structured log format must stay JSON-compatible for log aggregation pipelines.
- Elysia plugin must not break the middleware chain; preserve `onRequest`/`onAfterHandle` order.
- Changes here can affect downstream packages such as `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
