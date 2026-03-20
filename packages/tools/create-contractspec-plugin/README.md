# @contractspec/tool.create-contractspec-plugin

Website: https://contractspec.io

**CLI tool for creating ContractSpec plugins from templates.**

## What It Provides

- **Layer**: tool.
- **Consumers**: plugin authors (via `create-contractspec-plugin` CLI).
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/tool.create-contractspec-plugin`

or

`bun add @contractspec/tool.create-contractspec-plugin`

## Usage

```bash
npx create-contractspec-plugin --help
# or
bunx create-contractspec-plugin --help
```

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/templates` is part of the package's public or composition surface.
- `src/utils.ts` is part of the package's public or composition surface.

## Public Entry Points

- Binary `create-contractspec-plugin` points to `./dist/index.js`.
- Export `.` resolves through `./src/index.ts`.
- Export `./templates/example-generator` resolves through `./src/templates/example-generator.ts`.
- Export `./utils` resolves through `./src/utils.ts`.

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

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Template files live in `templates/` -- keep them in sync with the current plugin contract.
- Do not change interactive prompts without updating the corresponding template variables.
- Depends on `@contractspec/lib.contracts-spec` and `@contractspec/lib.schema` -- respect their APIs.
