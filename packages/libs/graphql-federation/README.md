# @contractspec/lib.graphql-federation

Website: https://contractspec.io

**Pothos federation helpers and subgraph schema export utilities.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles with federated GraphQL.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.graphql-federation`

or

`bun add @contractspec/lib.graphql-federation`

## Usage

Import the root entrypoint from `@contractspec/lib.graphql-federation`, or choose a documented subpath when you only need one part of the package surface.

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

- Federation directives must comply with the Apollo Federation spec; non-compliant changes break gateway composition.
- Depends on graphql-core — keep builder factory usage aligned.
