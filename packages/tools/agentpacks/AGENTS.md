# AI Agent Guide — `agentpacks`

Scope: `packages/tools/agentpacks/*`

Composable AI agent configuration manager that merges packs into target-specific tool configuration, rules, hooks, skills, and AGENTS output.

## Quick Context

- Layer: `tool`.
- Package visibility: published package.
- Primary consumers are developers, CI jobs, and repository automation flows.
- Related packages: `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/cli/` contains command implementations for init, generate, install, publish, search, and pack subcommands.
- `src/core/` handles config loading, dependency resolution, pack loading, lockfiles, and feature merging.
- `src/features/`, `src.sources/`, `src.targets/`, `src.importers/`, and `src.exporters/` implement the pack pipeline.
- `src.utils/` contains credentials, diffing, markdown, registry, and model-helper utilities.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

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

## Guardrails

- Target output formats are compatibility contracts for downstream tools; change them deliberately.
- Pack schema and model guidance changes should remain backward-compatible for existing packs.
- AGENTS generation is automatic and depends on root-rule handling; keep target behavior aligned with documented expectations.
- Changes here can affect downstream packages such as `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
