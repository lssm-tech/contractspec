# @contractspec/lib.ui-kit

`@contractspec/lib.ui-kit` provides cross-platform UI components for native-first and Expo-based surfaces, with most real usage happening through `./ui/*` subpaths rather than the root barrel.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.ui-kit`

or

`npm install @contractspec/lib.ui-kit`

## What belongs here

This package owns the native-first component layer for ContractSpec UI work:

- React Native and Expo component wrappers.
- Shared UI building blocks such as forms, tables, overlays, navigation, loading states, marketing blocks, and visualization surfaces.
- Platform-aware helpers such as `useColorScheme` and list state helpers.

Use this package for Expo and React Native surfaces. Do not use it as the design-token layer or as the framework-agnostic link package.

## API map

### Forms and inputs

- `./ui/input`
- `./ui/input-password`
- `./ui/textarea`
- `./ui/select`
- `./ui/form`
- `./ui/field`

Native contract-driven forms consume the shared `Field` semantics through the
design-system renderer; web-only input-addon composition remains in
`@contractspec/lib.ui-kit-web/ui/input-group` and the design-system platform
facade.

`./ui/input-password` provides the native masked password primitive with
current/new password autocomplete hints and a right-side visibility toggle.

### Overlays and menus

- `./ui/dialog`
- `./ui/alert-dialog`
- `./ui/popover`
- `./ui/sheet`
- `./ui/dropdown-menu`
- `./ui/context-menu`
- `./ui/portal`
- `./ui/toast`
- `./ui/toolbar`

### Navigation and display

- `./ui/link`
- `./ui/sidebar`
- `./ui/navigation-menu`
- `./ui/page-header`
- `./ui/table`
- `./ui/data-table`
- `./ui/card`
- `./ui/empty-state`
- `./ui/slider`

## Data table example

The canonical data-table example lives in
[`@contractspec/example.data-grid-showcase`](../../examples/data-grid-showcase/README.md).
Its native-first lane renders the same account-grid controller through
`@contractspec/lib.ui-kit/ui/data-table`:

```tsx
import { DataTable } from '@contractspec/lib.ui-kit/ui/data-table';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

import { SHOWCASE_ROWS } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { useShowcaseColumns } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.columns';
import {
  ExpandedRowContent,
  ShowcaseToolbar,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.parts';

export function NativeAccountGrid() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: 'single',
    initialState: {
      sorting: [{ id: 'arr', desc: true }],
      pagination: { pageIndex: 0, pageSize: 4 },
      columnVisibility: { notes: false },
      columnPinning: { left: ['account'], right: [] },
    },
    renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
    getCanExpand: () => true,
  });

  return (
    <DataTable
      controller={controller}
      toolbar={
        <ShowcaseToolbar
          controller={controller}
          label="Native primitive"
          primaryColumnId="account"
          toggleColumnId="notes"
          pinColumnId="owner"
          sortColumnIds={['arr', 'renewalDate']}
        />
      }
      loading={false}
      footer={\`Rows \${controller.rows.length}\`}
    />
  );
}
```

Cells receive overflow behavior from the table controller. Native renderers use
single-line ellipsis for `truncate` and `expand`, multiline text for `wrap`,
and preserve caller rendering for `none`.

This example explicitly demonstrates the same sorting, pagination, selection, column visibility, column resizing, left/right pinning, row expansion, loading, and empty-state contracts used by the browser lanes.

### Hooks, utilities, and grouped surfaces

- `./ui/useColorScheme`
- `./ui/useListState`
- `./ui/utils`
- grouped subpaths under `./ui/marketing`, `./ui/usecases`, and `./ui/visualization`
- icons under `./ui/icons/*`
- shared semantic contracts are defined in `@contractspec/lib.ui-kit-core/interfaces`

## Public surface

The current root entry exists, but it is not the meaningful consumer surface for this package.

Consumers should import `./ui/*` subpaths directly. The public surface is best understood in groups:

- atoms and controls
- forms
- overlays and menus
- navigation and layout
- data display
- loading and empty states
- marketing and use-case blocks
- organisms and visualization
- hooks, utilities, and icons

Use `package.json` as the exhaustive source of truth for all exported subpaths.

## Operational semantics and gotchas

- Consumers should import subpaths directly; the root package is not the useful primary API today.
- Many components wrap Expo, React Native, or RN-oriented primitives and dependencies.
- `./ui/link` is router-coupled through `expo-router`.
- `./ui/useColorScheme` is built on `nativewind`.
- `./ui/utils` exposes a local `cn()` helper, but the deeper compatibility dependency is `@contractspec/lib.ui-kit-core`.
- This package is native-first even when some components can render cross-platform through React Native Web.

## When not to use this package

- Do not use it for pure web-first Radix or Next.js surfaces.
- Do not use it for token or theming orchestration.
- Do not use it for framework-agnostic link behavior.

## Related packages

- `@contractspec/lib.ui-kit-core`: tiny shared utility layer used by the UI packages.
- `@contractspec/lib.ui-kit-web`: web-first component package for React and Next surfaces.
- `@contractspec/lib.design-system`: higher-level design-system and composition layer built on top of the UI packages.

## Local commands

- `bun run lint:check`
- `bun run typecheck`
