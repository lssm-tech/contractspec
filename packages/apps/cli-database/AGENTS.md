# AI Agent Guide — `cli-database`

Scope: `packages/apps/cli-database/*`

CLI tool for single-database management: import, generate, migrate, seed, and schema operations. Wraps Prisma with ContractSpec schema conventions.

## Quick Context

- **Layer**: app (CLI)
- **Consumers**: developers, CI pipelines

## Architecture

- Uses `@contractspec/lib.schema` for schema definitions
- Uses Prisma for database operations and migrations
- Commands dispatched via minimist argument parsing

## Key Files

- `src/cli.ts` — CLI entry point (binary: `database`)
- `src/index.ts` — Library exports
- `src/commands/` — CLI subcommands (import, generate, migrate, seed, check, schema-*)
- `src/lib/` — Shared config, client, types, schema-config

## Public Exports

- `.` → `dist/index.mjs`
- `./cli` → `dist/cli.mjs`

## Guardrails

- Do not change CLI argument signatures without updating docs and CI scripts
- Prisma schema generation is order-sensitive — test migrations carefully

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Lint: `bun run lint`
