# AI Agent Guide — `@contractspec/bundle.lifecycle-managed`

Scope: `packages/bundles/lifecycle-managed/*`

Lifecycle management bundle with analytics and AI advisor.

## Quick Context

- Layer: `bundle`.
- Package visibility: published package.
- Primary consumers are apps and higher-level composed product surfaces.
- Related packages: `@contractspec/lib.ai-agent`, `@contractspec/lib.analytics`, `@contractspec/lib.lifecycle`, `@contractspec/lib.observability`, `@contractspec/module.lifecycle-advisor`, `@contractspec/module.lifecycle-core`, ...

## Architecture

- `src/services/` -- assessment service (lifecycle evaluation logic).
- `src/agents/` -- AI lifecycle advisor agent.
- `src/events/` -- lifecycle domain events.
- `src/api/` -- REST handler adapters.
- `src/__tests__/` -- unit tests.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Depends on six workspace packages (`lib.ai-agent`, `lib.analytics`, `lib.lifecycle`, `lib.observability`, `module.lifecycle-advisor`, `module.lifecycle-core`); changes to those APIs propagate here.
- Events must remain serializable for cross-service consumption.
- Keep REST handlers thin; domain logic belongs in services.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-agent`, `@contractspec/lib.analytics`, `@contractspec/lib.lifecycle`, `@contractspec/lib.observability`, `@contractspec/module.lifecycle-advisor`, `@contractspec/module.lifecycle-core`, ....

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
