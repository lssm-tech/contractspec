# agentpacks

Website: https://github.com/lssm-tech/contractspec/tree/main/packages/tools/agentpacks

**Composable AI agent configuration manager that merges packs into target-specific tool configuration, rules, hooks, skills, and AGENTS output.**

## What It Provides

- Loads, merges, and resolves agent packs into Cursor, Claude Code, Codex, Copilot, Gemini, OpenCode, registry, and AGENTS targets.
- Publishes a CLI plus a broad programmatic API for pack loading, sources, targets, importers, and exporters.
- Recently expanded around AI-native flows, model guidance, Cursor plugin output, and compatibility hardening.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install agentpacks`

or

`bun add agentpacks`

## Usage

```bash
npx agentpacks --help
# or
bunx agentpacks --help
```

## Architecture

- `src/cli/` contains command implementations for init, generate, install, publish, search, and pack subcommands.
- `src/core/` handles config loading, dependency resolution, pack loading, lockfiles, and feature merging.
- `src/features/`, `src.sources/`, `src.targets/`, `src.importers/`, and `src.exporters/` implement the pack pipeline.
- `src.utils/` contains credentials, diffing, markdown, registry, and model-helper utilities.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Exports the CLI binary plus API, core, features, targets, sources, importers, exporters, and utility subpaths.
- Binary `agentpacks` points to `./dist/index.js`.
- Export `.` resolves through `./src/index.ts`.
- Export `./api` resolves through `./src/api.ts`.
- Export `./cli/export-cmd` resolves through `./src/cli/export-cmd.ts`.
- Export `./cli/generate` resolves through `./src/cli/generate.ts`.
- Export `./cli/import-cmd` resolves through `./src/cli/import-cmd.ts`.
- Export `./cli/info` resolves through `./src/cli/info.ts`.
- Export `./cli/init` resolves through `./src/cli/init.ts`.
- Export `./cli/install` resolves through `./src/cli/install.ts`.
- Export `./cli/login` resolves through `./src/cli/login.ts`.
- Export `./cli/models-explain` resolves through `./src/cli/models-explain.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Use the Biome-only lint and formatting workflow in pack guidance and generated targets.
- Vnext ai-native.
- Add latest models and align defaults.
- Harden AgentSkills compatibility in agentpacks.
- Add first-class mistral provider support.
- Align cursor plugin export and hooks output.

## Notes

- Do not modify target output formats without updating the corresponding target writer.
- Pack schema changes must stay backward-compatible (see `schema.json`).
- Never hard-code model names; use `utils/model-allowlist` and `utils/model-guidance`.
