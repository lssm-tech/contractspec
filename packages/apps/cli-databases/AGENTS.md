# AI Agent Guide — `cli-databases`

Scope: `packages/apps/cli-databases/*`

CLI orchestrator for multi-database workflows. Coordinates operations across multiple database profiles defined in a project.

## Quick Context

- **Layer**: app (CLI)
- **Consumers**: developers, CI pipelines

## Architecture

- Lightweight CLI with no workspace bundle dependencies
- Uses minimist for argument parsing, execa for subprocess execution
- Delegates per-database work to `cli-database`

## Key Files

- `src/cli.ts` — CLI entry point (binary: `databases`)
- `src/index.ts` — Library exports
- `src/profile.ts` — Database profile management

## Public Exports

- `.` → `dist/index.mjs`
- `./cli` → `dist/cli.mjs`

## Guardrails

- Keep this as a thin orchestrator — business logic belongs in `cli-database`
- Do not change CLI argument signatures without updating docs and CI scripts

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Lint: `bun run lint`
