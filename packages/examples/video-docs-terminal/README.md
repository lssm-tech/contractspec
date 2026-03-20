# @contractspec/example.video-docs-terminal

Website: https://contractspec.io

**Generate terminal demo videos from CLI walkthroughs using the TerminalDemo composition and ScriptGenerator.**

## What This Demonstrates

- Terminal demo video generation pipeline.
- Narration generation from CLI walkthroughs.
- Sample tutorial definitions for video input.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/video-docs-terminal`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.video-docs-terminal` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/build-tutorial.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/generate-narration.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/sample-tutorials.ts` is part of the package's public or composition surface.
- `src/video-docs-terminal.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./build-tutorial` resolves through `./src/build-tutorial.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/video-docs-terminal.docblock` resolves through `./src/docs/video-docs-terminal.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./generate-narration` resolves through `./src/generate-narration.ts`.
- Export `./sample-tutorials` resolves through `./src/sample-tutorials.ts`.
- Export `./video-docs-terminal.feature` resolves through `./src/video-docs-terminal.feature.ts`.

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

- Works alongside `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.video-gen`, `@contractspec/tool.bun`, ...
