# @contractspec/example.voice-providers

Website: https://contractspec.io

**Voice provider example: Gradium and Fal text-to-speech integration patterns.**

## What This Demonstrates

- TTS provider integration pattern with connection samples.
- Handler-per-action pattern (create-provider, list-voices, synthesize).
- Run script for one-shot execution.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/voice-providers`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.voice-providers` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/connection.sample.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/run.ts` is part of the package's public or composition surface.
- `src/voice-providers.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./connection.sample` resolves through `./src/connection.sample.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/voice-providers.docblock` resolves through `./src/docs/voice-providers.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers/create-provider` resolves through `./src/handlers/create-provider.ts`.
- Export `./handlers/list-voices` resolves through `./src/handlers/list-voices.ts`.
- Export `./handlers/synthesize` resolves through `./src/handlers/synthesize.ts`.
- Export `./run` resolves through `./src/run.ts`.
- Export `./voice-providers.feature` resolves through `./src/voice-providers.feature.ts`.

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
- Major change to content generation.

## Notes

- Works alongside `@contractspec/integration.provider.voice`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
