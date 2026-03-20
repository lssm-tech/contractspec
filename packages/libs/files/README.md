# @contractspec/lib.files

Website: https://contractspec.io

**Files, documents and attachments module for ContractSpec applications.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Installation

`npm install @contractspec/lib.files`

or

`bun add @contractspec/lib.files`

## Usage

Import the root entrypoint from `@contractspec/lib.files`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/files.capability.ts` defines a capability surface.
- `src/files.feature.ts` defines a feature entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/files.docblock` resolves through `./src/docs/files.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./files.capability` resolves through `./src/files.capability.ts`.
- Export `./files.feature` resolves through `./src/files.feature.ts`.
- Export `./storage` resolves through `./src/storage/index.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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

- Storage interface is the adapter boundary — do not couple consumers to a specific storage provider.
- File entity schema is shared; field changes require migration coordination.
- Capability contract is public API.
