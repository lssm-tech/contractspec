# AI Agent Guide — `@contractspec/lib.voice`

Scope: `packages/libs/voice/*`

Voice capabilities: TTS, STT, and conversational AI.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/audio` is part of the package's public or composition surface.
- `src/conversational` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/stt` is part of the package's public or composition surface.
- `src/sync` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Surface

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

## Guardrails

- TTS/STT interfaces are adapter boundaries — keep them provider-agnostic.
- Audio processing must stay streaming-compatible (no full-buffer-only APIs).
- Depends on contracts-spec, contracts-integrations, content-gen.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
