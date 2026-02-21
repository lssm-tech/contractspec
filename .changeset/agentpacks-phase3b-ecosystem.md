---
'agentpacks': minor
---

Phase 3b — Ecosystem features for agentpacks registry:

- **Dependency Graph**: DependencyService with BFS transitive closure, Mermaid diagram generation, circular dependency detection, GET /packs/:name/dependencies (JSON + Mermaid), GET /packs/:name/dependents (reverse lookup), dependency visualization on pack detail page
- **Webhooks**: webhooks + webhook_deliveries tables, WebhookService with CRUD + HMAC signing + dispatch + delivery logging, webhook management routes, fire-and-forget dispatch on publish
- **GitHub App**: GitHubService with HMAC-SHA256 signature verification, auto-publish on release tags, POST /github/webhook endpoint, configurable via GITHUB_WEBHOOK_SECRET + GITHUB_REPO_PACK_MAP
- **PostgreSQL**: schema-pg.ts mirror (pgTable, jsonb, serial, boolean), drizzle-pg.config.ts, dual-driver client.ts (DB_DRIVER=sqlite|pg), pg.Pool connection pooling, scripts/migrate-sqlite-to-pg.ts
- **DB Migration**: 0003_webhooks.sql — 2 new tables, 2 indexes
- **Tests**: 44 new tests (177 total registry-packs, 555 total project)
