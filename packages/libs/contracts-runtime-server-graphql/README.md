# @contractspec/lib.contracts-runtime-server-graphql

**GraphQL server runtime adapters for ContractSpec contracts.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, apps with GraphQL.
- Related ContractSpec packages include `@contractspec/lib.contracts-runtime-server-rest`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-runtime-server-rest`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.contracts-runtime-server-graphql`

or

`bun add @contractspec/lib.contracts-runtime-server-graphql`

## Usage

Import the root entrypoint from `@contractspec/lib.contracts-runtime-server-graphql`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/graphql-pothos.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./graphql-pothos` resolves through `./src/graphql-pothos.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.

## Notes

- Pothos builder integration must stay compatible with graphql-core and graphql-prisma.
- Do not introduce direct schema mutations outside the Pothos pipeline.
