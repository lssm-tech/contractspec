# AI Agent Guide — `@contractspec/app.registry-packs`

Scope: `packages/apps/registry-packs/*`

Agentpacks registry server for pack publishing, discovery, reviews, dependency graphs, and MCP access.

## Quick Context

- Layer: `app`.
- Package visibility: published package.
- Primary consumers are deployed users, operators, or external clients of this app surface.

## Architecture

- `src/routes/` owns HTTP endpoints for packs, versions, publishing, organizations, dependencies, and GitHub flows.
- `src/services/` contains business workflows for registry operations, search, scoring, reviews, and webhooks.
- `src/mcp/` exposes registry tools, prompts, and resources over the MCP protocol.
- `src/db/`, `src/storage/`, `src/auth/`, and `src/middleware/` hold persistence and platform adapters.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/server.ts` is the main server bootstrap entrypoint.

## Public Surface

- Deployable API app with HTTP routes, MCP tools/prompts/resources, and registry publishing flows.
- Primary public surface is the HTTP route tree under `src/routes/`.
- This app exposes MCP-facing tools, prompts, resources, or transport handlers.

## Guardrails

- HTTP routes and MCP schemas are external contracts; version them rather than changing them in place.
- Database migrations must remain compatible with deployed registries and existing artifacts.
- Security controls such as auth, rate limiting, and reserved-name enforcement are core behavior, not optional polish.

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
