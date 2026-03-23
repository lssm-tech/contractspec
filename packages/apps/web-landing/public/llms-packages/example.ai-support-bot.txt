# @contractspec/example.ai-support-bot

Website: https://contractspec.io

**AI support bot example: classify and resolve a support ticket using @contractspec/lib.support-bot.**

## What This Demonstrates

- Ticket classification pipeline with AI-driven resolution.
- Integration of support-bot lib with knowledge base.
- DocBlock documentation for in-app help.
- Setup and example entry points for quick cloning.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/ai-support-bot`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.ai-support-bot` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/ai-support-bot.feature.ts` defines a feature entrypoint.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/setup.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./ai-support-bot.feature` resolves through `./src/ai-support-bot.feature.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/ai-support-bot.docblock` resolves through `./src/docs/ai-support-bot.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./setup` resolves through `./src/setup.ts`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.logger`, `@contractspec/lib.support-bot`, `@contractspec/tool.bun`, ...
