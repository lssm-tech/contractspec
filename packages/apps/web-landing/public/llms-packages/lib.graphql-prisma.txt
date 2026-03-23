# @contractspec/lib.graphql-prisma

Website: https://contractspec.io

**Pothos + Prisma builder factory with injectable client/DMMF.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles with Prisma.
- Related ContractSpec packages include `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.graphql-prisma`

or

`bun add @contractspec/lib.graphql-prisma`

## Usage

Import the root entrypoint from `@contractspec/lib.graphql-prisma`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run prebuild` — contractspec-bun-build prebuild
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Prisma client injection must stay lazy — eagerly importing the client breaks tree-shaking and test isolation.
- DMMF handling is version-sensitive; Prisma major upgrades require validation here first.
- Depends on graphql-core — keep builder factory usage aligned.
