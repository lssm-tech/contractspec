# @contractspec/lib.contracts-runtime-server-mcp

**MCP server runtime adapters for ContractSpec contracts.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, CLI, VS Code extension.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.

## Installation

`npm install @contractspec/lib.contracts-runtime-server-mcp`

or

`bun add @contractspec/lib.contracts-runtime-server-mcp`

## Usage

Import the root entrypoint from `@contractspec/lib.contracts-runtime-server-mcp`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.
- `src/provider-mcp.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./mcp/createMcpServer` resolves through `./src/mcp/createMcpServer.ts`.
- Export `./mcp/mcpTypes` resolves through `./src/mcp/mcpTypes.ts`.
- Export `./mcp/registerPresentations` resolves through `./src/mcp/registerPresentations.ts`.
- Export `./mcp/registerPrompts` resolves through `./src/mcp/registerPrompts.ts`.
- Export `./mcp/registerResources` resolves through `./src/mcp/registerResources.ts`.
- Export `./mcp/registerTools` resolves through `./src/mcp/registerTools.ts`.
- Export `./provider-mcp` resolves through `./src/provider-mcp.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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
- Add changesets and apply pending fixes.

## Notes

- MCP protocol compliance is critical; transport layer must stay spec-compliant.
- Do not introduce runtime-specific (Node/browser) dependencies in the transport layer.
