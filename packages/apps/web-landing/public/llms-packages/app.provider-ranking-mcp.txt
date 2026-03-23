# @contractspec/app.provider-ranking-mcp

**MCP server that exposes provider-ranking operations and resources for benchmark ingestion, ranking refreshes, and leaderboard queries.**

## What It Does

- Hosts a ContractSpec MCP server over provider-ranking contracts and runtime registries.
- Exposes benchmark ingest, custom benchmark run, and ranking refresh operations.
- Publishes leaderboard and model-profile resources backed by the ranking store.
- Enriches incomplete ranking data with metadata from `@contractspec/lib.ai-providers`.

## Running Locally

From `packages/apps/provider-ranking-mcp`:
- `bun run dev`
- `bun run start`
- `bun run build`

## Usage

```bash
bun run dev
```

## Architecture

- `src/server.ts` boots the MCP server and transport wiring.
- `src/index.ts` exposes the package entrypoints for reuse or embedding.
- The server composes provider-ranking contracts, module orchestration, and MCP resource/tool exposure.

## Public Entry Points

- Exports `.` and `./server` for embedding or direct server startup.
- Primary MCP surfaces are benchmark-ingest tools, ranking refresh tools, leaderboard resources, and model-profile resources.
- Export `.` resolves through `./dist/index.mjs`.
- Export `./server` resolves through `./dist/server.mjs`.
- Export `./*` resolves through `./*`.

## Local Commands

- `bun run dev` — tsdown --watch
- `bun run start` — node dist/server.js
- `bun run build` — tsdown
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run clean` — rm -rf dist

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add latest models and align defaults.
- Resolve lint, build, and type errors across nine packages.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- The current implementation uses an in-memory store; restart the process to clear rankings and benchmark results.
