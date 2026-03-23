# @contractspec/lib.provider-ranking

Website: https://contractspec.io

**AI provider ranking: benchmark ingestion, scoring, and model comparison.**

## What It Provides

- **Layer**: lib.
- **Consumers**: module.provider-ranking.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.provider-ranking`

or

`bun add @contractspec/lib.provider-ranking`

## Usage

Import the root entrypoint from `@contractspec/lib.provider-ranking`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/eval` is part of the package's public or composition surface.
- `src/in-memory-store.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/ingesters` is part of the package's public or composition surface.
- `src/scoring` is part of the package's public or composition surface.
- `src/store.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint, build, and type errors across nine packages.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- Store interface is the adapter boundary — do not leak implementation details.
- Scoring algorithms must stay deterministic (no randomness, no side effects).
- Benchmark dimension enum is shared across ingesters and scoring — keep in sync.
