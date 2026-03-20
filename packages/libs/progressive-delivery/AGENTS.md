# AI Agent Guide — `@contractspec/lib.progressive-delivery`

Scope: `packages/libs/progressive-delivery/*`

Progressive delivery and canary release primitives. Provides strategy definitions and rollout logic for safe, incremental deployments.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.observability`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/canary-analyzer.ts` is part of the package's public or composition surface.
- `src/canary-controller.ts` is part of the package's public or composition surface.
- `src/deployment-coordinator.ts` is part of the package's public or composition surface.
- `src/events.ts` is package-level event definitions.
- `src/feature-flags.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/rollback-manager.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Delivery strategies must be deterministic — same input must produce same rollout decision.
- Peer dependency on observability; ensure OTel integration stays aligned.
- Strategy interface changes affect all deployment pipelines consuming this lib.
- Changes here can affect downstream packages such as `@contractspec/lib.observability`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
