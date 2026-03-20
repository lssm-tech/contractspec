# AI Agent Guide — `@contractspec/app.cli-databases`

Scope: `packages/apps/cli-databases/*`

CLI orchestrator for multi-database workflows. Coordinates operations across multiple database profiles defined in a project.

## Quick Context

- Layer: `app`.
- Package visibility: published package.
- Primary consumers are deployed users, operators, or external clients of this app surface.
- Related packages: `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Architecture

- Lightweight CLI with no workspace bundle dependencies.
- Uses minimist for argument parsing, execa for subprocess execution.
- Delegates per-database work to `cli-database`.
- `src/cli.ts` is the CLI entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Binary `databases` points to `dist/cli.js`.
- Export `.` resolves through `./dist/index.mjs`.
- Export `./cli` resolves through `./dist/cli.mjs`.
- Export `./profile` resolves through `./dist/profile.mjs`.
- Export `./*` resolves through `./*`.

## Guardrails

- Keep this as a thin orchestrator — business logic belongs in `cli-database`.
- Do not change CLI argument signatures without updating docs and CI scripts.
- Changes here can affect downstream packages such as `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — bun run build --watch
- `bun run build` — tsdown
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
