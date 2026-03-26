# @contractspec/app.registry-packs

Website: https://agentpacks.dev

**Agentpacks registry server for pack publishing, discovery, reviews, dependency graphs, and MCP access.**

## What It Does

- Hosts the pack registry API, MCP layer, artifact storage, and publishing workflows.
- Supports versioning, reviews, organizations, quality scoring, GitHub integration, and webhooks.
- Supports both SQLite and PostgreSQL deployment paths with rate-limiting and auth middleware.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.
- `src/routes/` contains HTTP or API route definitions.
- `src/services/` contains business logic services and workflows.

## Running Locally

From `packages/apps/registry-packs`:
- `bun run dev`
- `bun run start`
- `bun run build`
- `bun run test`

## Usage

```bash
bun run dev
```

## Architecture

- `src/routes/` owns HTTP endpoints for packs, versions, publishing, organizations, dependencies, and GitHub flows.
- `src/services/` contains business workflows for registry operations, search, scoring, reviews, and webhooks.
- `src/mcp/` exposes registry tools, prompts, and resources over the MCP protocol.
- `src/db/`, `src/storage/`, `src/auth/`, and `src/middleware/` hold persistence and platform adapters.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/server.ts` is the main server bootstrap entrypoint.

## Public Entry Points

- Deployable API app with HTTP routes, MCP tools/prompts/resources, and registry publishing flows.
- Primary public surface is the HTTP route tree under `src/routes/`.
- This app exposes MCP-facing tools, prompts, resources, or transport handlers.

## Local Commands

- `bun run dev` — bun run --watch src/index.ts
- `bun run start` — bun run ./dist/index.js
- `bun run build` — bun build --minify-whitespace --minify-syntax --target bun --outfile dist/index.js src/index.ts
- `bun run test` — bun test --pass-with-no-tests
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run db:generate` — drizzle-kit generate
- `bun run db:migrate` — drizzle-kit migrate
- `bun run db:studio` — drizzle-kit studio
- `bun run clean` — rm -rf dist
- `bun run db:generate:pg` — drizzle-kit generate --config=drizzle-pg.config.ts
- `bun run db:migrate:pg` — drizzle-kit migrate --config=drizzle-pg.config.ts
- `bun run db:seed` — bun run src/db/seed.ts

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint and build errors in workspace bundle and integrations lib.
- Test runner.
- Resolve lint/test regressions after voice capability updates.
- Phase 4 production hardening — rate limiting, security, E2E tests, versioning polish.
- Add dependency graph, webhooks, GitHub App, and PostgreSQL support (Phase 3b).

## Notes

- REST API routes are consumed by external clients — do not change paths or response shapes without versioning.
- MCP tool schemas are a protocol contract — coordinate changes with MCP clients.
- Database migrations must be backwards-compatible.
