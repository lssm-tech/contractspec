# @contractspec/example.learning-journey-quest-challenges

Website: https://contractspec.io

**Time-bound quest/challenge learning journey example.**

## What This Demonstrates

- Quest/challenge track with time-bound objectives.
- Completion tracking and deadline enforcement.
- Lightweight track + example pattern.
- Integration with the learning-journey module.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/learning-journey-quest-challenges`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-journey-quest-challenges` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-quest-challenges.feature.ts` defines a feature entrypoint.
- `src/track.test.ts` is part of the package's public or composition surface.
- `src/track.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/quest-challenges.docblock` resolves through `./src/docs/quest-challenges.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./learning-journey-quest-challenges.feature` resolves through `./src/learning-journey-quest-challenges.feature.ts`.
- Export `./track` resolves through `./src/track.ts`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
