# @contractspec/lib.workflow-composer

Website: https://contractspec.io

**Tenant-aware workflow composition helpers for ContractSpec.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- Related ContractSpec packages include `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.workflow-composer`

or

`bun add @contractspec/lib.workflow-composer`

## Usage

Import the root entrypoint from `@contractspec/lib.workflow-composer`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/composer.test.ts` is part of the package's public or composition surface.
- `src/composer.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/injector.ts` is part of the package's public or composition surface.
- `src/merger.ts` is part of the package's public or composition surface.
- `src/templates.ts` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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
- Add AI provider ranking system with ranking-driven model selection.
- Upgrade dependencies.

## Notes

- Workflow composition must stay tenant-isolated — no cross-tenant data leakage.
- Depends on contracts-spec — keep aligned with contract definitions.
