# AI Agent Guide — `registry-packs`

Scope: `packages/apps/registry-packs/*`

MCP packs registry server. Hosts, searches, and distributes agent packs with versioning, reviews, quality scoring, and GitHub integration.

## Quick Context

- **Layer**: app (API server)
- **Consumers**: MCP clients, CLI tools, web UI

## Architecture

- Built with Elysia (Bun HTTP framework) + Drizzle ORM
- Supports SQLite (default) and PostgreSQL via dual schema configs
- MCP integration via `@modelcontextprotocol/sdk` (tools, prompts, resources)
- Auth via token-based middleware; rate limiting included
- Optional S3 storage for pack artifacts

## Key Files

- `src/index.ts` — App entry point
- `src/server.ts` — Elysia server setup
- `src/routes/` — REST endpoints (packs, versions, publish, reviews, orgs, deps, GitHub, webhooks)
- `src/services/` — Business logic (pack, version, search, quality, review, GitHub, webhook, org, stats, dependency)
- `src/mcp/` — MCP handler, tools, prompts, resources
- `src/db/` — Drizzle schema, client, seed
- `src/auth/` — Token auth middleware
- `src/storage/` — Artifact storage (local, S3, factory)

## Public Exports

N/A (deployable app)

## Guardrails

- REST API routes are consumed by external clients — do not change paths or response shapes without versioning
- MCP tool schemas are a protocol contract — coordinate changes with MCP clients
- Database migrations must be backwards-compatible

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Start: `bun run start`
- Test: `bun test`
- Lint: `bun run lint`
- DB migrate: `bun run db:migrate`
- DB seed: `bun run db:seed`
- DB studio: `bun run db:studio`
