# Contributing to agentpacks

Thank you for your interest in contributing! agentpacks is an open-source project by [LSSM](https://github.com/lssm-tech), part of the [ContractSpec](https://contractspec.io) ecosystem.

We welcome all kinds of contributions:

- Bug reports
- Feature requests and proposals
- Documentation improvements
- New target generators or pack importers
- Bug fixes and enhancements

---

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Node.js >= 18 (for compatibility builds)
- Git

### Clone and install

```bash
git clone https://github.com/lssm-tech/contractspec.git
cd contractspec

# Install all workspace dependencies
bun install
```

### Build agentpacks

```bash
cd packages/tools/agentpacks
bun run build
```

### Run the tests

```bash
bun test
```

All 247 tests should pass. Run a specific test file with:

```bash
bun test test/targets/core-targets.test.ts
```

### Local CLI development

To test the CLI locally during development:

```bash
# From the agentpacks package directory
bun run src/index.ts init
bun run src/index.ts generate --dry-run
```

---

## Project Structure

```
packages/tools/agentpacks/
├── src/
│   ├── index.ts              # CLI entry point (commander)
│   ├── api.ts                # Programmatic API barrel
│   ├── core/                 # Config schemas, pack loader, merger, lockfile
│   ├── features/             # 8 feature parsers (rules, commands, agents, ...)
│   ├── targets/              # 20 target generators
│   ├── sources/              # Remote pack resolvers (npm, git, local)
│   ├── importers/            # Import from other tools (rulesync, cursor, ...)
│   ├── exporters/            # Export to native formats (cursor-plugin)
│   ├── cli/                  # CLI command implementations
│   └── utils/                # Shared utilities
├── test/                     # Mirrored test structure
└── templates/                # Scaffold templates for init / pack create
```

### Key conventions

- **TypeScript strict mode** throughout
- **2 spaces**, semicolons, double quotes, trailing commas
- **Max 250 lines per file** (components: 150, utilities: 100)
- **Barrel `index.ts`** in every directory that is exported
- **Tests live in `test/`** mirroring the `src/` structure

---

## Reporting Bugs

Before reporting, please:

1. Search [existing issues](https://github.com/lssm-tech/contractspec/issues?q=is%3Aissue+label%3Aagentpacks) to avoid duplicates
2. Try to reproduce with the latest version (`npm install -g agentpacks@latest`)

When opening a bug report, use the **Bug report** template and include:

- The command you ran and any flags
- Your `agentpacks.jsonc` (redact any secrets)
- The full error output (with `--verbose` if possible)
- Your environment: agentpacks version, OS, Node/Bun version

**[Open a bug report](https://github.com/lssm-tech/contractspec/issues/new?template=bug_report.md&labels=agentpacks)**

---

## Requesting Features

agentpacks is actively developed. We especially welcome proposals for:

- New AI tool targets (new IDEs/CLIs that need configs)
- New pack feature types
- Improved import/export formats
- DX improvements to the CLI

When proposing a feature:

1. **Start with the problem**, not the solution. Explain what you're trying to do and why current behavior falls short.
2. **Describe the solution** you have in mind, including any config/API changes.
3. **Consider alternatives** — are there workarounds today? How do other tools solve this?

**[Open a feature request](https://github.com/lssm-tech/contractspec/issues/new?template=feature_request.md&labels=agentpacks)**

For large changes (new feature types, new architecture), consider opening a **[RFC discussion](https://github.com/lssm-tech/contractspec/issues/new?template=rfc.md&labels=agentpacks)** first to align on the approach before writing code.

---

## Adding a New Target

Adding support for a new AI tool is one of the most impactful contributions.

### Simple targets (rules + MCP only)

Use the generic factory in `src/targets/additional-targets.ts`:

```typescript
createGenericMdTarget({
  id: "mytool",
  name: "My Tool",
  configDir: ".mytool",
  supportedFeatures: ["rules", "mcp", "ignore"],
  ignoreFile: ".mytoolignore",
});
```

Register it in `src/targets/registry.ts` and add the ID to `TARGET_IDS` in `src/core/config.ts`.

### Rich targets (custom file formats)

For tools with unique formats (like Cursor's `.mdc` files or Claude Code's `CLAUDE.md`), create a dedicated class in `src/targets/` extending `BaseTarget`. See `src/targets/cursor.ts` or `src/targets/claude-code.ts` as examples.

### Test your target

Add a test case to `test/targets/core-targets.test.ts` following the existing pattern for each target.

---

## Adding a New Importer

Importers live in `src/importers/`. Each importer reads an existing tool's config format and returns a `Pack` object.

See `src/importers/rulesync.ts` or `src/importers/cursor.ts` for reference implementations.

Register your importer in `src/cli/import-cmd.ts`.

---

## Pull Request Process

1. **Fork** the repository and create a branch from `release`

   ```bash
   git checkout -b feat/agentpacks-my-feature release
   ```

2. **Make your changes**, keeping files under 250 lines and following code style

3. **Add tests** for any new behavior — we aim to keep the test suite comprehensive

4. **Run checks** before pushing:

   ```bash
   bun test            # all tests must pass
   bun run build       # build must succeed
   ```

5. **Create a changeset** for user-facing changes:

   ```bash
   bun changeset
   # select: agentpacks
   # select: patch | minor | major
   # describe the change
   ```

6. **Commit using Conventional Commits**:

   ```
   feat(agentpacks): add support for Windsurf agent files
   fix(agentpacks): handle missing mcp.json gracefully
   docs(agentpacks): clarify pack frontmatter examples
   test(agentpacks): add coverage for git source resolver
   ```

7. **Open a PR** against the `release` branch using the [PR template](https://github.com/lssm-tech/contractspec/blob/main/.github/PULL_REQUEST_TEMPLATE.md)

8. A maintainer will review your PR. CI checks will run automatically.

---

## Code Style Quick Reference

| Rule            | Value                  |
| --------------- | ---------------------- |
| Language        | TypeScript (strict)    |
| Indentation     | 2 spaces               |
| Quotes          | Double                 |
| Semicolons      | Yes                    |
| Trailing commas | Yes                    |
| Max file length | 250 lines              |
| `any` type      | Forbidden              |
| Barrel exports  | Required per directory |
| Test framework  | Bun test               |

---

## Asking Questions

- **Discussions**: Use [GitHub Discussions](https://github.com/lssm-tech/contractspec/discussions) for open-ended questions
- **Q&A**: Use the [Q&A discussion category](https://github.com/lssm-tech/contractspec/discussions/categories/q-a) for specific how-to questions
- **Docs issues**: If a guide is unclear, [open a docs issue](https://github.com/lssm-tech/contractspec/issues/new?template=docs_issue.md&labels=agentpacks)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold it.

Please report unacceptable behavior to [security@contractspec.io](mailto:security@contractspec.io).

---

Thank you for helping make agentpacks better for everyone!
