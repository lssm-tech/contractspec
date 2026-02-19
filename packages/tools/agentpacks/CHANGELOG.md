# agentpacks

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
