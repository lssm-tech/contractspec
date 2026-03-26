# @contractspec/example.ai-chat-assistant

Website: https://contractspec.io

**Focused AI chat assistant example with MCP tools, reasoning, sources, suggestions, and reusable dashboard UI.**

## What This Demonstrates

- Demonstrates how `@contractspec/module.ai-chat` can power a focused assistant experience.
- Publishes feature, contracts, handlers, docs, example, and dashboard UI entrypoints.
- Provides a search-backed, source-aware assistant template for example consumers and docs.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/ai-chat-assistant`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run smoke`
- `bun run typecheck`

## Usage

Use `@contractspec/example.ai-chat-assistant` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/ai-chat-assistant.feature.ts` defines the example feature surface.
- `src/contracts/` contains the assistant operation contract exports.
- `src/handlers/` contains the demo assistant handlers wired to the example feature.
- `src/ui/` contains the packaged dashboard UI for embedding or demonstration.
- `src/docs/` and `src/example.ts` provide docblock and runnable example entrypoints.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Exports the feature surface, contract barrels, handlers, docs entrypoints, runnable example, and dashboard UI.
- Export `.` resolves through `./src/index.ts`.
- Export `./ai-chat-assistant.feature` resolves through `./src/ai-chat-assistant.feature.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./contracts/assistant.operation` resolves through `./src/contracts/assistant.operation.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/ai-chat-assistant.docblock` resolves through `./src/docs/ai-chat-assistant.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./handlers/assistant.handlers` resolves through `./src/handlers/assistant.handlers.ts`.
- Export `./ui` resolves through `./src/ui/index.ts`.
- The package publishes 11 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run smoke` — bun test src/example.smoke.test.ts
- `bun run lint` — bun run lint:fix
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
- Stability.
- Vnext ai-native.

## Notes

- Works alongside `@contractspec/lib.ai-agent`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/module.ai-chat`, `@contractspec/tool.bun`, ...
