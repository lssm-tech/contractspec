# @contractspec/app.cli-databases

Website: https://contractspec.io

**CLI orchestrator for multi-database workflows. Coordinates operations across multiple database profiles defined in a project.**

## What It Does

- Lightweight CLI with no workspace bundle dependencies.
- Uses minimist for argument parsing, execa for subprocess execution.
- Delegates per-database work to `cli-database`.
- Related ContractSpec packages include `@contractspec/tool.tsdown`, `@contractspec/tool.typescript`.

## Running Locally

From `packages/apps/cli-databases`:
- `bun run dev`
- `bun run build`

## Usage

```bash
npx databases --help
# or
bunx databases --help
```

## Architecture

- Lightweight CLI with no workspace bundle dependencies.
- Uses minimist for argument parsing, execa for subprocess execution.
- Delegates per-database work to `cli-database`.
- `src/cli.ts` is the CLI entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Binary `databases` points to `dist/cli.js`.
- Export `.` resolves through `./dist/index.mjs`.
- Export `./cli` resolves through `./dist/cli.mjs`.
- Export `./profile` resolves through `./dist/profile.mjs`.
- Export `./*` resolves through `./*`.

## Local Commands

- `bun run dev` — bun run build --watch
- `bun run build` — tsdown
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Keep this as a thin orchestrator — business logic belongs in `cli-database`.
- Do not change CLI argument signatures without updating docs and CI scripts.
