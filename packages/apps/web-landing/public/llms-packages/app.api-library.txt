# @contractspec/app.api-library

**Library API server for ContractSpec documentation, templates, and MCP servers. Thin HTTP layer over `bundle.library`.**

## What It Does

- This app is a thin HTTP layer — all business logic lives in `bundle.library`.
- Elysia server with MCP endpoint integration.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- Internal control-plane endpoints expose approval queues, trace inspection, policy explanation, skill registry actions, and dashboard summaries for operators.
- Related ContractSpec packages include `@contractspec/bundle.library`, `@contractspec/bundle.marketing`, `@contractspec/bundle.workspace`, `@contractspec/integration.provider.messaging`, `@contractspec/integration.runtime`, `@contractspec/lib.contracts-spec`, ...
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/apps/api-library`:
- `bun run dev`
- `bun run start`
- `bun run build`

## Usage

```bash
bun run dev
```

## Architecture

- This app is a thin HTTP layer — all business logic lives in `bundle.library`.
- Elysia server with MCP endpoint integration.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- This package is a deployable application rather than a library with published subpath exports.

## Local Commands

- `bun run dev` — bun run --watch src/index.ts
- `bun run start` — bun run ./dist/index.js
- `bun run build` — bun run build:types && bun run build:bundle
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run clean` — rm -rf dist api/dist
- `bun run build:bundle` — bun build --target node --packages bundle --outfile dist/index.js src/index.ts && mkdir -p api/dist && cp dist/index.js api/dist/index.js
- `bun run build:types` — tsc -p ./tsconfig.json --noEmit
- `bun run postinstall` — if [ "$VERCEL" = "1" ]; then bun run build:bundle; fi

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint, build, and type errors across nine packages.
- Expose contract management via CLI and MCP.
- Stabilize lint gate and runtime contract typing.
- Add ai-native messaging channel runtime.
- Inline server into index.ts and add Vercel configs.

## Notes

- Keep this app thin — no business logic here; delegate to `bundle.library`.
- MCP handler changes may affect VS Code extension and CLI consumers.
- API route changes require coordinating with `app.web-landing` and any external clients.
