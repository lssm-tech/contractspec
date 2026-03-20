# @contractspec/bundle.library

**Shared library bundle that composes docs, templates, integrations, MCP implementations, and reusable presentation surfaces.**

## What It Provides

- Provides the reusable product-facing bundle consumed by API, web, and documentation surfaces.
- Aggregates docs pages, integration marketplace UI, templates, and library-side MCP implementations.
- Acts as the main composition layer between lower-level libraries and app-specific delivery shells.
- `src/presentation/` contains presentation-layer components and renderers.

## Installation

`npm install @contractspec/bundle.library`

or

`bun add @contractspec/bundle.library`

## Usage

Import the root entrypoint from `@contractspec/bundle.library`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/application/` contains application services including MCP implementations and cross-surface orchestration.
- `src/components/` contains reusable docs, integrations, legal, shell, and template presentation code.
- `src/features/`, `src.config/`, `src.infrastructure/`, and `src.libs/` hold bundle-local composition helpers.
- `src/presentation/` contains feature-specific UI composition exported to consuming apps.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Large multi-subpath bundle exporting docs, integrations, templates, shell layout, email helpers, and MCP application surfaces.
- Export `.` resolves through `./src/index.ts`.
- Export `./application` resolves through `./src/application/index.ts`.
- Export `./application/context-storage` resolves through `./src/application/context-storage/index.ts`.
- Export `./application/mcp` resolves through `./src/application/mcp/index.ts`.
- Export `./application/mcp/cliMcp` resolves through `./src/application/mcp/cliMcp.ts`.
- Export `./application/mcp/common` resolves through `./src/application/mcp/common.ts`.
- Export `./application/mcp/contractsMcp` resolves through `./src/application/mcp/contractsMcp.ts`.
- Export `./application/mcp/contractsMcpResources` resolves through `./src/application/mcp/contractsMcpResources.ts`.
- Export `./application/mcp/contractsMcpTools` resolves through `./src/application/mcp/contractsMcpTools.ts`.
- Export `./application/mcp/contractsMcpTypes` resolves through `./src/application/mcp/contractsMcpTypes.ts`.
- The package publishes 297 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Package exports.
- Vnext ai-native.
- Add latest models and align defaults.
- Standardize tool naming to underscore notation.
- Add changesets and apply pending fixes.

## Notes

- This bundle is consumed by multiple apps — breaking export changes cascade widely.
- MCP server implementations must stay transport-agnostic (the app layer wires the transport).
- Keep side effects behind explicit adapters; do not perform I/O at import time.
