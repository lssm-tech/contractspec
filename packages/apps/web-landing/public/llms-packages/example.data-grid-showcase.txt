# @contractspec/example.data-grid-showcase

Website: https://contractspec.io

**Focused data-grid example for ContractSpec table capabilities.**

## What This Demonstrates

- ContractSpec-native table composition through `useContractTable`, `useDataViewTable`, and the design-system `DataTable`.
- Client-mode and server-mode table controllers with sorting, pagination, selection, column visibility, resizing, pinning, and row expansion.
- A declarative `DataViewSpec` table contract that adapts onto the same headless table stack.
- Sandbox-friendly UI packaging for a focused example instead of a full app template.

## Running Locally

From `packages/examples/data-grid-showcase`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.data-grid-showcase` as a focused reference for ContractSpec table primitives, or import its exported contracts and UI into docs, sandboxes, and internal examples.

## Architecture

- `src/contracts/` owns the sample query contract and declarative data view spec.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the example manifest surfaced by `@contractspec/module.examples`.
- `src/ui/` contains the table showcase component and demo data/helpers.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./contracts/data-grid-showcase.data-view` resolves through `./src/contracts/data-grid-showcase.data-view.ts`.
- Export `./contracts/data-grid-showcase.operation` resolves through `./src/contracts/data-grid-showcase.operation.ts`.
- Export `./data-grid-showcase.feature` resolves through `./src/data-grid-showcase.feature.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./ui` resolves through `./src/ui/index.ts`.
- Export `./ui/DataGridShowcase` resolves through `./src/ui/DataGridShowcase.tsx`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit

## Notes

- This package is intentionally narrow: it exists to showcase the table primitive, not to simulate a full vertical business template.
- The same table stack is reused by the larger examples in `analytics-dashboard`, `crm-pipeline`, `integration-hub`, and `agent-console`.
