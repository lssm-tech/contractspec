# AI Agent Guide — `@contractspec/app.alpic-mcp`

Scope: `packages/apps/alpic-mcp/*`

MCP (Model Context Protocol) server for Alpic. Exposes ContractSpec documentation and tooling to AI agents via the MCP standard.

## Quick Context

- Layer: `app`.
- Package visibility: published package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/bundle.alpic`, `@contractspec/lib.logger`, `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Architecture

- Uses `@contractspec/bundle.alpic` for Alpic business logic.
- Uses `@contractspec/lib.logger` for structured logging.
- Built with tsdown; runs as a Node.js server.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/server.ts` is the main server bootstrap entrypoint.

## Public Surface

- Export `.` resolves through `./dist/index.mjs`.
- Export `./server` resolves through `./dist/server.mjs`.
- Export `./*` resolves through `./*`.

## Guardrails

- MCP protocol compliance is critical — do not break tool/resource schemas.
- Keep server startup fast; defer heavy initialization.
- Changes here can affect downstream packages such as `@contractspec/bundle.alpic`, `@contractspec/lib.logger`, `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/bundle.alpic`, `@contractspec/lib.logger`, `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — tsdown --watch
- `bun run start` — node dist/server.js
- `bun run build` — tsdown && mkdir -p dist && cp -R assets dist/assets
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
