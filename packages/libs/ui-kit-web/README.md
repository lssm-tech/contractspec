# @contractspec/lib.ui-kit-web

`@contractspec/lib.ui-kit-web` provides web UI components for React and Next surfaces, with accessible building blocks, Radix-based primitives, layout helpers, and web-specific UX utilities exposed through `./ui/*` subpaths.

Website: https://contractspec.io

## Installation

`bun add @contractspec/lib.ui-kit-web`

or

`npm install @contractspec/lib.ui-kit-web`

## What belongs here

This package owns the web-first component layer:

- Radix-backed web UI components.
- Web-only accessibility helpers and route-announcement primitives.
- Map, marketing, list-page, and visualization building blocks.
- Web form, navigation, and layout primitives.

Use this package for browser and Next.js surfaces. Do not use it for native or Expo UI work.

## Core workflows

### Import a web component by subpath

```ts
import { Button } from "@contractspec/lib.ui-kit-web/ui/button";
import { Form } from "@contractspec/lib.ui-kit-web/ui/form";
```

### Wire accessibility helpers at the app root

```tsx
import {
  SRLiveRegionProvider,
  useSRLiveRegion,
} from "@contractspec/lib.ui-kit-web/ui/live-region";
import { SkipLink } from "@contractspec/lib.ui-kit-web/ui/skip-link";
import { RouteAnnouncer } from "@contractspec/lib.ui-kit-web/ui/route-announcer";
import { FocusOnRouteChange } from "@contractspec/lib.ui-kit-web/ui/focus-on-route-change";

function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SRLiveRegionProvider>
      <SkipLink targetId="main" />
      <RouteAnnouncer title={title} />
      <main id="main">
        <FocusOnRouteChange />
        {children}
      </main>
    </SRLiveRegionProvider>
  );
}
```

### Render the canonical account grid

The canonical data-table example lives in
[`@contractspec/example.data-grid-showcase`](../../examples/data-grid-showcase/README.md).
Its raw browser lane renders `@contractspec/lib.ui-kit-web/ui/data-table`
directly:

```tsx
import { DataTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

import { SHOWCASE_ROWS } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { useShowcaseColumns } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.columns';
import {
  ExpandedRowContent,
  ShowcaseToolbar,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.parts';

export function WebAccountGrid() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: 'single',
    initialState: {
      sorting: [{ id: 'lastActivityAt', desc: true }],
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
          label="Web primitive"
          primaryColumnId="account"
          toggleColumnId="notes"
          pinColumnId="owner"
          sortColumnIds={['arr', 'renewalDate']}
        />
      }
      loading={false}
      emptyState={<div>No rows available.</div>}
      footer={\`Rows \${controller.totalItems}\`}
    />
  );
}
```

Use the web primitive when you want direct control over the render surface.
For higher-level search, active chips, selection summary, and hidden-column
recovery, keep this primitive lean and layer
`@contractspec/lib.design-system` `DataTableToolbar` into the `toolbar` slot.

## API map

### Controls and forms

- `./ui/button`
- `./ui/button-group`
- `./ui/input`
- `./ui/textarea`
- `./ui/select`
- `./ui/native-select`
- `./ui/field`
- `./ui/form`
- `./ui/combobox`
- `./ui/input-group`
- `./ui/input-otp`
- `./ui/spinner`
- `./ui/kbd`

### Overlays, menus, and navigation

- `./ui/dialog`
- `./ui/drawer`
- `./ui/dropdown-menu`
- `./ui/popover`
- `./ui/navigation-menu`
- `./ui/nav-layout`
- `./ui/link`

### Data display and layout

- `./ui/table`
- `./ui/data-table`
- `./ui/page-header`
- `./ui/section`
- `./ui/sidebar`
- `./ui/item`
- `./ui/chart`
- `./ui/direction`

### Accessibility helpers

- `./ui/skip-link`
- `./ui/live-region`
- `./ui/route-announcer`
- `./ui/focus-on-route-change`
- `./ui/visually-hidden`

### Hooks and grouped surfaces

- `./ui/use-media-query`
- `./ui/use-mobile`
- `./ui/use-reduced-motion`
- `./ui/use-toast`
- `./ui/utils`
- grouped subpaths under `./ui/map`, `./ui/marketing`, `./ui/usecases`, `./ui/organisms/ListPage`, and `./ui/visualization`
- shared semantic contracts are defined in `@contractspec/lib.ui-kit-core/interfaces`

## Public surface

The package publishes a root entry, but the meaningful consumer surface is `./ui/*`.

Consumers should import grouped subpaths directly. The public surface is best understood by category:

- controls and forms
- shadcn/Radix-style `Field` and `InputGroup` primitives for accessible labels, descriptions, errors, legends, addons, and grouped controls
- overlays and menus
- layout and navigation
- accessibility helpers
- data display
- grouped map, marketing, organisms, use-case, and visualization surfaces
- hooks and utilities

Use `package.json` as the exhaustive export map.

## Operational semantics and gotchas

- Components rely on Radix and browser or Next assumptions.
- `./ui/link` is based on `next/link`.
- `./ui/skip-link`, live-region helpers, and route announcers are first-class web-only APIs in this package.
- Storybook scripts exist here, unlike the other UI packages in this rewrite set.
- The package has optional map-related peer dependencies; map features should stay opt-in and not become implicit hard requirements.
- The root entry is not the meaningful consumer surface today.

## When not to use this package

- Do not use it for native or Expo surfaces.
- Do not use it for token orchestration or platform abstraction.
- Do not use it for framework-agnostic linking.

## Related packages

- `@contractspec/lib.ui-kit-core`: shared low-level utilities used across UI packages.
- `@contractspec/lib.ui-kit`: native-first component package for Expo and React Native surfaces.
- `@contractspec/lib.design-system`: higher-level design-system and composition layer built on top of the UI packages.

## Local commands

- `bun run lint:check`
- `bun run typecheck`
- `bun run test`
