# @contractspec/integration.harness-runtime

Website: https://contractspec.io

**Runtime adapters that bridge the ContractSpec harness core into browser, sandbox, artifact, and MCP-backed execution targets.**

## What It Provides

- Provides concrete adapters for browser automation, visual harnessing, sandboxed execution, and artifact storage.
- Exposes MCP helpers and default target resolution on top of the mode-agnostic harness core.
- Keeps higher-cost runtime integrations optional so consumers can opt into heavier execution targets deliberately.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.

## Installation

`npm install @contractspec/integration.harness-runtime`

or

`bun add @contractspec/integration.harness-runtime`

## Usage

Import the root entrypoint from `@contractspec/integration.harness-runtime`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/adapters/` contains browser, sandbox, and visual harness adapters.
- `src/artifacts/` contains filesystem and in-memory artifact-store implementations.
- `src/mcp/` exposes harness execution surfaces to MCP-aware runtimes.
- `src/targets/` contains target resolution helpers and target-selection logic.
- `src/types.ts` exposes shared runtime-facing harness types.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Exports runtime adapters, artifact stores, MCP exposure helpers, target resolution, and shared types.
- Export `.` resolves through `./src/index.ts`.
- Export `./adapters/playwrightBrowserHarnessAdapter` resolves through `./src/adapters/playwrightBrowserHarnessAdapter.ts`.
- Export `./adapters/sandboxedCodeExecutionAdapter` resolves through `./src/adapters/sandboxedCodeExecutionAdapter.ts`.
- Export `./adapters/visualHarnessAdapter` resolves through `./src/adapters/visualHarnessAdapter.ts`.
- Export `./artifacts/filesystemArtifactStore` resolves through `./src/artifacts/filesystemArtifactStore.ts`.
- Export `./artifacts/inMemoryArtifactStore` resolves through `./src/artifacts/inMemoryArtifactStore.ts`.
- Export `./mcp/exposure` resolves through `./src/mcp/exposure.ts`.
- Export `./targets/defaultTargetResolver` resolves through `./src/targets/defaultTargetResolver.ts`.
- Export `./types` resolves through `./src/types.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
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
- Add a first-class harness system for controlled inspection, testing, evaluation, and proof generation.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.harness`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
