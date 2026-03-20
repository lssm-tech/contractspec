# AI Agent Guide — `@contractspec/lib.product-intent-utils`

Scope: `packages/libs/product-intent-utils/*`

Prompt builders and validators for product-intent workflows.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/impact-engine.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/project-management-sync.ts` is part of the package's public or composition surface.
- `src/prompts.ts` is part of the package's public or composition surface.
- `src/ticket-pipeline-runner.ts` is part of the package's public or composition surface.
- `src/ticket-pipeline.ts` is part of the package's public or composition surface.
- `src/ticket-prompts.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Prompt templates directly affect AI output quality — test changes against representative inputs.
- Validation schemas must match contracts-spec definitions; drift causes silent mismatches.
- Changes here propagate to product-intent-core and all dependent bundles.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
