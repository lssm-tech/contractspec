# @contractspec/example.video-api-showcase

Website: https://contractspec.io

**Generate API documentation videos from contract spec definitions using the ApiOverview composition.**

## What This Demonstrates

- Video generation pipeline from contract specs.
- ApiOverview composition pattern.
- Sample spec definitions for video input.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/video-api-showcase`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.video-api-showcase` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/build-api-video.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/sample-specs.ts` is part of the package's public or composition surface.
- `src/video-api-showcase.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./build-api-video` resolves through `./src/build-api-video.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/video-api-showcase.docblock` resolves through `./src/docs/video-api-showcase.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./sample-specs` resolves through `./src/sample-specs.ts`.
- Export `./video-api-showcase.feature` resolves through `./src/video-api-showcase.feature.ts`.

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

- Works alongside `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.video-gen`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
