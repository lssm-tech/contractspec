# AI Agent Guide — `@contractspec/lib.bus`

Scope: `packages/libs/bus/*`

Event bus and messaging primitives.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/auditableBus.ts` is part of the package's public or composition surface.
- `src/eventBus.ts` is part of the package's public or composition surface.
- `src/filtering.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/inMemoryBus.ts` is part of the package's public or composition surface.
- `src/metadata.ts` is part of the package's public or composition surface.
- `src/subscriber.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./auditableBus` resolves through `./src/auditableBus.ts`.
- Export `./eventBus` resolves through `./src/eventBus.ts`.
- Export `./filtering` resolves through `./src/filtering.ts`.
- Export `./inMemoryBus` resolves through `./src/inMemoryBus.ts`.
- Export `./metadata` resolves through `./src/metadata.ts`.
- Export `./subscriber` resolves through `./src/subscriber.ts`.

## Guardrails

- `EventBus` interface is a core contract; changes affect all event-driven communication.
- Do not alter the subscriber/publish protocol without coordinating with all consumers.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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
