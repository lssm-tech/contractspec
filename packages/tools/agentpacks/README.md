# agentpacks

[![npm version](https://img.shields.io/npm/v/agentpacks.svg)](https://www.npmjs.com/package/agentpacks)
[![npm downloads](https://img.shields.io/npm/dm/agentpacks.svg)](https://www.npmjs.com/package/agentpacks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-247%20passing-brightgreen.svg)](https://github.com/lssm-tech/contractspec/tree/main/packages/tools/agentpacks)

**Composable AI agent configuration manager.**

Write your rules, commands, skills, hooks, and MCP configs once — in a pack — and sync them automatically to OpenCode, Cursor, Claude Code, Codex CLI, Gemini CLI, GitHub Copilot, and 13 more tools.

---

## Why agentpacks?

AI coding tools are proliferating fast. Every tool has its own config format:

- Cursor wants `.cursor/rules/*.mdc`
- Claude Code wants `CLAUDE.md` and `.claude/rules/*.md`
- OpenCode wants `.opencode/agent/*.md`, `.opencode/skill/*.md`, `opencode.json`
- Codex wants `.codex/memories/*.md`
- And so on for 20+ tools…

**Maintaining all of these by hand means:**

- Rules drift between tools — your Cursor context differs from your Claude context
- Adding a new rule means editing 5+ files in 5+ formats
- Onboarding a new tool means starting from scratch

**agentpacks solves this with a pack-based architecture:**

1. Write your rules/commands/agents/skills once, in plain Markdown with simple frontmatter
2. Group them into a _pack_ (a folder with a `pack.json` manifest)
3. Run `agentpacks generate` — all 20 supported tools get their configs, properly formatted

### vs rulesync

[rulesync](https://github.com/dyoshikawa/rulesync) is great inspiration but uses a flat file model. agentpacks goes further:

|                      | agentpacks                              | rulesync      |
| -------------------- | --------------------------------------- | ------------- |
| Architecture         | Composable packs                        | Flat files    |
| Pack distribution    | npm, git, local                         | Local only    |
| OpenCode plugins     | Per-pack `.ts` plugin files             | Not supported |
| Cursor plugin export | Native plugin format                    | Not supported |
| Import from tools    | Cursor, Claude Code, OpenCode, rulesync | —             |
| Dependency resolver  | Topological sort + conflict detection   | —             |
| Monorepo / metarepo  | Built-in baseDirs                       | —             |

---

## Quick Start

```bash
# Install globally
npm install -g agentpacks
# or
bun add -g agentpacks

# Initialize in your project
cd my-project
agentpacks init

# Generate configs for all your AI tools
agentpacks generate
```

After `init`, you'll have:

```
my-project/
├── agentpacks.jsonc          # workspace config
└── packs/
    └── default/
        ├── pack.json         # pack manifest
        └── rules/
            └── overview.md  # starter rule
```

After `generate`, every supported tool gets its config — no manual formatting needed.

### Migrating from rulesync

Already using rulesync? Import your existing setup in one command:

```bash
agentpacks import --from rulesync
```

This reads your `.rulesync/` directory and `rulesync.jsonc`, and creates an equivalent agentpacks pack + workspace config.

---

## Supported Tools

### Core targets — full feature support

| Target         | ID           | Rules | Commands | Agents | Skills | Hooks | Plugins | MCP | Ignore |
| -------------- | ------------ | :---: | :------: | :----: | :----: | :---: | :-----: | :-: | :----: |
| OpenCode       | `opencode`   |   ✓   |    ✓     |   ✓    |   ✓    |   ✓   |    ✓    |  ✓  |   ✓    |
| Cursor         | `cursor`     |   ✓   |    ✓     |   ✓    |   ✓    |   ✓   |         |  ✓  |   ✓    |
| Claude Code    | `claudecode` |   ✓   |    ✓     |   ✓    |   ✓    |   ✓   |         |  ✓  |   ✓    |
| Codex CLI      | `codexcli`   |   ✓   |          |        |   ✓    |   ✓   |         |  ✓  |        |
| Gemini CLI     | `geminicli`  |   ✓   |    ✓     |        |   ✓    |   ✓   |         |  ✓  |   ✓    |
| GitHub Copilot | `copilot`    |   ✓   |    ✓     |   ✓    |   ✓    |       |         |  ✓  |   ✓    |
| AGENTS.md      | `agentsmd`   |   ✓   |          |        |        |       |         |     |        |

### Additional targets — rules, MCP, and more

| Target        | ID             | Rules | Commands | MCP | Ignore |
| ------------- | -------------- | :---: | :------: | :-: | :----: |
| Cline         | `cline`        |   ✓   |    ✓     |  ✓  |   ✓    |
| Kilo Code     | `kilo`         |   ✓   |    ✓     |  ✓  |   ✓    |
| Roo Code      | `roo`          |   ✓   |    ✓     |  ✓  |   ✓    |
| Qwen Code     | `qwencode`     |   ✓   |          |  ✓  |   ✓    |
| Windsurf      | `windsurf`     |   ✓   |          |  ✓  |   ✓    |
| Kiro          | `kiro`         |   ✓   |          |  ✓  |        |
| Augment Code  | `augmentcode`  |   ✓   |          |  ✓  |        |
| Replit Agent  | `replit`       |   ✓   |          |  ✓  |        |
| Zed           | `zed`          |   ✓   |          |  ✓  |        |
| Junie         | `junie`        |   ✓   |          |  ✓  |        |
| Factory Droid | `factorydroid` |   ✓   |          |  ✓  |        |
| AntiGravity   | `antigravity`  |   ✓   |          |  ✓  |        |
| Warp          | `warp`         |   ✓   |          |     |        |

---

## Features

agentpacks supports 8 feature types inside a pack:

| Feature      | Description                                          | Example files                               |
| ------------ | ---------------------------------------------------- | ------------------------------------------- |
| **rules**    | Project/coding guidelines injected as context        | `rules/security.md`, `rules/style.md`       |
| **commands** | Slash commands (e.g. `/lint`, `/review`)             | `commands/lint.md`, `commands/deploy.md`    |
| **agents**   | Named sub-agents with specific personas              | `agents/reviewer.md`, `agents/architect.md` |
| **skills**   | Step-by-step skill guides (with structured SKILL.md) | `skills/migrate/SKILL.md`                   |
| **hooks**    | Shell commands triggered by agent events             | `hooks.json`                                |
| **plugins**  | Raw TypeScript plugin files (OpenCode)               | `plugins/my-plugin.ts`                      |
| **mcp**      | MCP server definitions                               | `mcp.json`                                  |
| **ignore**   | Patterns the agent should ignore                     | `ignore`                                    |

---

## CLI Reference

### `agentpacks init`

Initialize agentpacks in the current project. Creates `agentpacks.jsonc` and a starter pack under `packs/default/`.

```bash
agentpacks init
```

---

### `agentpacks generate`

Generate tool configs from all active packs.

```bash
agentpacks generate [options]

Options:
  -t, --targets <targets>    Comma-separated target IDs, or * for all (default: from config)
  -f, --features <features>  Comma-separated feature IDs, or * for all (default: from config)
  --dry-run                  Preview changes without writing files
  --diff                     Show a diff of what would change
  -v, --verbose              Enable verbose output
```

```bash
# Generate for all configured targets
agentpacks generate

# Generate only for Cursor and Claude Code
agentpacks generate --targets cursor,claudecode

# Preview changes without writing
agentpacks generate --dry-run --diff
```

---

### `agentpacks install`

Install remote packs (npm packages or git repos) into the local pack cache.

```bash
agentpacks install [options]

Options:
  --update   Re-resolve all refs, ignoring the lockfile
  --frozen   Fail if the lockfile is missing or incomplete (useful in CI)
  -v, --verbose
```

```bash
# Install all remote packs listed in agentpacks.jsonc
agentpacks install

# Update all remote packs to latest
agentpacks install --update

# CI: fail fast if lockfile is out of date
agentpacks install --frozen
```

---

### `agentpacks import`

Import from an existing tool configuration into a new pack.

```bash
agentpacks import --from <source> [options]

Sources:  rulesync | cursor | claudecode | opencode

Options:
  --from <source>    Source format to import from (required)
  -o, --output <dir> Output directory for the generated pack
```

```bash
# Import from rulesync (.rulesync/ + rulesync.jsonc)
agentpacks import --from rulesync

# Import from existing Cursor rules
agentpacks import --from cursor --output ./packs/from-cursor
```

---

### `agentpacks export`

Export a pack to a target-native format (e.g. a Cursor plugin).

```bash
agentpacks export --format <format> [options]

Formats:  cursor-plugin

Options:
  --format <format>  Export format (required)
  -o, --output <dir> Output directory
  --pack <name>      Export a specific pack only
  -v, --verbose
```

```bash
# Export all packs as a single Cursor plugin
agentpacks export --format cursor-plugin --output ./cursor-plugin-dist
```

---

### `agentpacks pack create <name>`

Scaffold a new pack with the correct directory structure.

```bash
agentpacks pack create my-pack
```

Creates:

```
packs/my-pack/
├── pack.json
└── rules/
    └── overview.md
```

---

### `agentpacks pack list`

List all configured packs and their enabled/disabled status.

```bash
agentpacks pack list
```

---

### `agentpacks pack validate`

Validate pack manifests and feature files for schema errors.

```bash
agentpacks pack validate
```

---

### `agentpacks pack enable <name>` / `agentpacks pack disable <name>`

Enable or disable a pack without removing it from `agentpacks.jsonc`.

```bash
agentpacks pack disable my-pack   # adds to "disabled" array
agentpacks pack enable my-pack    # removes from "disabled" array
```

---

## Configuration

### Workspace config — `agentpacks.jsonc`

Created at your project root by `agentpacks init`.

```jsonc
{
  "$schema": "https://unpkg.com/agentpacks/schema.json",

  // Packs to load — local paths, npm packages, or git repos
  "packs": [
    "./packs/default",
    "agentpacks-typescript-rules", // npm package
    "github:myorg/agent-packs#main/python", // git ref
  ],

  // Temporarily disable a pack without removing it
  "disabled": [],

  // Which AI tools to generate configs for (* = all 20)
  "targets": [
    "opencode",
    "cursor",
    "claudecode",
    "geminicli",
    "codexcli",
    "copilot",
  ],

  // Which feature types to generate (* = all 8)
  "features": ["*"],

  // Repository mode: "repo" | "monorepo" | "metarepo"
  "mode": "repo",

  // Base directories to generate into (monorepo mode)
  "baseDirs": ["."],

  // Generate user-global configs (XDG-aware, applies to all projects)
  "global": false,

  // Delete existing generated files before regenerating
  "delete": true,
}
```

### Pack manifest — `pack.json`

Lives at the root of each pack directory.

```json
{
  "name": "my-pack",
  "version": "1.0.0",
  "description": "My custom agent rules and commands",
  "author": "Your Name",
  "tags": ["typescript", "testing"],
  "dependencies": ["base-pack"],
  "conflicts": [],
  "targets": ["*"],
  "features": ["*"]
}
```

---

## Authoring a Pack

A pack is a directory with a `pack.json` and any combination of feature subdirectories:

```
my-pack/
├── pack.json
├── rules/
│   ├── overview.md       # root: true → included in AGENTS.md / CLAUDE.md
│   └── security.md       # root: false → detail rule
├── commands/
│   └── review.md
├── agents/
│   └── architect.md
├── skills/
│   └── migrate/
│       └── SKILL.md
├── hooks.json
├── mcp.json
└── ignore
```

### Rule frontmatter

```markdown
---
root: true # true = root context (AGENTS.md, CLAUDE.md); false = detail rule
targets: ['*'] # which tools this rule applies to
description: 'Overview' # shown in Cursor rules UI
globs: ['src/**/*.ts'] # (optional) file-pattern-scoped rule
---

Your rule content here.
```

### Command frontmatter

```markdown
---
name: review # command name (becomes /review)
targets: ['*']
description: 'Run a code review'
---

Review the selected code for correctness, style, and potential bugs.
```

### MCP config — `mcp.json`

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "my-mcp-server"],
      "env": { "API_KEY": "$MY_API_KEY" }
    },
    "remote-server": {
      "url": "https://mcp.example.com/sse",
      "headers": { "Authorization": "Bearer $TOKEN" }
    }
  }
}
```

### Hooks — `hooks.json`

```json
{
  "hooks": {
    "sessionStart": [{ "command": "echo 'Session started'" }],
    "postToolUse": [
      {
        "command": "bun run lint",
        "matcher": "write_file|edit_file"
      }
    ]
  }
}
```

Supported hook events: `sessionStart`, `preToolUse`, `postToolUuse`, `afterFileEdit`, `afterShellExecution`, `stop`

---

## Monorepo Support

For monorepo setups, set `mode: "monorepo"` and list your sub-packages in `baseDirs`:

```jsonc
{
  "mode": "monorepo",
  "baseDirs": ["packages/api", "packages/web", "packages/shared"],
}
```

`agentpacks generate` will write tool configs into each listed base directory.

For metarepo setups (a repo of repos), set `mode: "metarepo"` and agentpacks will discover sub-repos that contain their own `agentpacks.jsonc` and process them.

---

## Pack Distribution

Packs can be shared as:

### npm packages

```bash
npm install my-agent-pack
```

```jsonc
{ "packs": ["my-agent-pack"] }
```

### Git repos

```jsonc
{
  "packs": [
    "github:myorg/agent-packs", // defaults to main branch
    "github:myorg/agent-packs#v2.0.0", // specific tag
    "github:myorg/agent-packs#main/python", // subdirectory
  ],
}
```

### Local directories (monorepo / private)

```jsonc
{ "packs": ["./packs/default", "../shared/agent-packs"] }
```

---

## Global Mode

Generate user-scope configs that apply to all projects on your machine (useful for personal preferences):

```bash
agentpacks generate --global
```

agentpacks uses XDG-aware paths:

- **macOS/Linux**: `~/.config/agentpacks/`
- **Windows**: `%APPDATA%\agentpacks\`

---

## About

### ContractSpec

[ContractSpec](https://contractspec.io) is the deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. As AI coding tools generate more and more code, ContractSpec provides the governance layer: canonical contracts, multi-surface consistency, and safe regeneration without lock-in.

> "You keep your app. We stabilize it, one module at a time. You own the code. It's standard tech. We're the compiler, not the prison."

### LSSM

[LSSM](https://github.com/lssm-tech) is the team behind ContractSpec. We build tools for AI-native software development — infrastructure that makes AI-generated code safe, maintainable, and production-ready.

agentpacks is built by LSSM as an open-source part of the ContractSpec ecosystem, published independently on npm so any project can adopt it without adopting the full ContractSpec platform.

---

## Contributing

We welcome contributions of all kinds — bug reports, feature requests, documentation improvements, and code.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, code style guidelines, and the pull request process.

**Quick links:**

- [Report a bug](https://github.com/lssm-tech/contractspec/issues/new?template=bug_report.md&labels=agentpacks)
- [Request a feature](https://github.com/lssm-tech/contractspec/issues/new?template=feature_request.md&labels=agentpacks)
- [Ask a question](https://github.com/lssm-tech/contractspec/discussions)
- [View the roadmap](https://github.com/lssm-tech/contractspec/issues?q=is%3Aissue+label%3Aagentpacks+label%3Aroadmap)

---

## License

MIT — see [LICENSE](../../LICENSE) for details.

Built with love by [LSSM](https://github.com/lssm-tech) — contributors of [ContractSpec](https://contractspec.io).
