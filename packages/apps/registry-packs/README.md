# @contractspec/app.registry-packs

Website: https://contractspec.io/

**MCP packs registry API server**

Elysia HTTP server that provides the MCP packs registry: pack discovery, publishing, versions, reviews, orgs, webhooks, and MCP endpoint. Initializes a Drizzle-backed database (PostgreSQL) before starting.

## Installation / Running

From the monorepo root:

```bash
bun install
bun run dev --filter=@contractspec/app.registry-packs
```

Or from this directory:

```bash
bun install
bun run dev
```

Default port: `8091` (override with `PORT`).

## Database

- **Drizzle ORM** — Schema and migrations in `src/db/`
- `bun run db:generate` — Generate migrations
- `bun run db:migrate` — Run migrations
- `bun run db:studio` — Open Drizzle Studio
- `bun run db:seed` — Seed database

## Entry Point

- `src/index.ts` — Calls `initDb()` then `startServer()` from `src/server.ts`

## Routes

- `/health` — Health check
- `/packs` — List packs, pack detail, publish
- `/packs/:name/versions` — Versions, download, delete
- `/packs/:name/reviews`, `/packs/:name/quality`, `/packs/:name/dependencies`
- `/featured`, `/tags`, `/targets/:targetId`, `/stats`
- `/orgs`, `/orgs/:name/members`
- `/mcp` — MCP handler for registry queries
