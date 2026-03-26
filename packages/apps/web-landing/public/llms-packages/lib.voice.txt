# @contractspec/lib.voice

Website: https://contractspec.io

**Voice capabilities: TTS, STT, and conversational AI.**

## What It Provides

- **Layer**: lib.
- **Consumers**: video-gen, bundles.
- `src/docs/` contains docblocks and documentation-facing exports.
- Related ContractSpec packages include `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/lib.voice`

or

`bun add @contractspec/lib.voice`

## Usage

Import the root entrypoint from `@contractspec/lib.voice`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/audio` is part of the package's public or composition surface.
- `src/conversational` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/stt` is part of the package's public or composition surface.
- `src/sync` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./audio` resolves through `./src/audio/index.ts`.
- Export `./audio/audio-concatenator` resolves through `./src/audio/audio-concatenator.ts`.
- Export `./audio/duration-estimator` resolves through `./src/audio/duration-estimator.ts`.
- Export `./audio/format-converter` resolves through `./src/audio/format-converter.ts`.
- Export `./audio/silence-generator` resolves through `./src/audio/silence-generator.ts`.
- Export `./conversational` resolves through `./src/conversational/index.ts`.
- Export `./conversational/response-orchestrator` resolves through `./src/conversational/response-orchestrator.ts`.
- Export `./conversational/transcript-builder` resolves through `./src/conversational/transcript-builder.ts`.
- Export `./conversational/turn-detector` resolves through `./src/conversational/turn-detector.ts`.
- The package publishes 43 total export subpaths; keep docs aligned with `package.json`.

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
- Resolve lint, build, and test failures across voice, workspace, library, and composio.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Add AI provider ranking system with ranking-driven model selection.
- Add @contractspec/lib.voice package for TTS, STT, and conversational voice.

## Notes

- TTS/STT interfaces are adapter boundaries — keep them provider-agnostic.
- Audio processing must stay streaming-compatible (no full-buffer-only APIs).
- Depends on contracts-spec, contracts-integrations, content-gen.
