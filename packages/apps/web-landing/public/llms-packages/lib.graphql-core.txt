# @contractspec/lib.graphql-core

Website: https://contractspec.io

**Shared GraphQL core: Pothos builder factory, scalars, tracing & complexity.**

## What It Provides

- **Layer**: lib.
- **Consumers**: graphql-federation, graphql-prisma, contracts-runtime-server-graphql, bundles.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.graphql-core`

or

`bun add @contractspec/lib.graphql-core`

## Usage

Import the root entrypoint from `@contractspec/lib.graphql-core`, or choose a documented subpath when you only need one part of the package surface.

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

- Builder factory is consumed by all GraphQL packages — interface changes have high blast radius.
- Scalar definitions must stay aligned with the schema lib.
- Tracing and complexity plugins must not introduce runtime overhead in production without opt-in.
