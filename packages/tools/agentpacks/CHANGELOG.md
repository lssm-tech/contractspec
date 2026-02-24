# agentpacks

## 0.7.0

### Minor Changes

- chore: release improvements

## 0.6.0

### Minor Changes

- 1babbdb: Improve Cursor support by updating plugin export and target generation to match Cursor plugin conventions.

  This adds `.cursor-plugin/plugin.json` manifests, richer pack metadata support, hook and MCP export compatibility, and stronger tests/documentation for Cursor plugin packaging.

## 0.5.0

### Minor Changes

- bae3db1: fix: build issues

## 0.4.0

### Minor Changes

- f31e457: Phase 3 — Community features for agentpacks registry:
  - **Reviews & Ratings**: `reviews` table, GET/POST/DELETE endpoints, one review per user per pack (upsert), cached average_rating + review_count, self-review prevention
  - **Organizations**: `organizations` + `org_members` tables, CRUD + member management routes, role hierarchy (owner > admin > member), `@org/pack-name` scoped name parsing
  - **Quality Scoring**: Automated 0-100 score (README, versions, license, targets, features, tags, repo, homepage, conflicts), GET /packs/:name/quality endpoint with breakdown, badge classification
  - **Website**: Star ratings + quality badges on pack cards, reviews section + quality breakdown on pack detail page, API client extended
  - **DB Migration**: `0002_community.sql` — 3 new tables, 3 new columns on packs
  - **Tests**: 54 new tests (133 total registry-packs, 511 total project)

- b6a92f3: Add models feature, pack registry support, and registry CLI commands.

  **Models feature** (9th feature type):
  - `models.json` pack format with default/small model, profiles, providers, per-agent assignments, and routing rules
  - Profile resolver with target-specific overrides
  - OpenCode target: native `opencode.json` model/provider/agent config
  - Cursor target: `.cursor/rules/model-config.mdc` guidance rule
  - Claude Code / Copilot / generic targets: model guidance markdown
  - Secret scanning to block credentials in published packs

  **Pack registry client**:
  - `agentpacks search` — search registry with tag/target/sort filters
  - `agentpacks info <pack>` — detailed pack info and versions
  - `agentpacks publish` — validate, tarball, and upload packs
  - `agentpacks login` — store registry auth token
  - `registry:name[@version]` source type in `agentpacks.jsonc`
  - Registry source resolver with lockfile integration

  **Registry server** (`@contractspec/app.registry-packs`):
  - Elysia + Drizzle/SQLite API server
  - Pack CRUD, version management, full-text search, download tracking
  - Bearer token auth, local tarball storage

- 4f6f938: Phase 3b — Ecosystem features for agentpacks registry:
  - **Dependency Graph**: DependencyService with BFS transitive closure, Mermaid diagram generation, circular dependency detection, GET /packs/:name/dependencies (JSON + Mermaid), GET /packs/:name/dependents (reverse lookup), dependency visualization on pack detail page
  - **Webhooks**: webhooks + webhook_deliveries tables, WebhookService with CRUD + HMAC signing + dispatch + delivery logging, webhook management routes, fire-and-forget dispatch on publish
  - **GitHub App**: GitHubService with HMAC-SHA256 signature verification, auto-publish on release tags, POST /github/webhook endpoint, configurable via GITHUB_WEBHOOK_SECRET + GITHUB_REPO_PACK_MAP
  - **PostgreSQL**: schema-pg.ts mirror (pgTable, jsonb, serial, boolean), drizzle-pg.config.ts, dual-driver client.ts (DB_DRIVER=sqlite|pg), pg.Pool connection pooling, scripts/migrate-sqlite-to-pg.ts
  - **DB Migration**: 0003_webhooks.sql — 2 new tables, 2 indexes
  - **Tests**: 44 new tests (177 total registry-packs, 555 total project)

- bda7a82: feat(registry-packs,agentpacks): Phase 4 production hardening

  **Rate Limiting & Security:**
  - In-memory token bucket rate limiter (100 req/min general, 10 req/min publish)
  - 10MB tarball size limit with 413 Payload Too Large response
  - Pack name squatting prevention (reserved names, format validation)
  - Pack deprecation via POST /packs/:name/deprecate (owner-only)
  - DB migration 0004_deprecation.sql

  **E2E Tests:**
  - Full publish → search → info → download → deprecate E2E test suite
  - CI pipeline hardened with registry-packs test step

  **Pack Versioning Polish:**
  - Auto-bump version on publish (version="auto" → patch bump from latest)
  - Model ID allowlist validation (advisory warnings for unknown model IDs)
  - Profile inheritance via `extends` keyword with cycle detection
  - 82 new tests (637 total: 402 agentpacks + 235 registry-packs)

- c83c323: feat: major change to content generation

### Patch Changes

- 1e7ebd0: Hard-cut over ContractSpec workspace agent configuration management to `agentpacks`.
  - add CI checks for pack validation and generated-config drift (`agentpacks:validate`, `agentpacks:diff`)
  - remove legacy `.rulesync/` and `rulesync.jsonc` sources from the repository
  - remove legacy `packs/default` fallback after successful soft-cutover validation
  - simplify root scripts to use `agentpacks:*` directly

- 4d19382: fix: stabilize lint and tests after voice capability migration
  - remove strict-lint violations across registry-packs, support-bot, video-gen, and agentpacks
  - align voice provider tests and pocket-family-office blueprint with the `ai.voice.tts` capability key
  - keep agentpacks package exports in sync by exposing `./utils/model-allowlist`

## 0.3.0

### Minor Changes

- chore: improve documentation

## 0.2.0

### Minor Changes

- 1b45037: feat: add agentpacks - composable AI agent configuration manager

  Introduces `agentpacks`, a pack-based CLI tool that syncs AI agent rules, commands, skills, hooks, plugins, and MCP configs across OpenCode, Cursor, Claude Code, Codex CLI, Gemini CLI, GitHub Copilot, and more.

  Key features:
  - **Composable packs**: group rules, commands, agents, skills, hooks, plugins, MCP, and ignore patterns into toggleable units
  - **6 target generators**: OpenCode (first-class JS/TS plugin support), Cursor (.mdc rules), Claude Code, Codex CLI, Gemini CLI, GitHub Copilot
  - **Auto AGENTS.md**: universal overview file generated from root rules
  - **Rulesync import**: migrate existing `.rulesync/` directories with `agentpacks import --from rulesync`
  - **Pack management**: create, list, validate packs via `agentpacks pack` subcommands
  - **Feature merging**: additive merge with first-wins conflict resolution and warnings

- 12c9556: feat: release agentpacks
