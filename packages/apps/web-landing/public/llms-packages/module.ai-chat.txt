# @contractspec/module.ai-chat

Website: https://contractspec.io

**AI chat module with context, core runtime, presentation components, hooks, providers, and agent-aware workflows.**

## What It Provides

- Provides the packaged chat feature layer used by examples and higher-level applications.
- Supports MCP tools, provider integration, presentation rendering, forms, and agent-mode workflows.
- Acts as the main composition layer between the low-level agent runtime and user-facing chat UIs.
- `src/adapters/` contains runtime, provider, or environment-specific adapters.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/presentation/` contains presentation-layer components and renderers.

## Installation

`npm install @contractspec/module.ai-chat`

or

`bun add @contractspec/module.ai-chat`

## Usage

Import the root entrypoint from `@contractspec/module.ai-chat`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/context/` contains shared chat providers and contextual runtime state.
- `src/core/` contains chat orchestration, workflows, and non-UI runtime logic.
- `src/presentation/` exports UI components and React hooks for embedding the chat experience.
- `src/providers/` exposes provider bindings and provider-facing integration helpers.
- Top-level feature, capability, operation, schema, and event files define the module contract surface.
- `src/ai-chat.capability.ts` defines a capability surface.

## Public Entry Points

- Exports the root module plus context, core, presentation, presentation/components, presentation/hooks, and providers subpaths.
- Export `.` resolves through `./src/index.ts`.
- Export `./context` resolves through `./src/context/index.ts`.
- Export `./core` resolves through `./src/core/index.ts`.
- Export `./presentation` resolves through `./src/presentation/index.ts`.
- Export `./presentation/components` resolves through `./src/presentation/components/index.ts`.
- Export `./presentation/hooks` resolves through `./src/presentation/hooks/index.ts`.
- Export `./providers` resolves through `./src/providers/index.ts`.

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
- Agentic workflows — subagents, memory tools, and next steps.
- Vnext ai-native.
- Backend operations + frontend rendering support.
- Use browser-safe MCP client stub in client bundles.
- Add changesets and apply pending fixes.

## Notes

- Depends on `lib.ai-agent`, `lib.ai-providers`, `lib.contracts-spec`, `lib.schema`, `lib.metering`, `lib.cost-tracking`, `lib.surface-runtime`.
- React peer dependency (>=19.2.4); changes here affect all chat surfaces.
- Metering and cost-tracking are wired in -- never bypass them.
