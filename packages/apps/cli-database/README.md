# @contractspec/app.cli-database

Website: https://contractspec.io

**CLI tool for single-database management: import, generate, migrate, seed, and schema operations. Wraps Prisma with ContractSpec schema conventions.**

## What It Does

- Uses `@contractspec/lib.schema` for schema definitions.
- Uses Prisma for database operations and migrations.
- Commands dispatched via minimist argument parsing.
- Related ContractSpec packages include `@contractspec/lib.schema`, `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Running Locally

From `packages/apps/cli-database`:
- `bun run dev`
- `bun run build`

## Usage

```bash
npx database --help
# or
bunx database --help
```

## Architecture

- Uses `@contractspec/lib.schema` for schema definitions.
- Uses Prisma for database operations and migrations.
- Commands dispatched via minimist argument parsing.
- `src/cli.ts` is the CLI entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Binary `database` points to `dist/cli.js`.
- Export `.` resolves through `./dist/index.mjs`.
- Export `./cli` resolves through `./dist/cli.mjs`.
- Export `./commands/check` resolves through `./dist/commands/check.mjs`.
- Export `./commands/generate` resolves through `./dist/commands/generate.mjs`.
- Export `./commands/import` resolves through `./dist/commands/import.mjs`.
- Export `./commands/migrate` resolves through `./dist/commands/migrate.mjs`.
- Export `./commands/schema-compose` resolves through `./dist/commands/schema-compose.mjs`.
- Export `./commands/schema-generate` resolves through `./dist/commands/schema-generate.mjs`.
- Export `./commands/seed` resolves through `./dist/commands/seed.mjs`.
- Export `./lib/config` resolves through `./dist/lib/config.mjs`.
- The package publishes 12 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — bun run build --watch
- `bun run build` — tsdown
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run prisma:format` — prisma format
- `bun run prisma:import` — database import
- `bun run prisma:check` — database check
- `bun run dbs:generate` — database generate
- `bun run dbs:migrate` — database migrate:dev
- `bun run dbs:deploy` — database migrate:deploy
- `bun run dbs:status` — database migrate:status
- `bun run dbs:seed` — database seed

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Do not change CLI argument signatures without updating docs and CI scripts.
- Prisma schema generation is order-sensitive — test migrations carefully.
