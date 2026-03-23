# @contractspec/lib.email

**Email sending via Scaleway SDK. Provides a provider-agnostic client interface for transactional email.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- Related ContractSpec packages include `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.email`

or

`bun add @contractspec/lib.email`

## Usage

Import the root entrypoint from `@contractspec/lib.email`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/client.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.
- `src/utils.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./client` resolves through `./src/client.ts`.
- Export `./types` resolves through `./src/types.ts`.
- Export `./utils` resolves through `./src/utils.ts`.

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

- Client interface abstracts the provider; do not leak Scaleway-specific types into the public API.
- Keep the adapter boundary clean so the provider can be swapped without consumer changes.
