# @contractspec/example.content-generation

Website: https://contractspec.io

**Content generation example using @contractspec/lib.content-gen.**

## What This Demonstrates

- Content generation pipeline with typed contracts.
- Integration with the content-gen library.
- Structured logging for generation steps.
- DocBlock documentation for the generation flow.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/content-generation`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.content-generation` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/content-generation.feature.ts` defines a feature entrypoint.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/generate.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./content-generation.feature` resolves through `./src/content-generation.feature.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/content-generation.docblock` resolves through `./src/docs/content-generation.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./generate` resolves through `./src/generate.ts`.

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

- Works alongside `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
