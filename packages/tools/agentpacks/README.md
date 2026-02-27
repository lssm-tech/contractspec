# agentpacks

[![npm version](https://img.shields.io/npm/v/agentpacks.svg)](https://www.npmjs.com/package/agentpacks)
[![npm downloads](https://img.shields.io/npm/dm/agentpacks.svg)](https://www.npmjs.com/package/agentpacks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-378%20passing-brightgreen.svg)](https://github.com/lssm-tech/contractspec/tree/main/packages/tools/agentpacks)

**Composable AI agent configuration manager.**

Write your rules, commands, skills, hooks, models, and MCP configs once — in a pack — and sync them automatically to OpenCode, Cursor, Claude Code, Codex CLI, Gemini CLI, GitHub Copilot, and 14 more tools. Discover and share packs via the **agentpacks registry**.

---

## Why agentpacks?

AI coding tools are proliferating fast. Every tool has its own config format:

- Cursor wants `.cursor/rules/*.mdc`
- Claude Code wants `CLAUDE.md` and `.claude/rules/*.md`
- OpenCode wants `.opencode/agent/*.md`, `.opencode/skill/*.md`, `opencode.json`
- Codex wants `.codex/memories/*.md`
- And so on for 21+ tools…

**Maintaining all of these by hand means:**

- Rules drift between tools — your Cursor context differs from your Claude context
- Adding a new rule means editing 5+ files in 5+ formats
- Onboarding a new tool means starting from scratch

**agentpacks solves this with a pack-based architecture:**

1. Write your rules/commands/agents/skills once, in plain Markdown with simple frontmatter
2. Group them into a _pack_ (a folder with a `pack.json` manifest)
3. Run `agentpacks generate` — all 21 supported tools get their configs, properly formatted

### vs rulesync

[rulesync](https://github.com/dyoshikawa/rulesync) is great inspiration but uses a flat file model. agentpacks goes further:

|                      | agentpacks                              | rulesync      |
| -------------------- | --------------------------------------- | ------------- |
| Architecture         | Composable packs                        | Flat files    |
| Pack distribution    | npm, git, local, **registry**           | Local only    |
| **Pack registry**    | Search, publish, install via CLI        | —             |
| **Model configs**    | Per-tool model/profile management       | Not supported |
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

| Target         | ID            | Rules | Commands | Agents | Skills | Hooks | Plugins | MCP | Ignore |
| -------------- | ------------- | :---: | :------: | :----: | :----: | :---: | :-----: | :-: | :----: |
| OpenCode       | `opencode`    |   ✓   |    ✓     |   ✓    |   ✓    |   ✓   |    ✓    |  ✓  |   ✓    |
| Cursor         | `cursor`      |   ✓   |    ✓     |   ✓    |   ✓    |   ✓   |         |  ✓  |   ✓    |
| Claude Code    | `claudecode`  |   ✓   |    ✓     |   ✓    |   ✓    |   ✓   |         |  ✓  |   ✓    |
| Codex CLI      | `codexcli`    |   ✓   |          |        |   ✓    |   ✓   |         |  ✓  |        |
| Mistral Vibe   | `mistralvibe` |   ✓   |    ✓     |   ✓    |   ✓    |       |         |  ✓  |   ✓    |
| Gemini CLI     | `geminicli`   |   ✓   |    ✓     |        |   ✓    |   ✓   |         |  ✓  |   ✓    |
| GitHub Copilot | `copilot`     |   ✓   |    ✓     |   ✓    |   ✓    |       |         |  ✓  |   ✓    |
| AGENTS.md      | `agentsmd`    |   ✓   |          |        |        |       |         |     |        |

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

agentpacks supports 9 feature types inside a pack:

| Feature      | Description                                          | Example files                               |
| ------------ | ---------------------------------------------------- | ------------------------------------------- |
| **rules**    | Project/coding guidelines injected as context        | `rules/security.md`, `rules/style.md`       |
| **commands** | Slash commands (e.g. `/lint`, `/review`)             | `commands/lint.md`, `commands/deploy.md`    |
| **agents**   | Named sub-agents with specific personas              | `agents/reviewer.md`, `agents/architect.md` |
| **skills**   | Step-by-step skill guides (with structured SKILL.md) | `skills/migrate/SKILL.md`                   |
| **hooks**    | Shell commands triggered by agent events             | `hooks.json`                                |
| **plugins**  | Raw TypeScript plugin files (OpenCode)               | `plugins/my-plugin.ts`                      |
| **mcp**      | MCP server definitions                               | `mcp.json`                                  |
| **models**   | Model preferences, profiles, and per-agent overrides | `models.json`                               |
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
  --model-profile <profile>  Activate a model profile (e.g. quality, budget, fast)
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

# Generate with the "budget" model profile active
agentpacks generate --model-profile budget
```

---

### `agentpacks install`

Install remote packs (npm packages, git repos, or registry packs) into the local pack cache.

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
# Export all packs as Cursor plugins
agentpacks export --format cursor-plugin --output ./cursor-plugin-dist
```

Each exported plugin follows Cursor's native plugin layout:

- `.cursor-plugin/plugin.json`
- `rules/*.mdc`, `agents/*.md`, `skills/*/SKILL.md`, `commands/*.md`
- `hooks/hooks.json` (when hooks are defined)
- `.mcp.json` (when MCP servers are defined)

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

### `agentpacks search <query>`

Search the pack registry for packs matching a query.

```bash
agentpacks search typescript

# Filter by target
agentpacks search react --target cursor

# Sort by downloads
agentpacks search monorepo --sort downloads
```

---

### `agentpacks info <pack>`

Show detailed information about a registry pack.

```bash
agentpacks info typescript-best-practices
```

---

### `agentpacks publish`

Publish the current pack to the registry. Requires authentication.

```bash
agentpacks login   # store your registry token
agentpacks publish # validate, bundle, and upload
```

The publish command validates the pack, scans for secrets, creates a tarball, and uploads it. Publish will be blocked if the pack contains potential secrets (API keys, tokens, etc.) in `models.json` or other config files.

---

### `agentpacks login`

Authenticate with the pack registry.

```bash
agentpacks login
```

Stores your token in `~/.config/agentpacks/credentials.json`.

---

## Model Configuration

agentpacks can manage AI model preferences across all your tools through the `models` feature. Define model assignments, named profiles, and provider options in a single `models.json` — agentpacks generates the right config for each tool.

### models.json

Place `models.json` at the root of a pack:

```json
{
  "default": "anthropic/claude-sonnet-4-20250514",
  "small": "anthropic/claude-haiku-3-5",
  "agents": {
    "code-reviewer": { "model": "anthropic/claude-opus-4-20250514" },
    "quick-fixer": { "model": "anthropic/claude-haiku-3-5" }
  },
  "profiles": {
    "quality": {
      "default": "anthropic/claude-opus-4-20250514",
      "small": "anthropic/claude-sonnet-4-20250514"
    },
    "budget": {
      "default": "anthropic/claude-haiku-3-5",
      "small": "anthropic/claude-haiku-3-5"
    },
    "fast": {
      "default": "anthropic/claude-haiku-3-5"
    }
  },
  "providers": {
    "anthropic": {
      "models": {
        "claude-opus-4-20250514": {
          "options": { "budgetTokens": 10000, "reasoningEffort": "high" }
        }
      }
    }
  }
}
```

### Activating a profile

Set `modelProfile` in your workspace config:

```jsonc
{
  "modelProfile": "quality",
}
```

Or override at generate time:

```bash
agentpacks generate --model-profile budget
```

### Per-tool output

| Tool            | What agentpacks generates                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- |
| **OpenCode**    | `model`, `small_model`, `provider.*.models.*.options`, `agent.*.model` in `opencode.json` |
| **Cursor**      | `.cursor/rules/model-config.mdc` — an always-applied guidance rule                        |
| **Claude Code** | Model guidance in `CLAUDE.md`, `<!-- model: ... -->` hints in agent files                 |
| **Copilot**     | Model guidance section in `.github/copilot-instructions.md`                               |
| **Others**      | Model guidance in their root rule file                                                    |

### Security

`models.json` must **never** contain credentials. agentpacks scans for API keys, tokens, secrets, and private key markers during `pack validate` and `publish`. Publish is blocked if secrets are detected.

---

## Configuration

### Workspace config — `agentpacks.jsonc`

Created at your project root by `agentpacks init`.

```jsonc
{
  "$schema": "https://unpkg.com/agentpacks/schema.json",

  // Packs to load — local, npm, git, or registry
  "packs": [
    "./packs/default",
    "agentpacks-typescript-rules", // npm package
    "github:myorg/agent-packs#main/python", // git ref
    "registry:react-patterns", // registry pack
  ],

  // Temporarily disable a pack without removing it
  "disabled": [],

  // Which AI tools to generate configs for (* = all 21)
  "targets": [
    "opencode",
    "cursor",
    "claudecode",
    "geminicli",
    "codexcli",
    "mistralvibe",
    "copilot",
  ],

  // Which feature types to generate (* = all 9)
  "features": ["*"],

  // Active model profile (from models.json profiles)
  "modelProfile": "quality",

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
├── models.json
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

Packs can be shared via four sources:

### agentpacks registry

The official pack registry at [agentpacks.dev](https://agentpacks.dev) — search, publish, and install community packs.

```bash
# Search for packs
agentpacks search typescript

# View pack details
agentpacks info typescript-best-practices

# Install from registry
agentpacks install
```

```jsonc
{
  "packs": [
    "registry:typescript-best-practices",
    "registry:react-patterns@1.2.0", // pinned version
  ],
}
```

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
