---
'agentpacks': minor
---

Add models feature, pack registry support, and registry CLI commands.

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
