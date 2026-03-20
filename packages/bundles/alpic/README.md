# @contractspec/bundle.alpic

Website: https://contractspec.io

**Re-exports the Alpic module to provide MCP server and ChatGPT App hosting helpers as a single bundle entry point.**

## What It Provides

- **Layer**: bundle
- **Consumers**: `apps/alpic-mcp`

## Installation

`npm install @contractspec/bundle.alpic`

or

`bun add @contractspec/bundle.alpic`

## Usage

Import the root entrypoint from `@contractspec/bundle.alpic`, or use one of the documented subpaths when you want a narrower surface area.

## Public Entry Points

- `.` — `./src/index.ts`

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Package exports
- Make workspace tests pass without local test files

## Notes

- No business logic lives here; all implementation is in `module.alpic`.
- Changes to exports must stay in sync with the module's public API.
