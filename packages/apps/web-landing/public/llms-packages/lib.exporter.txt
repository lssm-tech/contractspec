# @contractspec/lib.exporter

Website: https://contractspec.io

**Compatibility exporter shim backed by the SchemaModel-first data exchange core.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- Legacy `toCsvGeneric(...)` and `toXmlGeneric(...)` wrappers preserved for compatibility.
- New `toJsonGeneric(...)` wrapper for the same legacy payload shape.
- Internally delegates to `@contractspec/lib.data-exchange-core`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.exporter`

or

`bun add @contractspec/lib.exporter`

## Usage

Import the root entrypoint from `@contractspec/lib.exporter`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

- This package is now a compatibility surface; prefer `@contractspec/lib.data-exchange-core` for new work.
- Export format must stay consistent for downstream consumers; column order and encoding are part of the contract.
- Do not introduce platform-specific APIs (Node-only or browser-only) without a universal fallback.
