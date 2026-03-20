# @contractspec/app.alpic-mcp

Website: https://contractspec.io

**MCP (Model Context Protocol) server for Alpic. Exposes ContractSpec documentation and tooling to AI agents via the MCP standard.**

## What It Does

- Uses `@contractspec/bundle.alpic` for Alpic business logic.
- Uses `@contractspec/lib.logger` for structured logging.
- Built with tsdown; runs as a Node.js server.
- Related ContractSpec packages include `@contractspec/bundle.alpic`, `@contractspec/lib.logger`, `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Running Locally

From `packages/apps/alpic-mcp`:
- `bun run dev`
- `bun run start`
- `bun run build`

## Usage

```bash
bun run dev
```

## Architecture

- Uses `@contractspec/bundle.alpic` for Alpic business logic.
- Uses `@contractspec/lib.logger` for structured logging.
- Built with tsdown; runs as a Node.js server.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/server.ts` is the main server bootstrap entrypoint.

## Public Entry Points

- Export `.` resolves through `./dist/index.mjs`.
- Export `./server` resolves through `./dist/server.mjs`.
- Export `./*` resolves through `./*`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- MCP protocol compliance is critical — do not break tool/resource schemas.
- Keep server startup fast; defer heavy initialization.
