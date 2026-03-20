# AI Agent Guide — `@contractspec/app.api-library`

Scope: `packages/apps/api-library/*`

Library API server for ContractSpec documentation, templates, and MCP servers. Thin HTTP layer over `bundle.library`.

## Quick Context

- Layer: `app`.
- Package visibility: private workspace package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/bundle.library`, `@contractspec/bundle.marketing`, `@contractspec/bundle.workspace`, `@contractspec/integration.providers-impls`, `@contractspec/integration.runtime`, `@contractspec/lib.contracts-spec`, ...

## Architecture

- This app is a thin HTTP layer — all business logic lives in `bundle.library`.
- Elysia server with MCP endpoint integration.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- This package is a deployable application rather than a library with published subpath exports.

## Guardrails

- Keep this app thin — no business logic here; delegate to `bundle.library`.
- MCP handler changes may affect VS Code extension and CLI consumers.
- API route changes require coordinating with `app.web-landing` and any external clients.
- Changes here can affect downstream packages such as `@contractspec/bundle.library`, `@contractspec/bundle.marketing`, `@contractspec/bundle.workspace`, `@contractspec/integration.providers-impls`, `@contractspec/integration.runtime`, `@contractspec/lib.contracts-spec`, ....

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
