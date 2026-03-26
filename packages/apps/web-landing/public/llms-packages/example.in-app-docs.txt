# @contractspec/example.in-app-docs

Website: https://contractspec.io

**Example showing how to use DocBlock for in-app documentation for non-technical users.**

## What This Demonstrates

- DocBlock-driven in-app documentation pattern.
- React viewer component for rendering DocBlocks.
- User-facing documentation without technical jargon.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/ui/` contains packaged UI exports and embeddable views.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/in-app-docs`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.in-app-docs` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/in-app-docs.feature.ts` defines a feature entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/ui/` contains packaged UI exports and embeddable views.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/in-app-docs.docblock` resolves through `./src/docs/in-app-docs.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./in-app-docs.feature` resolves through `./src/in-app-docs.feature.ts`.
- Export `./ui` resolves through `./src/ui/index.ts`.
- Export `./ui/InAppDocsViewer` resolves through `./src/ui/InAppDocsViewer.tsx`.

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

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.example-shared-ui`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
