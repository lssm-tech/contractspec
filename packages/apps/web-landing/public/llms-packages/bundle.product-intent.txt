# @contractspec/bundle.product-intent

Website: https://contractspec.io

**Product intent bundle with AI runner and evidence retriever.**

## What It Provides

- **Layer**: bundle.
- **Consumers**: not yet wired into an app (standalone bundle).
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/module.product-intent-core`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/module.product-intent-core`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/bundle.product-intent`

or

`bun add @contractspec/bundle.product-intent`

## Usage

Import the root entrypoint from `@contractspec/bundle.product-intent`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/` -- AI runner and product-intent service.
- `src/__tests__/` -- unit tests.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Uses the Vercel AI SDK (`ai`) for LLM interactions; keep provider-agnostic patterns.
- Depends on `lib.contracts-spec` and `module.product-intent-core`; spec changes upstream affect this bundle.
- AI runner prompts and tool definitions should remain deterministic and testable.
