# @contractspec/example.data-grid-showcase

Website: https://contractspec.io

**Canonical data-table example for the ContractSpec stack.**

## What This Demonstrates

- The same account-grid example across `@contractspec/lib.contracts-spec`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, and `@contractspec/lib.design-system`.
- Client-mode and server-mode table controllers with sorting, pagination, single and multiple selection, column visibility, resizing, left/right pinning, and row expansion.
- Loading states, empty states, design-system header actions, toolbar/footer slots, and a visible row-interaction log.
- A declarative `DataViewSpec` table contract that adapts onto the same headless table stack.
- Sandbox-friendly UI packaging for a focused canonical example instead of a full business template.

## Running Locally

From `packages/examples/data-grid-showcase`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.data-grid-showcase` as the canonical reference for ContractSpec table capabilities, or import its exported contracts and UI into docs, sandboxes, and internal examples.

## Live surfaces

- Sandbox: `/sandbox?template=data-grid-showcase`
- Docs example: `/docs/examples/data-grid-showcase`
- Generated reference: `/docs/reference/data-grid-showcase/data-grid-showcase`

## Architecture

- `src/contracts/` owns the sample query contract and declarative data view spec.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the example manifest surfaced by `@contractspec/module.examples`.
- `src/ui/` contains the table showcase component, the primitive/composed table lanes, and demo data/helpers.

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

## Data table contract example

The declarative contract lane uses the same account-grid example exposed in the interactive showcase:

```ts
import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import { ListDataGridShowcaseRowsQuery } from './data-grid-showcase.operation';

export const DataGridShowcaseDataView = defineDataView({
  meta: {
    key: 'examples.data-grid-showcase.table',
    version: '1.0.0',
    entity: 'account',
    title: 'Data Grid Showcase Table',
    description:
      'Declarative DataViewSpec for the ContractSpec table showcase.',
    domain: 'examples',
    owners: ['@platform.core'],
    tags: ['examples', 'table', 'data-grid'],
    stability: 'experimental',
  },
  source: {
    primary: {
      key: ListDataGridShowcaseRowsQuery.meta.key,
      version: ListDataGridShowcaseRowsQuery.meta.version,
    },
  },
  view: {
    kind: 'table',
    executionMode: 'client',
    selection: 'multiple',
    columnVisibility: true,
    columnResizing: true,
    columnPinning: true,
    rowExpansion: {
      fields: ['notes', 'renewalDate', 'lastActivityAt'],
    },
    initialState: {
      pageSize: 4,
      hiddenColumns: ['notes'],
      pinnedColumns: {
        left: ['account'],
      },
      sorting: [{ field: 'arr', desc: true }],
    },
    fields: [
      { key: 'account', label: 'Account', dataPath: 'account', sortable: true },
      { key: 'owner', label: 'Owner', dataPath: 'owner', sortable: true },
      { key: 'status', label: 'Status', dataPath: 'status', sortable: true },
      { key: 'notes', label: 'Notes', dataPath: 'notes' },
    ],
  },
});
```

## Notes

- This package is intentionally narrow: it exists to showcase the full table stack, not to simulate a full vertical business template.
- The same table stack is reused by the larger examples in `analytics-dashboard`, `crm-pipeline`, `integration-hub`, and `agent-console`, but this package is the canonical source of truth.
