# AI Agent Guide -- `agentpacks`

Scope: `packages/tools/agentpacks/*`

Composable AI agent configuration manager. Resolves pack-based rules, commands, skills, hooks, and MCP definitions, then generates target-specific config files for Cursor, Claude Code, Codex, Copilot, Gemini, and more.

## Quick Context

- **Layer**: tool
- **Consumers**: all packages via `agentpacks generate`, CI pipelines, plugin authors

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` / `./api` | Programmatic API |
| `./core/*` | Config, pack-loader, profile-resolver, dependency-resolver, lockfile |
| `./features/*` | Rules, commands, skills, hooks, MCP, models, plugins, agents, ignore |
| `./targets/*` | Cursor, Claude Code, Codex, Copilot, Gemini, OpenCode, AGENTS.md, etc. |
| `./sources/*` | Git, npm, registry, local pack sources |
| `./importers/*` | Import from Cursor, Claude Code, OpenCode, rulesync |
| `./exporters/*` | Export to Cursor plugin format |
| `./cli/*` | CLI commands (init, generate, install, publish, search, pack/*) |
| `./utils/*` | Filesystem, frontmatter, markdown, credentials, model helpers |

**Binary**: `agentpacks` (CLI entry point)

## Guardrails

- Do not modify target output formats without updating the corresponding target writer
- Pack schema changes must stay backward-compatible (see `schema.json`)
- Never hard-code model names; use `utils/model-allowlist` and `utils/model-guidance`

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
