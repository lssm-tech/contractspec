# AI Agent Guide — `@contractspec/lib.provider-ranking`

Scope: `packages/libs/provider-ranking/*`

AI provider ranking: benchmark ingestion, scoring, and model comparison.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/eval` is part of the package's public or composition surface.
- `src/in-memory-store.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/ingesters` is part of the package's public or composition surface.
- `src/scoring` is part of the package's public or composition surface.
- `src/store.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./eval` resolves through `./src/eval/index.ts`.
- Export `./eval/runner` resolves through `./src/eval/runner.ts`.
- Export `./eval/types` resolves through `./src/eval/types.ts`.
- Export `./in-memory-store` resolves through `./src/in-memory-store.ts`.
- Export `./ingesters` resolves through `./src/ingesters/index.ts`.
- Export `./ingesters/artificial-analysis` resolves through `./src/ingesters/artificial-analysis.ts`.
- Export `./ingesters/chatbot-arena` resolves through `./src/ingesters/chatbot-arena.ts`.
- Export `./ingesters/fetch-utils` resolves through `./src/ingesters/fetch-utils.ts`.
- Export `./ingesters/open-llm-leaderboard` resolves through `./src/ingesters/open-llm-leaderboard.ts`.
- The package publishes 19 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Store interface is the adapter boundary — do not leak implementation details.
- Scoring algorithms must stay deterministic (no randomness, no side effects).
- Benchmark dimension enum is shared across ingesters and scoring — keep in sync.
- Changes here can affect downstream packages such as `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
