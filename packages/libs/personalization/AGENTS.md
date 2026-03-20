# AI Agent Guide — `@contractspec/lib.personalization`

Scope: `packages/libs/personalization/*`

Behavior tracking, analysis, and adaptation helpers for ContractSpec personalization.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.overlay-engine`, `@contractspec/lib.schema`, `@contractspec/lib.surface-runtime`, ...

## Architecture

- `src/adapter.ts` is part of the package's public or composition surface.
- `src/analyzer.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/preference-dimensions.ts` is part of the package's public or composition surface.
- `src/store.ts` is part of the package's public or composition surface.
- `src/tracker.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./adapter` resolves through `./src/adapter.ts`.
- Export `./analyzer` resolves through `./src/analyzer.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/behavior-tracking.docblock` resolves through `./src/docs/behavior-tracking.docblock.ts`.
- Export `./docs/overlay-engine.docblock` resolves through `./src/docs/overlay-engine.docblock.ts`.
- Export `./docs/workflow-composition.docblock` resolves through `./src/docs/workflow-composition.docblock.ts`.
- Export `./preference-dimensions` resolves through `./src/preference-dimensions.ts`.
- Export `./store` resolves through `./src/store.ts`.
- Export `./tracker` resolves through `./src/tracker.ts`.
- The package publishes 11 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Tracker interface is the adapter boundary — implementation details must not leak.
- Behavior data schema must stay backward-compatible; older events must remain parseable.
- Depends on bus, overlay-engine, and knowledge — coordinate cross-lib changes.
- Changes here can affect downstream packages such as `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.overlay-engine`, `@contractspec/lib.schema`, `@contractspec/lib.surface-runtime`, ....

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
