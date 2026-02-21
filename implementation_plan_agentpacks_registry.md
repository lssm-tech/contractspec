# agentpacks Registry — Implementation Plan

> Living document tracking the design, progress, and decisions for the agentpacks pack registry.
> Last updated: 2026-02-21

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [What Was Accomplished (agentpacks Tool)](#2-what-was-accomplished-agentpacks-tool)
3. [Registry Overview](#3-registry-overview)
4. [Architecture Decisions](#4-architecture-decisions)
5. [Data Model](#5-data-model)
6. [Model Configuration Feature](#6-model-configuration-feature)
7. [Phase 1 — MVP (Registry Server + CLI + Models)](#7-phase-1--mvp-registry-server--cli--models)
8. [Phase 2 — MCP + Website + Task Routing](#8-phase-2--mcp--website--task-routing)
9. [Phase 3 — Community + Ecosystem](#9-phase-3--community--ecosystem)
10. [Phase 4 — Production Hardening](#10-phase-4--production-hardening)
11. [File Inventory](#11-file-inventory)
12. [API Reference](#12-api-reference)
13. [CLI Commands Reference](#13-cli-commands-reference)
14. [Decision Log](#14-decision-log)
15. [Open Questions](#15-open-questions)
16. [Progress Tracker](#16-progress-tracker)

---

## 1. Project Summary

**agentpacks** is a standalone npm CLI tool for managing AI coding agent configurations across 20+ tools (Cursor, Claude Code, OpenCode, Copilot, Gemini, Codex, etc.). It supports 9 feature types — rules, commands, agents, skills, hooks, plugins, mcp, ignore, and **models** (for task-aware model selection by complexity, urgency, and budget). The **pack registry** extends agentpacks with a central hub for discovering, sharing, and installing packs — accessible via CLI, REST API, MCP tools, and a web UI.

| Attribute       | Value                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| Package name    | `agentpacks` (npm public, unscoped)                                          |
| Tool location   | `packages/tools/agentpacks/`                                                 |
| Registry app    | `packages/apps/registry-packs/`                                              |
| Repo root       | `/Users/tboutron/Documents/clients/lssm/monorepo-lssm/packages/contractspec` |
| Branch          | `release`                                                                    |
| Current version | `0.3.0`                                                                      |
| Test suite      | 637 tests / 62 files / 1321 assertions — all pass                            |

---

## 2. What Was Accomplished (agentpacks Tool)

### Phase 1 — Core Engine (commit `1b4503735`)

- Zod config schema (`agentpacks.jsonc`)
- 8 feature parsers: rules, commands, agents, skills, hooks, plugins, mcp, ignore
- Pack loader (reads `pack.json` + feature directories)
- Feature merger (additive rules, first-wins for same-name items, hook concat, dedup ignore)
- 7 core target generators: opencode, cursor, claude-code, codex-cli, gemini-cli, copilot, agents-md
- Rulesync importer (`agentpacks import --from rulesync`)
- CLI commands: `init`, `generate`, `import`, `pack create`, `pack list`, `pack validate`

### Phase 2 — Distribution (commits `ecda2c430`, `05992e46d`)

- Lockfile management (`agentpacks.lock` with integrity hashes)
- Git pack resolver (clone + checkout by ref)
- npm pack resolver (fetch + extract tarball)
- `install` command (resolves remote packs to `.agentpacks/.curated/`)
- `pack enable/disable` (toggle packs in config)
- Global mode (`~/.config/agentpacks/`)
- Monorepo baseDirs support

### Phase 3 — Advanced (commit `68ad25eb5`)

- Cursor plugin exporter (`src/exporters/cursor-plugin.ts`)
- Dependency resolver (Kahn's topological sort + cycle detection + conflict detection)
- `generate --diff` (preview changes before writing)
- Importers from Cursor, Claude Code, OpenCode configs
- 13 additional targets via generic factory (20 total)
- Metarepo support (multiple workspace configs)
- Programmatic API (`src/api.ts`)

### Test Suite (commit `936d5b833`)

- 247 tests across 31 files covering: core (6), features (8), sources (3), targets (3), exporters (1), importers (4), utils (5), CLI (1)

### Enterprise Pack Split (commit `5244277a4`)

- `packs/workspace-specific` — 9 rules, 1 command, 1 agent, 2 skills, 1 MCP
- `packs/software-best-practices` — 8 rules, 8 commands, 3 agents, 1 MCP, ignore
- `packs/contractspec-rules` — 6 rules, 3 commands, 2 agents, 1 skill, 1 MCP

### Hard Cutover + CI (commit `1e7ebd0a0`)

- `.github/workflows/agentpacks.yml` — validates packs + checks generated-config drift
- Removed `.rulesync/`, `rulesync.jsonc`, `packs/default/`, `rulesync` dependency
- Pushed to `origin/release`

---

## 3. Registry Overview

Four access surfaces for the same data:

| Surface  | Technology                | Location / Path                         | Phase |
| -------- | ------------------------- | --------------------------------------- | ----- |
| REST API | Elysia (Bun)              | `packages/apps/registry-packs/`         | 1     |
| CLI      | commander (in agentpacks) | `packages/tools/agentpacks/src/cli/`    | 1     |
| MCP      | MCP SDK + Elysia          | `packages/apps/registry-packs/src/mcp/` | 2     |
| Website  | Next.js                   | `packages/apps/web-landing/`            | 2     |

### Source type syntax

```jsonc
// agentpacks.jsonc
{
  "packs": [
    "./packs/local-pack", // local
    "git:github.com/org/repo#main", // git
    "npm:@scope/pack-name@^1.0.0", // npm
    "registry:typescript-best-practices@1.2.0", // NEW — registry
  ],
}
```

---

## 4. Architecture Decisions

| Decision                | Choice                                           | Rationale                                                                  |
| ----------------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| Server framework        | Elysia (Bun)                                     | Same as all other API servers in monorepo                                  |
| Database (Phase 1)      | SQLite via Drizzle ORM                           | Zero external deps, ships with Bun, fast local dev                         |
| Database (Phase 2+)     | PostgreSQL via Drizzle                           | Same ORM, swap connection string                                           |
| Storage (Phase 1)       | Local filesystem                                 | Tarballs in `./storage/packs/`                                             |
| Storage (Phase 2+)      | S3-compatible                                    | Cloudflare R2 or AWS S3                                                    |
| Auth                    | Bearer token                                     | Public read, token-authenticated publish                                   |
| Token storage (client)  | XDG config dir                                   | `~/.config/agentpacks/credentials.json`                                    |
| MCP pattern             | Pattern B (direct SDK)                           | Same as `alpic-mcp`, simpler than Pattern A                                |
| Pack integrity          | `sha256-<hex>`                                   | Same format as lockfile integrity hashes                                   |
| New app (not extending) | `packages/apps/registry-packs/`                  | Existing `registry-server` is filesystem-based, different concern          |
| Port                    | 8091                                             | 8090 taken by registry-server, 8081 by api-library                         |
| Models feature format   | JSON (`models.json`)                             | Structured data, same parsing style as `mcp.json` and `hooks.json`         |
| Profile activation      | `modelProfile` in workspace config               | Declarative switching across packs without runtime state                   |
| Cursor model strategy   | Guidance rule (`.cursor/rules/model-config.mdc`) | Cursor model config is UI-driven, rule provides deterministic guidance     |
| Credentials in models   | Forbidden in packs                               | Registry packs are public/shareable; secrets must stay in env/tool auth    |
| Agent `model` handling  | Fix passthrough + models precedence              | Existing frontmatter has dead fields; `models` feature overrides conflicts |

---

## 5. Data Model

### `packs` table (RegistryPack)

| Column          | Type        | Constraints         | Description                    |
| --------------- | ----------- | ------------------- | ------------------------------ |
| name            | TEXT        | PK, unique slug     | `my-awesome-pack`              |
| displayName     | TEXT        | NOT NULL            | Human-readable name            |
| description     | TEXT        | NOT NULL            | One-line description           |
| longDescription | TEXT        | nullable            | README markdown                |
| authorName      | TEXT        | NOT NULL            | Author name                    |
| authorEmail     | TEXT        | nullable            | Author email                   |
| authorUrl       | TEXT        | nullable            | Author URL                     |
| authorAvatarUrl | TEXT        | nullable            | Author avatar                  |
| license         | TEXT        | default `"MIT"`     | SPDX identifier                |
| homepage        | TEXT        | nullable            | Homepage URL                   |
| repository      | TEXT        | nullable            | Git repo URL                   |
| tags            | TEXT (JSON) | default `[]`        | `["typescript", "testing"]`    |
| targets         | TEXT (JSON) | default `[]`        | `["cursor", "claudecode"]`     |
| features        | TEXT (JSON) | default `[]`        | `["rules", "commands", "mcp"]` |
| dependencies    | TEXT (JSON) | default `[]`        | Pack dependency names          |
| conflicts       | TEXT (JSON) | default `[]`        | Conflicting pack names         |
| downloads       | INTEGER     | default 0           | Total download count           |
| weeklyDownloads | INTEGER     | default 0           | Rolling 7-day downloads        |
| featured        | INTEGER     | default 0 (boolean) | Curated pack flag              |
| verified        | INTEGER     | default 0 (boolean) | Verified publisher flag        |
| createdAt       | TEXT        | ISO 8601            | First publish timestamp        |
| updatedAt       | TEXT        | ISO 8601            | Last update timestamp          |

### `pack_versions` table (RegistryPackVersion)

| Column         | Type        | Constraints         | Description                                                      |
| -------------- | ----------- | ------------------- | ---------------------------------------------------------------- |
| id             | INTEGER     | PK, autoincrement   | Internal ID                                                      |
| packName       | TEXT        | FK → packs.name     | Parent pack                                                      |
| version        | TEXT        | NOT NULL            | Semver string                                                    |
| integrity      | TEXT        | NOT NULL            | `sha256-<hex>`                                                   |
| tarballUrl     | TEXT        | NOT NULL            | Download path                                                    |
| tarballSize    | INTEGER     | NOT NULL            | Bytes                                                            |
| packManifest   | TEXT (JSON) | NOT NULL            | `pack.json` snapshot                                             |
| fileCount      | INTEGER     | default 0           | Files in tarball                                                 |
| featureSummary | TEXT (JSON) | NOT NULL            | `{ rules: 5, commands: 3, models: true, modelProfiles: 2, ... }` |
| changelog      | TEXT        | nullable            | Version changelog                                                |
| createdAt      | TEXT        | ISO 8601            | Publish timestamp                                                |
| UNIQUE         |             | (packName, version) |                                                                  |

### `pack_readmes` table (RegistryPackReadme)

| Column       | Type | Constraints         | Description             |
| ------------ | ---- | ------------------- | ----------------------- |
| packName     | TEXT | PK, FK → packs.name | Parent pack             |
| content      | TEXT | NOT NULL            | Raw markdown            |
| renderedHtml | TEXT | nullable            | Pre-rendered HTML cache |

### `auth_tokens` table

| Column    | Type    | Constraints         | Description           |
| --------- | ------- | ------------------- | --------------------- |
| id        | INTEGER | PK, autoincrement   | Internal ID           |
| token     | TEXT    | UNIQUE, NOT NULL    | Hashed bearer token   |
| username  | TEXT    | NOT NULL            | Token owner           |
| scope     | TEXT    | default `"publish"` | Permission scope      |
| createdAt | TEXT    | ISO 8601            | Creation timestamp    |
| expiresAt | TEXT    | nullable            | Expiry (null = never) |

---

## 6. Model Configuration Feature

Add a new first-class `models` feature to support model selection by task context (complexity, urgency, budget), with strongest output support for OpenCode and Cursor.

### 6.1 Scope and Goals

- New feature type: `models` (becomes feature #9 after rules, commands, agents, skills, hooks, plugins, mcp, ignore)
- Source file in packs: `models.json` (JSON-based feature parser)
- Solve two problems:
  - static model defaults and per-agent model assignment
  - dynamic profile/routing guidance for task-dependent choices
- Keep it safe for public registries: no credentials allowed in model configs

### 6.2 `models.json` Schema (pack format)

```jsonc
{
  "default": "anthropic/claude-sonnet-4-5",
  "small": "anthropic/claude-haiku-4-5",
  "agents": {
    "build": { "model": "anthropic/claude-opus-4-5", "temperature": 0.3 },
    "plan": { "model": "anthropic/claude-sonnet-4-5", "temperature": 0.1 },
    "explore": { "model": "anthropic/claude-haiku-4-5" },
  },
  "profiles": {
    "quality": {
      "description": "Maximum quality, higher cost",
      "default": "anthropic/claude-opus-4-5",
      "small": "anthropic/claude-sonnet-4-5",
    },
    "budget": {
      "description": "Cost-effective for most tasks",
      "default": "anthropic/claude-sonnet-4-5",
      "small": "anthropic/claude-haiku-4-5",
    },
    "fast": {
      "description": "Lowest latency",
      "default": "anthropic/claude-haiku-4-5",
      "small": "anthropic/claude-haiku-4-5",
    },
  },
  "providers": {
    "anthropic": {
      "options": { "timeout": 600000 },
      "models": {
        "claude-sonnet-4-5": {
          "options": {
            "thinking": { "type": "enabled", "budgetTokens": 16000 },
          },
          "variants": {
            "high": {
              "thinking": { "type": "enabled", "budgetTokens": 32000 },
            },
            "low": { "thinking": { "type": "enabled", "budgetTokens": 8000 } },
          },
        },
      },
    },
  },
  "routing": [
    { "when": { "complexity": "high", "urgency": "low" }, "use": "quality" },
    { "when": { "complexity": "low", "urgency": "high" }, "use": "fast" },
    { "when": { "budget": "limited" }, "use": "budget" },
  ],
  "overrides": {
    "opencode": { "default": "opencode/claude-sonnet-4-5" },
    "cursor": { "default": "cursor:claude-sonnet-4-5" },
  },
}
```

### 6.3 Workspace Config Extension

```jsonc
{
  "packs": ["./packs/workspace-specific"],
  "features": ["*"],
  "modelProfile": "quality",
}
```

`modelProfile` selects the active profile from merged `models.json` data.

### 6.4 Target Mapping

| Target             | Output                                | Behavior                                                              |
| ------------------ | ------------------------------------- | --------------------------------------------------------------------- |
| OpenCode           | `opencode.json`                       | Write/merge `model`, `small_model`, `provider.*`, and `agent.*.model` |
| Cursor             | `.cursor/rules/model-config.mdc`      | Generate always-apply routing/model guidance rule                     |
| Claude Code        | `.claude/settings.json` + agent files | Pass through per-agent model metadata where supported                 |
| Copilot            | `.github/copilot/model-config.md`     | Generate guidance documentation                                       |
| Generic md targets | target-specific markdown file         | Generate human-readable model profile/routing recommendations         |

#### OpenCode generated output example

When `modelProfile` is `"quality"`, the OpenCode target merges models into `opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-opus-4-5",
  "small_model": "anthropic/claude-sonnet-4-5",
  "provider": {
    "anthropic": {
      "options": { "timeout": 600000 },
      "models": {
        "claude-sonnet-4-5": {
          "options": {
            "thinking": { "type": "enabled", "budgetTokens": 16000 },
          },
          "variants": {
            "high": {
              "thinking": { "type": "enabled", "budgetTokens": 32000 },
            },
            "low": { "thinking": { "type": "enabled", "budgetTokens": 8000 } },
          },
        },
      },
    },
  },
  "agent": {
    "build": { "model": "anthropic/claude-opus-4-5", "temperature": 0.3 },
    "plan": { "model": "anthropic/claude-sonnet-4-5", "temperature": 0.1 },
    "explore": { "model": "anthropic/claude-haiku-4-5" },
  },
  // ... existing mcp config merged here ...
}
```

#### Cursor generated output example

The Cursor target writes `.cursor/rules/model-config.mdc`:

```markdown
---
description: Model configuration and selection guidelines for this workspace
alwaysApply: true
---

# Model Configuration

Use the following model preferences when working in this project.

## Default Models

- **Primary model**: anthropic/claude-opus-4-5
- **Lightweight tasks** (titles, summaries): anthropic/claude-sonnet-4-5

## Agent Model Assignments

| Agent   | Model                       | Temperature |
| ------- | --------------------------- | ----------- |
| build   | anthropic/claude-opus-4-5   | 0.3         |
| plan    | anthropic/claude-sonnet-4-5 | 0.1         |
| explore | anthropic/claude-haiku-4-5  | —           |

## Available Profiles

| Profile | Description                   | Default Model               |
| ------- | ----------------------------- | --------------------------- |
| quality | Maximum quality, higher cost  | anthropic/claude-opus-4-5   |
| budget  | Cost-effective for most tasks | anthropic/claude-sonnet-4-5 |
| fast    | Lowest latency                | anthropic/claude-haiku-4-5  |
```

### 6.5 Merge and Precedence

- Base merge strategy:
  - `default`, `small`: first-pack-wins
  - `agents`: merge by name, first-pack-wins per agent
  - `profiles`: additive (unique name), first-pack-wins on name conflict
  - `providers`: deep merge by provider key, first-pack-wins on scalar conflicts
  - `routing`: additive with original order preserved
  - `overrides`: first-pack-wins per target key
- Activation strategy:
  1. Merge all `models` inputs
  2. Apply selected `modelProfile` overlay (if provided)
  3. Apply target-specific `overrides`
  4. Apply per-agent explicit target override from agent frontmatter only when not overridden by `models`

### 6.6 Security and Validation

- `models.json` must not contain secrets (`apiKey`, `token`, `secret`, `password`, private keys)
- `agentpacks pack validate` and `agentpacks publish` enforce secret checks
- Provider credentials remain external via env vars or tool-native auth (`/connect`, provider CLI login)

### 6.7 Backward Compatibility and Dead Field Fix

- Existing `AgentFrontmatter` already exposes `opencode.model` and `claudecode.model` but targets currently ignore them
- This work explicitly fixes passthrough in OpenCode/Cursor/Claude targets
- Precedence rule: `models` feature wins over agent frontmatter when both define a model

---

## 7. Phase 1 — MVP (Registry Server + CLI + Models)

### 7.1 Registry Server (`packages/apps/registry-packs/`)

#### 7.1.1 Project Scaffolding

- [x] Create `packages/apps/registry-packs/` directory
- [x] `package.json` with Elysia, Drizzle ORM, drizzle-kit, better-sqlite3 deps
- [x] `tsconfig.json` extending monorepo base
- [x] `drizzle.config.ts` pointing to SQLite file
- [x] `src/index.ts` — entry point with cluster fork
- [x] `src/server.ts` — Elysia app with route wiring (pattern from `registry-server/src/server.ts`)

#### 7.1.2 Database Layer

- [x] `src/db/schema.ts` — Drizzle table definitions (packs, pack_versions, pack_readmes, auth_tokens)
- [x] `src/db/client.ts` — SQLite connection singleton
- [x] `src/db/migrations/` — initial migration via drizzle-kit generate (bun:sqlite driver)
- [x] `src/db/seed.ts` — seed script with 5 example packs, versions, and READMEs

#### 7.1.3 Service Layer

- [x] `src/services/pack-service.ts` — CRUD operations for packs (get, list, create, update, delete)
- [x] `src/services/version-service.ts` — version management (create, list, get, delete)
- [x] `src/services/search-service.ts` — search with filters (q, tags, targets, features, author, sort)
- [x] `src/services/publish-service.ts` — publish logic kept inline in routes/publish.ts (pragmatic for MVP)
- [x] `src/services/stats-service.ts` — stats kept in search-service.ts (pragmatic for MVP)

#### 7.1.4 Storage Layer

- [x] `src/storage/types.ts` — storage interface (put, get, delete, exists)
- [x] `src/storage/local.ts` — filesystem storage (`./storage/packs/<name>/<version>.tgz`)

#### 7.1.5 Auth Layer

- [x] `src/auth/token.ts` — token generation, hashing (SHA-256), validation middleware
- [x] `src/auth/middleware.ts` — Elysia derive plugin for authenticated routes

#### 7.1.6 Route Handlers

- [x] `src/routes/packs.ts` — `GET /packs`, `GET /packs/:name`
- [x] `src/routes/versions.ts` — `GET /packs/:name/versions`, `GET /packs/:name/versions/:version`, `GET /packs/:name/versions/:version/download`
- [x] `src/routes/publish.ts` — `POST /packs` (authenticated)
- [x] `src/routes/featured.ts` — `GET /featured` (in server.ts)
- [x] `src/routes/tags.ts` — `GET /tags` (in server.ts)
- [x] `src/routes/targets.ts` — `GET /targets/:targetId` (in server.ts)
- [x] `src/routes/stats.ts` — `GET /stats` (in server.ts)

#### 7.1.7 Tests

- [x] Auth token utility tests (generateToken, hashToken)
- [x] Storage layer tests (LocalStorage put/get/delete/exists)
- [x] Service layer unit tests with in-memory SQLite (pack-service, version-service, search-service, auth)
- [x] Route handler integration tests via Elysia app.handle() + setDb()

### 7.2 CLI Extensions (`packages/tools/agentpacks/`)

#### 7.2.1 Registry Source Type

- [x] `src/sources/registry-ref.ts` — parse `registry:name[@version]` ref strings
- [x] `src/sources/registry.ts` — fetch pack from registry API, extract tarball, install to `.agentpacks/.curated/`
- [x] Update `src/sources/index.ts` to dispatch `registry:` prefix to registry resolver
- [x] Update `src/core/pack-loader.ts` to handle registry-sourced packs
- [x] Update `src/core/lockfile.ts` to store registry source entries

#### 7.2.2 New CLI Commands

- [x] `src/cli/search.ts` — `agentpacks search <query>` — table output (name, description, downloads, targets)
- [x] `src/cli/info.ts` — `agentpacks info <pack>` — pack details, versions, feature summary
- [x] `src/cli/publish.ts` — `agentpacks publish` — validate pack, create tarball, upload to registry
- [x] `src/cli/login.ts` — `agentpacks login` — prompt for token, store in `~/.config/agentpacks/credentials.json`
- [x] Register all new commands in `src/index.ts`

#### 7.2.3 Tarball Utilities

- [x] `src/utils/tarball.ts` — create tarball from pack dir, extract tarball, compute integrity hash
- [x] `src/utils/registry-client.ts` — HTTP client for registry API (search, info, download, publish)

#### 7.2.4 Tests

- [x] `test/sources/registry-ref.test.ts` — ref parsing tests
- [x] `test/sources/registry.test.ts` — registry resolver tests (mocked HTTP)
- [x] `test/cli/search.test.ts` — search command output
- [x] `test/cli/publish.test.ts` — publish flow
- [x] `test/utils/tarball.test.ts` — tarball create/extract
- [x] `test/utils/registry-client.test.ts` — API client tests

### 7.3 Models Feature Implementation (`packages/tools/agentpacks/`)

#### 7.3.1 Core Feature Plumbing

- [x] `src/features/models.ts` — parse and validate `models.json`
- [x] Export models parser/types from `src/features/index.ts`
- [x] Add `"models"` to `FEATURE_IDS` in `src/core/config.ts`
- [x] Add `modelProfile?: string` to `WorkspaceConfigSchema`
- [x] Add `models` to `LoadedPack` in `src/core/pack-loader.ts`
- [x] Add `models` to `MergedFeatures` + merge strategy in `src/core/feature-merger.ts`
- [x] Add `src/core/profile-resolver.ts` for active profile overlay resolution

#### 7.3.2 Target Generation

- [x] OpenCode target: generate `model`, `small_model`, provider options/variants, and per-agent model mapping in `opencode.json`
- [x] Cursor target: generate `.cursor/rules/model-config.mdc` (always apply guidance rule)
- [x] Claude Code target: propagate model guidance and supported model metadata in generated outputs
- [x] Copilot target: generate model guidance markdown
- [x] Generic targets: generate model guidance markdown where no native model config exists

#### 7.3.3 Agent Model Passthrough Fix

- [x] Update `AgentFrontmatter` with explicit `cursor` model override support
- [x] OpenCode target: stop dropping `agent.meta.opencode.model` and related options
- [x] Cursor target: include model hints in generated agent frontmatter when present
- [x] Claude Code target: serialize `agent.meta.claudecode.model` via model comment injection
- [x] Enforce precedence: `models` feature overrides per-agent frontmatter

#### 7.3.4 Security and Validation

- [x] Secret-pattern scanner for `models.json` (`apiKey`, `token`, `secret`, `password`, private key markers)
- [x] Wire scanner into `agentpacks pack validate`
- [x] Wire scanner into `agentpacks publish` (block publish on secret detection)

#### 7.3.5 Tests

- [x] `test/features/models.test.ts` — parser/schema/merge behavior
- [x] `test/core/profile-resolver.test.ts` — profile activation + precedence
- [x] `test/targets/models-targets.test.ts` — OpenCode, Cursor, Claude, Copilot model generation
- [x] `test/targets/cursor-models.test.ts` — generated model guidance rule (in models-targets.test.ts)
- [x] `test/targets/claude-models.test.ts` — passthrough behavior (in models-targets.test.ts)

### 7.4 Integration & CI

- [x] Add `registry-packs` to turbo pipeline (uses standard tasks, no override needed)
- [x] Update `.github/workflows/agentpacks.yml` to include registry tests
- [x] Changeset file for version bump
- [x] Update agentpacks `README.md` with registry + models documentation
- [ ] End-to-end test: publish → search → install → generate (requires live registry server)
- [x] End-to-end test: model profile switch (`modelProfile=quality|budget|fast`) updates generated target configs

---

## 8. Phase 2 — MCP + Website + Task Routing

### 8.1 MCP Integration (`packages/apps/registry-packs/src/mcp/`)

Pattern B (direct MCP SDK), same as `alpic-mcp`:

#### Tools

| Tool Name         | Parameters                     | Description                   |
| ----------------- | ------------------------------ | ----------------------------- |
| `search_packs`    | query, tags?, targets?, limit? | Search registry packs         |
| `get_pack_info`   | name                           | Get pack details + latest ver |
| `list_featured`   | limit?                         | List featured/curated packs   |
| `list_by_target`  | targetId, limit?               | Packs supporting a target     |
| `get_pack_readme` | name                           | Get pack README markdown      |

#### Resources

| URI Pattern               | Description           |
| ------------------------- | --------------------- |
| `registry://packs`        | All packs (paginated) |
| `registry://packs/{name}` | Single pack detail    |
| `registry://featured`     | Featured packs        |
| `registry://tags`         | All tags with counts  |

#### Prompts

| Prompt Name     | Parameters     | Description                             |
| --------------- | -------------- | --------------------------------------- |
| `suggest_packs` | project_desc   | Suggest packs for a project description |
| `compare_packs` | pack_a, pack_b | Compare two packs side-by-side          |

#### Tasks

- [ ] `src/mcp/handler.ts` — MCP server setup with tools, resources, prompts
- [ ] `src/mcp/tools.ts` — tool implementations
- [ ] `src/mcp/resources.ts` — resource providers
- [ ] `src/mcp/prompts.ts` — prompt templates
- [ ] Wire MCP endpoint into Elysia server (`/mcp`)
- [ ] MCP integration tests

### 8.2 Website Pages (`packages/apps/web-landing/`)

| Route                                   | Description                             |
| --------------------------------------- | --------------------------------------- |
| `/registry/packs`                       | Search/browse with filters              |
| `/registry/packs/[name]`                | Pack detail (README, versions, install) |
| `/registry/packs/[name]/versions/[ver]` | Version detail                          |
| `/registry/featured`                    | Curated showcase                        |
| `/registry/publish`                     | Publishing guide (static)               |

#### Tasks

- [ ] Shared API client lib for SSR/CSR data fetching
- [ ] `/registry/packs` — search page with tag/target filters, pagination
- [ ] `/registry/packs/[name]` — detail page with README render, version list, install snippet
- [ ] `/registry/packs/[name]/versions/[ver]` — version detail with manifest + changelog
- [ ] `/registry/featured` — curated grid with cards
- [ ] `/registry/publish` — static guide page

### 8.3 Storage Upgrade

- [ ] `src/storage/s3.ts` — S3-compatible storage implementation
- [ ] Config switch: `STORAGE_BACKEND=local|s3`
- [ ] Migration script for local → S3

### 8.4 Download Stats

- [ ] Daily download aggregation cron/worker
- [ ] Weekly rolling window calculation
- [ ] `/packs/:name/stats` endpoint (download trends)

### 8.5 Task-Aware Routing and Recommendation Engine

- [ ] Add routing schema evolution for richer conditions (`complexity`, `urgency`, `budget`, `contextWindowNeed`, `toolUseIntensity`)
- [ ] Generate routing guidance artifacts for OpenCode and Cursor from merged routing rules
- [ ] Add CLI preview command (or flag) to explain which profile a task would select
- [ ] Add registry search filters for packs that include routing rules (`has:routing`, `routing:budget`, etc.)

---

## 9. Phase 3 — Community + Ecosystem

### 9.1 Ratings & Reviews ✅

- [x] `reviews` table (packName, username, rating 1-5, comment, createdAt/updatedAt)
- [x] `GET /packs/:name/reviews`, `POST /packs/:name/reviews`, `DELETE /packs/:name/reviews`
- [x] One review per user per pack (upsert), self-review prevention
- [x] Cached `average_rating` (10x scaled) + `review_count` on packs table
- [x] Average rating + star display on pack cards
- [x] Reviews section on pack detail page

### 9.2 Organization Scopes ✅

- [x] `organizations` table + `org_members` table with role hierarchy
- [x] `@org/pack-name` scoped pack name parsing
- [x] Org CRUD + member management routes
- [x] Role-based access control (owner > admin > member)

### 9.3 Quality Scoring ✅

- [x] Automated pack quality score (0-100) based on:
  - Has README (+20), multiple versions (+10), license (+10)
  - Target coverage (+20 proportional, max 4), feature count (+15 proportional, max 5)
  - Has tags (+10), repository (+5), homepage (+5), no conflicts (+5)
- [x] `GET /packs/:name/quality` endpoint with full breakdown
- [x] Badge display on pack cards + quality breakdown on detail page

### 9.4 Dependency Graph ✅

- [x] `DependencyService` — BFS graph builder with transitive closure, max depth
- [x] Mermaid diagram generation from dependency graph
- [x] Circular dependency detection (DFS cycle finder)
- [x] `GET /packs/:name/dependencies` — JSON or Mermaid format
- [x] `GET /packs/:name/dependents` — reverse dependency lookup
- [x] Dependency visualization on pack detail page (website)

### 9.5 Webhooks & Automation ✅

- [x] `webhooks` + `webhook_deliveries` tables (migration `0003_webhooks.sql`)
- [x] `WebhookService` — CRUD, HMAC signing, dispatch with delivery logging
- [x] `GET/POST/DELETE /packs/:name/webhooks` — owner-only management
- [x] `GET /packs/:name/webhooks/:id/deliveries` — delivery history
- [x] Fire-and-forget dispatch wired into publish route
- [x] `GitHubService` — HMAC-SHA256 signature verification + auto-publish
- [x] `POST /github/webhook` — release event receiver, auto-publish on tag
- [x] Config via `GITHUB_WEBHOOK_SECRET` + `GITHUB_REPO_PACK_MAP` env vars

### 9.6 PostgreSQL Migration ✅

- [x] `schema-pg.ts` — full PG schema mirror (pgTable, jsonb, serial, boolean)
- [x] `drizzle-pg.config.ts` — Drizzle Kit config for PostgreSQL
- [x] `client.ts` dual-driver: `DB_DRIVER=sqlite|pg`, `initDb()` for async PG init
- [x] Connection pooling via `pg.Pool` with `DB_POOL_MAX`, `DB_POOL_IDLE_TIMEOUT`, `DB_POOL_CONNECT_TIMEOUT`
- [x] `scripts/migrate-sqlite-to-pg.ts` — one-time data migration script
- [x] `pg` as optional dependency, `@types/pg` as devDependency

---

## 10. Phase 4 — Production Hardening

Phase 4 hardens the registry for production use with security, testing, and versioning improvements.

### 4.1 — Rate Limiting & Security

| Feature                       | Details                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Rate Limiting**         | In-memory token bucket per IP. Default: 100 req/min general, 10 req/min publish. Configurable via `RATE_LIMIT_*` env vars. Returns `429 Too Many Requests` with `Retry-After` header. |
| **Pack Size Limits**          | 10MB max tarball upload. Enforced at publish route before storage write. Returns `413 Payload Too Large`.                                                                             |
| **Name Squatting Prevention** | Reserved names list (common, confusable, offensive). Minimum 2 chars. No `-` only or `_` only names. Validated at publish time. `reserved-names.ts` allowlist.                        |
| **Pack Deprecation**          | `deprecated` boolean + `deprecationMessage` text on packs table. `POST /packs/:name/deprecate` (authenticated, owner-only). Deprecated packs shown with warning in search/detail.     |

### 4.2 — E2E Tests

| Feature           | Details                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Full E2E Flow** | `test/e2e/publish-flow.test.ts` — publish tarball → search → get info → download → verify integrity. Uses live in-memory registry. |
| **CI Pipeline**   | Ensure `bun test` runs both unit and E2E tests. Validate all 555+ tests pass in CI.                                                |

### 4.3 — Pack Versioning Polish

| Feature                 | Details                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Auto-Bump Version**   | When publishing without explicit version, auto-bump patch from latest. `VersionService.getNextVersion()` with semver.                                        |
| **Model ID Allowlist**  | Validate model IDs against known provider patterns (e.g. `anthropic/claude-*`, `openai/gpt-*`, `google/gemini-*`). Warning on unknown models (not blocking). |
| **Profile Inheritance** | `extends` field on `ModelProfileSchema`. Profiles can inherit from parent profile and override specific fields. Resolved recursively with cycle detection.   |

---

## 11. File Inventory

### Registry Server (new: `packages/apps/registry-packs/`)

```
packages/apps/registry-packs/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── AGENTS.md
├── src/
│   ├── index.ts                    # Entry point (cluster fork)
│   ├── server.ts                   # Elysia app + route wiring
│   ├── db/
│   │   ├── schema.ts              # Drizzle table defs (10 tables)
│   │   ├── schema-pg.ts           # PostgreSQL mirror schema
│   │   ├── client.ts              # Dual-driver (SQLite + PG)
│   │   ├── seed.ts                # Optional seed data
│   │   └── migrations/
│   │       ├── 0000_conscious_skin.sql
│   │       ├── 0001_download_stats.sql
│   │       ├── 0002_community.sql  # reviews, orgs, quality cols
│   │       ├── 0003_webhooks.sql   # webhooks + deliveries
│   │       └── 0004_deprecation.sql # deprecated + deprecation_message
│   ├── routes/
│   │   ├── packs.ts               # GET /packs, /packs/:name, /stats
│   │   ├── versions.ts            # GET /packs/:name/versions[/:ver]
│   │   ├── publish.ts             # POST /packs + webhook dispatch
│   │   ├── reviews.ts             # GET/POST/DELETE /packs/:name/reviews
│   │   ├── orgs.ts                # CRUD /orgs, /orgs/:name/members
│   │   ├── webhooks.ts            # CRUD /packs/:name/webhooks
│   │   ├── dependencies.ts        # GET /packs/:name/dependencies, /dependents
│   │   ├── github.ts              # POST /github/webhook
│   │   └── deprecation.ts        # POST /packs/:name/deprecate
│   ├── services/
│   │   ├── pack-service.ts        # Pack CRUD
│   │   ├── version-service.ts     # Version management
│   │   ├── search-service.ts      # Search + filters
│   │   ├── stats-service.ts       # Download tracking
│   │   ├── review-service.ts      # Reviews + rating cache
│   │   ├── quality-service.ts     # Quality scoring (0-100)
│   │   ├── org-service.ts         # Org + member management
│   │   ├── dependency-service.ts  # Graph builder + Mermaid + cycles
│   │   ├── webhook-service.ts     # Webhook CRUD + dispatch + HMAC
│   │   └── github-service.ts      # GitHub release auto-publish
│   ├── storage/
│   │   ├── types.ts               # Storage interface
│   │   ├── local.ts               # Filesystem storage
│   │   ├── s3.ts                  # S3-compatible storage
│   │   └── factory.ts             # STORAGE_BACKEND switch
│   ├── middleware/
│   │   └── rate-limit.ts          # Token bucket rate limiter
│   ├── utils/
│   │   └── reserved-names.ts      # Pack name validation + squatting prevention
│   ├── auth/
│   │   ├── token.ts               # Token gen/hash/validate
│   │   └── middleware.ts          # extractAuth() function
│   └── mcp/
│       ├── handler.ts             # MCP server setup
│       ├── tools.ts               # MCP tools (5)
│       ├── resources.ts           # MCP resources (4)
│       └── prompts.ts             # MCP prompts (2)
├── test/
│   ├── db-fixture.ts              # In-memory test DB factory
│   ├── test-app.ts                # Test DB + setDb() injection
│   ├── pack-service.test.ts
│   ├── version-service.test.ts
│   ├── search-service.test.ts
│   ├── auth-service.test.ts
│   ├── routes.test.ts
│   ├── mcp.test.ts
│   ├── stats-service.test.ts
│   ├── review-service.test.ts     # Phase 3
│   ├── quality-service.test.ts    # Phase 3
│   ├── org-service.test.ts        # Phase 3
│   ├── dependency-service.test.ts # Phase 3b
│   ├── webhook-service.test.ts    # Phase 3b
│   ├── github-service.test.ts     # Phase 3b
│   ├── rate-limit.test.ts         # Phase 4
│   ├── reserved-names.test.ts     # Phase 4
│   ├── security-routes.test.ts    # Phase 4
│   ├── version-autobump.test.ts   # Phase 4
│   └── e2e/
│       └── publish-flow.test.ts   # Phase 4 E2E
├── drizzle-pg.config.ts             # Drizzle Kit config for PostgreSQL
├── scripts/
│   └── migrate-sqlite-to-pg.ts     # One-time SQLite → PG data migration
└── storage/                        # Local tarball storage (gitignored)
    └── packs/
```

### New files in agentpacks CLI (`packages/tools/agentpacks/`)

```
src/
├── features/
│   └── models.ts                # Parse models.json + validation
├── core/
│   └── profile-resolver.ts      # Resolve modelProfile overlays
├── sources/
│   ├── registry-ref.ts            # Parse registry:name[@version]
│   └── registry.ts                # Fetch from registry API
├── cli/
│   ├── search.ts                  # agentpacks search
│   ├── info.ts                    # agentpacks info
│   ├── publish.ts                 # agentpacks publish
│   └── login.ts                   # agentpacks login
└── utils/
    ├── tarball.ts                 # Tarball create/extract
    ├── registry-client.ts         # HTTP client for registry
    ├── model-allowlist.ts         # Model ID pattern validation (Phase 4)
    └── model-guidance.ts          # Markdown guidance generator

test/
├── features/
│   └── models.test.ts
├── core/
│   └── profile-resolver.test.ts
├── targets/
│   ├── opencode-models.test.ts   # OpenCode model generation
│   ├── cursor-models.test.ts     # Cursor guidance rule generation
│   └── claude-models.test.ts     # Claude Code model passthrough
├── sources/
│   ├── registry-ref.test.ts
│   └── registry.test.ts
├── cli/
│   ├── search.test.ts
│   └── publish.test.ts
└── utils/
    ├── tarball.test.ts
    ├── registry-client.test.ts
    └── model-allowlist.test.ts    # Phase 4
```

### New files in packs (`packs/*/`)

```
packs/<pack-name>/
├── pack.json
├── models.json                  # Model defaults, profiles, routing, provider options
└── ...
```

---

## 12. API Reference

### Public Endpoints (no auth)

| Method | Path                                      | Description                  | Query Params                                                          |
| ------ | ----------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| GET    | `/packs`                                  | List/search packs            | `q`, `tags`, `targets`, `features`, `author`, `sort`, `page`, `limit` |
| GET    | `/packs/:name`                            | Pack detail + latest version | —                                                                     |
| GET    | `/packs/:name/versions`                   | All versions of a pack       | `page`, `limit`                                                       |
| GET    | `/packs/:name/versions/:version`          | Specific version metadata    | —                                                                     |
| GET    | `/packs/:name/versions/:version/download` | Download tarball             | — (tracks download stats)                                             |
| GET    | `/packs/:name/readme`                     | README content               | —                                                                     |
| GET    | `/featured`                               | Curated/featured packs       | `limit`                                                               |
| GET    | `/tags`                                   | All tags with counts         | —                                                                     |
| GET    | `/targets/:targetId`                      | Packs supporting target      | `page`, `limit`                                                       |
| GET    | `/stats`                                  | Global registry stats        | —                                                                     |
| GET    | `/health`                                 | Health check                 | —                                                                     |

### Authenticated Endpoints (Bearer token)

| Method | Path                             | Description                    | Body                                          |
| ------ | -------------------------------- | ------------------------------ | --------------------------------------------- |
| POST   | `/packs`                         | Publish pack (multipart)       | tarball + metadata (version="auto" supported) |
| DELETE | `/packs/:name/versions/:version` | Unpublish version (owner only) | —                                             |
| POST   | `/packs/:name/deprecate`         | Deprecate/undeprecate (owner)  | `{ deprecated: bool, message?: str }`         |

### Response Shapes

```typescript
// GET /packs
interface PackListResponse {
  packs: PackSummary[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// GET /packs/:name
interface PackDetailResponse {
  name: string;
  displayName: string;
  description: string;
  author: { name: string; email?: string; url?: string; avatarUrl?: string };
  license: string;
  homepage?: string;
  repository?: string;
  tags: string[];
  targets: string[];
  features: string[];
  dependencies: string[];
  conflicts: string[];
  downloads: number;
  weeklyDownloads: number;
  featured: boolean;
  verified: boolean;
  latestVersion: VersionSummary;
  createdAt: string;
  updatedAt: string;
}

// GET /packs/:name/versions/:version
interface VersionDetailResponse {
  packName: string;
  version: string;
  integrity: string;
  tarballUrl: string;
  tarballSize: number;
  fileCount: number;
  featureSummary: {
    rules: number;
    commands: number;
    agents: number;
    skills: number;
    hooks: boolean;
    plugins: number;
    mcp: number;
    ignore: boolean;
    models: boolean;
    modelProfiles: number;
  };
  packManifest: object;
  changelog?: string;
  createdAt: string;
}

// GET /stats
interface RegistryStatsResponse {
  totalPacks: number;
  totalVersions: number;
  totalDownloads: number;
  weeklyDownloads: number;
  topTags: { tag: string; count: number }[];
  topTargets: { target: string; count: number }[];
}
```

---

## 13. CLI Commands Reference

### Existing Commands (already implemented)

| Command                      | Description                           |
| ---------------------------- | ------------------------------------- |
| `agentpacks init`            | Create `agentpacks.jsonc`             |
| `agentpacks generate`        | Generate all target configs           |
| `agentpacks generate --diff` | Preview changes                       |
| `agentpacks install`         | Resolve/install remote packs          |
| `agentpacks import --from`   | Import from rulesync/cursor/claude/oc |
| `agentpacks export --to`     | Export to cursor plugin format        |
| `agentpacks pack create`     | Scaffold a new pack                   |
| `agentpacks pack list`       | List configured packs                 |
| `agentpacks pack validate`   | Validate pack structure               |
| `agentpacks pack enable`     | Enable a disabled pack                |
| `agentpacks pack disable`    | Disable a pack                        |

### New Commands (Phase 1 — registry)

| Command                     | Description                                             | Output                                           |
| --------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `agentpacks search <q>`     | Search registry packs                                   | Table: name, description, downloads, targets     |
| `agentpacks info <pack>`    | Pack details from registry                              | Name, versions, features, install cmd            |
| `agentpacks publish`        | Publish current pack to registry                        | Success URL or validation errors                 |
| `agentpacks login`          | Store API token for publishing                          | Saved to `~/.config/agentpacks/credentials.json` |
| `agentpacks models explain` | Explain profile/routing resolution for a task (planned) | Chosen profile + reasoning summary               |

---

## 14. Decision Log

| #   | Date       | Decision                                         | Rationale                                                                               |
| --- | ---------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| 1   | 2026-02-20 | New Elysia app, not extending registry-server    | registry-server is filesystem-based for design-system + contracts; different data model |
| 2   | 2026-02-20 | SQLite for Phase 1, PostgreSQL for Phase 2+      | Zero external deps for MVP, same Drizzle ORM for migration                              |
| 3   | 2026-02-20 | Port 8091                                        | 8090 = registry-server, 8081 = api-library, 8080 = alpic-mcp                            |
| 4   | 2026-02-20 | Pattern B (direct MCP SDK) for MCP               | Same as alpic-mcp, simpler than Pattern A chain                                         |
| 5   | 2026-02-20 | Bearer token auth, not OAuth                     | Simpler for CLI-first workflow; GitHub OAuth can come Phase 3                           |
| 6   | 2026-02-20 | Local tarball storage Phase 1                    | No cloud deps for MVP; S3 abstracted behind interface                                   |
| 7   | 2026-02-20 | `registry:name[@version]` source syntax          | Consistent with existing `git:` and `npm:` prefix patterns                              |
| 8   | 2026-02-20 | `models` as feature #9 (`models.json`)           | Structured data, easier validation/merge than markdown                                  |
| 9   | 2026-02-20 | Secrets forbidden in `models.json`               | Registry packs are public/shareable; credentials must remain external                   |
| 10  | 2026-02-20 | Fix dead agent `model` passthrough               | Existing metadata exists but generators currently drop it                               |
| 11  | 2026-02-20 | Cursor model config via guidance rule            | Cursor model selection is UI-driven; `.mdc` guidance is the deterministic path          |
| 12  | 2026-02-20 | Task-aware routing shipped after static profiles | Deliver quickly with stable base, then add richer routing semantics in Phase 2          |
| 13  | 2026-02-21 | In-memory rate limiting (not Redis)              | No external deps; single-instance MVP is sufficient for current scale                   |
| 14  | 2026-02-21 | 10MB tarball size limit                          | Generous for config packs; prevents abuse without blocking legitimate use               |
| 15  | 2026-02-21 | Model ID allowlist = warning only, not blocking  | Allows innovative use of new models while still guiding toward known-good IDs           |
| 16  | 2026-02-21 | Profile inheritance via `extends` keyword        | Mirrors TypeScript's `extends` semantics; familiar pattern, cycle detection built-in    |

---

## 15. Open Questions

| #   | Question                                                                   | Status   | Resolution                                                             |
| --- | -------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| 1   | Should we support pack name scoping (`@org/name`)?                         | Deferred | Phase 3 with org accounts                                              |
| 2   | Rate limiting strategy for API?                                            | Resolved | Phase 4 — token bucket per IP, 100 req/min general, 10 req/min publish |
| 3   | How to handle pack name squatting?                                         | Resolved | Phase 4 — reserved names + validation rules                            |
| 4   | Should `agentpacks publish` auto-bump version?                             | Resolved | Phase 4 — auto-bump patch from latest                                  |
| 5   | Pack size limits (tarball max)?                                            | Resolved | Phase 4 — 10MB max                                                     |
| 6   | Should we support pack deprecation (soft delete)?                          | Resolved | Phase 4 — deprecated flag + message                                    |
| 7   | CDN for tarball serving in production?                                     | Deferred | Phase 2 with S3                                                        |
| 8   | Should model IDs be validated against an allowlist/registry?               | Resolved | Phase 4 — pattern-based allowlist, warning on unknown                  |
| 9   | Should profiles support inheritance (`extends`)?                           | Resolved | Phase 4 — `extends` field with recursive resolution                    |
| 10  | How to handle model deprecations/EOL migrations?                           | Open     | —                                                                      |
| 11  | Should routing support custom dimensions beyond complexity/urgency/budget? | Deferred | Phase 2+                                                               |

---

## 16. Progress Tracker

### Phase 1 — MVP

#### Registry Server Scaffolding

- [x] Create directory structure
- [x] `package.json` + deps
- [x] `tsconfig.json`
- [x] `drizzle.config.ts`
- [x] Entry point (`src/index.ts`)
- [x] Server wiring (`src/server.ts`)

#### Database

- [x] Schema definitions (`src/db/schema.ts`)
- [x] Client connection (`src/db/client.ts`) — bun:sqlite + setDb() for testing
- [x] Initial migration (drizzle-kit generate)
- [x] Seed script (`src/db/seed.ts`)

#### Services

- [x] `pack-service.ts`
- [x] `version-service.ts`
- [x] `search-service.ts`
- [x] `publish-service.ts` (publish logic in routes/publish.ts — kept inline)
- [x] `stats-service.ts` (stats via search-service — kept inline)

#### Storage

- [x] Storage interface (`types.ts`)
- [x] Local storage (`local.ts`)

#### Auth

- [x] Token management (`token.ts`)
- [x] Auth middleware (`middleware.ts`)

#### Routes

- [x] `GET /packs` + `GET /packs/:name`
- [x] `GET /packs/:name/versions[/:version]`
- [x] `GET /packs/:name/versions/:version/download`
- [x] `GET /packs/:name/readme`
- [x] `POST /packs` (publish)
- [x] `DELETE /packs/:name/versions/:version` (authenticated, owner-only)
- [x] `GET /featured`
- [x] `GET /tags`
- [x] `GET /targets/:targetId`
- [x] `GET /stats`
- [x] `GET /health`

#### CLI (agentpacks)

- [x] `registry-ref.ts` source parser
- [x] `registry.ts` source resolver
- [x] Update source index + pack-loader + lockfile
- [x] `search.ts` command
- [x] `info.ts` command
- [x] `publish.ts` command
- [x] `login.ts` command
- [x] `tarball.ts` utility
- [x] `registry-client.ts` utility
- [x] Register commands in `src/index.ts`

#### Models Feature (agentpacks)

- [x] `src/features/models.ts` — parser + schema + validation
- [x] Export models parser/types from `src/features/index.ts`
- [x] Add `"models"` to `FEATURE_IDS`
- [x] Add `modelProfile` to workspace config schema
- [x] Add `models` field to loaded pack type + parsing
- [x] Add `models` field to merged feature output + merge strategy
- [x] Add `src/core/profile-resolver.ts` for profile activation and overlay
- [x] OpenCode generation of model fields (`model`, `small_model`, provider options/variants)
- [x] Cursor generation of `.cursor/rules/model-config.mdc` guidance rule
- [x] Claude/Copilot/generic target model guidance generation
- [x] Fix passthrough for existing agent-level `model` metadata
- [x] Secret scanning in `pack validate` and `publish`
- [x] Update pack template to include example `models.json`

#### Agent Model Passthrough Fix

- [x] Add `cursor` override to `AgentFrontmatter` interface
- [x] OpenCode target: serialize `agent.meta.opencode.model` and `temperature`
- [x] Cursor target: serialize `agent.meta.cursor.model` into agent frontmatter
- [x] Claude Code target: serialize `agent.meta.claudecode.model` via model comment injection
- [x] Enforce precedence: `models` feature overrides per-agent frontmatter

#### Models Tests

- [x] `test/features/models.test.ts` — parser, schema, merge, credential scan
- [x] `test/core/profile-resolver.test.ts` — profile activation + overlay + precedence
- [x] `test/targets/models-targets.test.ts` — OpenCode, Cursor, Claude, Copilot model generation
- [x] `test/targets/cursor-models.test.ts` — generated `.mdc` guidance rule (in models-targets.test.ts)
- [x] `test/targets/claude-models.test.ts` — model passthrough in Claude target (in models-targets.test.ts)

#### Registry Server Tests

- [x] Auth token utility tests (generateToken, hashToken)
- [x] Storage layer tests (LocalStorage put/get/delete/exists)
- [x] Service layer unit tests with in-memory SQLite (pack-service: 11, version-service: 8, search-service: 10, auth: 5)
- [x] Route handler integration tests (18 tests: health, packs, versions, featured, stats, tags, targets, publish, delete)

#### Registry CLI Tests

- [x] `registry-ref.test.ts` — ref parsing
- [x] `registry.test.ts` — source resolver (mocked HTTP)
- [x] `search.test.ts` — search command output
- [x] `publish.test.ts` — publish flow
- [x] `tarball.test.ts` — create/extract
- [x] `registry-client.test.ts` — API client

#### CI & Docs

- [x] Add `registry-packs` to turbo pipeline
- [x] Update `.github/workflows/agentpacks.yml` to include registry + models tests
- [x] Changeset file for version bump
- [x] Update agentpacks `README.md` with registry + models documentation
- [x] E2E test: publish → search → install → generate (Phase 4)
- [x] E2E test: model profile switch updates generated target configs

### Phase 2 — MCP + Website + Task Routing

#### MCP Integration ✅

- [x] `src/mcp/handler.ts` — MCP server setup with tools, resources, prompts
- [x] `src/mcp/tools.ts` — tool implementations (`search_packs`, `get_pack_info`, `list_featured`, `list_by_target`, `get_pack_readme`)
- [x] `src/mcp/resources.ts` — resource providers (`registry://packs`, `registry://packs/{name}`, `registry://featured`, `registry://tags`)
- [x] `src/mcp/prompts.ts` — prompt templates (`suggest_packs`, `compare_packs`)
- [x] Wire MCP endpoint into Elysia server (`/mcp`)
- [x] MCP integration tests (17 tests)

#### Website ✅

- [x] Shared API client lib for SSR/CSR data fetching (`web-landing/src/lib/registry-api.ts`)
- [x] `/registry/packs` — search page with tag/target filters, pagination
- [x] `/registry/packs/[name]` — detail page with README render, version list, install snippet
- [x] `/registry/packs/[name]/versions/[ver]` — version detail with manifest + changelog
- [x] `/registry/featured` — curated grid with cards
- [x] `/registry/publish` — static publishing guide page

#### Storage & Stats ✅

- [x] `src/storage/s3.ts` — S3-compatible storage with AWS Signature V4
- [x] `src/storage/factory.ts` — Config switch: `STORAGE_BACKEND=local|s3`
- [x] Routes refactored to use `getStorage()` factory
- [x] `src/services/stats-service.ts` — Download recording + daily aggregation
- [x] `download_stats` table + migration
- [x] Weekly rolling window recalculation (`recalculateWeekly()`)
- [x] `/packs/:name/stats` endpoint (daily download trends)
- [x] Download tracking wired into version download route
- [x] 8 stats service tests

#### Task-Aware Routing ✅

- [x] Routing schema evolution: `RoutingConditionSchema` with `complexity`, `urgency`, `budget`, `contextWindowNeed`, `toolUseIntensity`
- [x] `RoutingRuleSchema` extended with `description` and `priority` fields
- [x] Enhanced routing guidance generation with condition reference table
- [x] `agentpacks models explain` CLI command (profile/routing resolution + task matching)
- [x] Heuristic task-to-routing matcher for `--task` flag
- [x] Registry search supports `features` filter for routing packs

### Phase 3 — Community ✅

#### Reviews & Ratings ✅

- [x] `reviews` table (packName, username, rating 1-5, comment, createdAt/updatedAt)
- [x] `GET /packs/:name/reviews`, `POST /packs/:name/reviews`, `DELETE /packs/:name/reviews`
- [x] One review per user per pack (upsert), self-review prevention
- [x] Cached `average_rating` (10x scaled) + `review_count` on packs table
- [x] Average rating + star display on pack cards (website)
- [x] Reviews section on pack detail page (website)

#### Organizations ✅

- [x] `organizations` table (name, displayName, description, avatarUrl, website)
- [x] `org_members` table with role hierarchy (owner > admin > member)
- [x] `@org/pack-name` scoped pack name parsing (`OrgService.parseOrgScope`)
- [x] Org CRUD: `POST /orgs`, `GET /orgs/:name`, `PUT /orgs/:name`, `DELETE /orgs/:name`
- [x] Member management: `GET/POST /orgs/:name/members`, `DELETE /orgs/:name/members/:username`
- [x] Role-based access control (owner/admin/member hierarchy)

#### Quality Scoring ✅

- [x] Automated quality score (0-100) — README +20, versions +10, license +10, targets +20, features +15, tags +10, repo +5, homepage +5, no-conflicts +5
- [x] `GET /packs/:name/quality` endpoint with full breakdown
- [x] `?recalculate=true` flag to recompute and persist score
- [x] `recalculateAll()` for batch score updates
- [x] Quality badge display on pack cards (excellent/good/fair/needs-work)
- [x] Quality breakdown section on pack detail page (website)

#### DB Migration (0002_community.sql) ✅

- [x] `ALTER TABLE packs ADD COLUMN average_rating, review_count, quality_score`
- [x] `CREATE TABLE reviews` with unique index on (pack_name, username)
- [x] `CREATE TABLE organizations`
- [x] `CREATE TABLE org_members` with unique index on (org_name, username)

#### Tests (54 new tests) ✅

- [x] ReviewService: upsert, update, cached rating, list, pagination, delete, getUserReview (10)
- [x] Review routes: GET/POST/DELETE, validation, auth, self-review prevention (5)
- [x] QualityService: computeScore, scoring rubric, updateScore, recalculateAll, getBadge (9)
- [x] Quality route: GET, 404, recalculate flag (3)
- [x] OrgService: create, get, update, delete, addMember, removeMember, hasRole, parseOrgScope, getUserOrgs (12)
- [x] Org routes: POST/GET/DELETE orgs, member management, role enforcement (6)
- [x] Website: API client extended with reviews/quality types and methods

#### Dependency Graph ✅

- [x] `DependencyService` — BFS graph builder, Mermaid generation, cycle detection
- [x] `GET /packs/:name/dependencies` (JSON + Mermaid), `GET /packs/:name/dependents`
- [x] Dependency visualization + dependents list on pack detail page (website)
- [x] 16 dependency tests (service + routes)

#### Webhooks & GitHub App ✅

- [x] `webhooks` + `webhook_deliveries` tables, migration `0003_webhooks.sql`
- [x] `WebhookService` — CRUD, HMAC signing, dispatch with delivery logging
- [x] Webhook routes: `GET/POST/DELETE /packs/:name/webhooks`, `/deliveries`
- [x] Fire-and-forget dispatch wired into publish route
- [x] `GitHubService` — signature verification + auto-publish on release tag
- [x] `POST /github/webhook` — release event receiver
- [x] 20 webhook tests, 10 GitHub service tests

#### PostgreSQL Migration ✅

- [x] `schema-pg.ts` — full PG schema mirror (pgTable, jsonb, serial, boolean)
- [x] `drizzle-pg.config.ts` + `db:generate:pg`/`db:migrate:pg` scripts
- [x] Dual-driver `client.ts`: `DB_DRIVER=sqlite|pg`, async `initDb()` for PG
- [x] Connection pooling: `DB_POOL_MAX`, `DB_POOL_IDLE_TIMEOUT`, `DB_POOL_CONNECT_TIMEOUT`
- [x] `scripts/migrate-sqlite-to-pg.ts` — one-time data migration script
- [x] `pg` optional dep, `@types/pg` devDep

### Phase 4 — Production Hardening ✅

#### 4.1 Rate Limiting & Security ✅

- [x] Rate limiting middleware (`src/middleware/rate-limit.ts`) — token bucket per IP
- [x] Rate limit configuration via env vars (`RATE_LIMIT_*`)
- [x] Pack size limit enforcement (10MB) in publish route
- [x] Reserved names list (`src/utils/reserved-names.ts`) — squatting prevention
- [x] Pack name validation rules (min length, forbidden patterns)
- [x] `deprecated` + `deprecationMessage` columns on packs table
- [x] `POST /packs/:name/deprecate` route (authenticated, owner-only)
- [x] DB migration `0004_deprecation.sql`
- [x] Rate limiting + security tests (13 tests)
- [x] Deprecation + name validation route tests (20 tests)

#### 4.2 E2E Tests ✅

- [x] `test/e2e/publish-flow.test.ts` — full publish → search → info → download → deprecate (5 tests)
- [x] CI pipeline: `bun test` for registry-packs added to workflow
- [x] All 637 tests passing (402 agentpacks + 235 registry-packs)

#### 4.3 Pack Versioning Polish ✅

- [x] `VersionService.getNextVersion()` + `bumpPatch()` — auto-bump patch from latest
- [x] Auto-bump wired into publish route (version = "auto")
- [x] Model ID allowlist (`agentpacks/src/utils/model-allowlist.ts`) — pattern-based validation
- [x] `scanModelsForUnknownIds()` — advisory warnings for unknown model IDs
- [x] `extends` field on `ModelProfileSchema`
- [x] `resolveProfileInheritance()` — recursive resolution with cycle detection (max depth 10)
- [x] Profile inheritance tests (8 tests)
- [x] Model ID allowlist tests (14 tests)
- [x] Auto-bump version tests (10 tests)
