# AI Agent Guide — `@contractspec/bundle.product-intent`

Scope: `packages/bundles/product-intent/*`

Product intent bundle with AI runner and evidence retriever.

## Quick Context

- Layer: `bundle`.
- Package visibility: published package.
- Primary consumers are apps and higher-level composed product surfaces.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/module.product-intent-core`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/` -- AI runner and product-intent service.
- `src/__tests__/` -- unit tests.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Uses the Vercel AI SDK (`ai`) for LLM interactions; keep provider-agnostic patterns.
- Depends on `lib.contracts-spec` and `module.product-intent-core`; spec changes upstream affect this bundle.
- AI runner prompts and tool definitions should remain deterministic and testable.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/module.product-intent-core`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
