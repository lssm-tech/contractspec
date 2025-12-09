# DataViewSpec Overview

## Purpose

`DataViewSpec` is the declarative contract for projecting entities into list/detail/table/grid experiences. Each spec ties to contract operations (`source.primary`, `source.item`) and describes how the UI should present, sort, and filter records. Host applications use the spec to render UI with shared components (`DataViewRenderer`, `DataViewList`, `DataViewTable`, `DataViewDetail`) while keeping presentation logic in a single source of truth.

## Location

- Type definitions and registry: `packages/libs/contracts/src/data-views.ts`
- React renderers: `packages/libs/design-system/src/components/data-view`
- CLI scaffolding: `contractspec create --type data-view`

## Schema Highlights

```ts
export interface DataViewSpec {
  meta: DataViewMeta;       // ownership meta + { name, version, entity }
  source: DataViewSource;   // contract operations and refresh events
  view: DataViewConfig;     // union of list/detail/table/grid definitions
  states?: DataViewStates;  // optional empty/error/loading presentations
  policy?: { flags?: string[]; pii?: string[] };
}
```

- **DataViewMeta**: `name`, `version`, `entity`, ownership metadata (title, description, domain, owners, tags, stability).
- **DataViewSource**:
  - `primary`: required query operation (`OpRef`) for fetching collections.
  - `item`: optional detail query (recommended for `detail` views).
  - `mutations`: optional create/update/delete operation refs.
  - `refreshEvents`: events that should trigger refresh.
- **DataViewConfig** (union):
  - `list`: card/compact list, `primaryField`, `secondaryFields`.
  - `table`: column configuration (`columns`, alignments, density).
  - `detail`: sections of fields for record inspection.
  - `grid`: multi-column grid (rendered as card list today).
- **DataViewField**: `key`, `label`, `dataPath`, formatting hints (`format`), sort/filter toggles, optional presentation override.
- **DataViewFilter**: describes filter inputs (search, enum, number, date, boolean).
- **DataViewAction**: simple declarative actions (`navigation` or `operation`).

## Registry Usage

```ts
import { DataViewRegistry } from '@lssm/lib.contracts/data-views';
import { ResidentsDataView } from './data-views/residents.data-view';

const registry = new DataViewRegistry();
registry.register(ResidentsDataView);

const listView = registry.get('residents.admin.list');
```

Registries guard against duplicate `(name, version)` pairs and make latest-version lookup trivial.

## Rendering

```tsx
import { DataViewRenderer } from '@lssm/lib.design-system';
import { ResidentsDataView } from '../contracts/data-views/residents.data-view';

function ResidentsTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <DataViewRenderer
      spec={ResidentsDataView}
      items={rows}
      onRowClick={(row) => console.log('Selected', row)}
    />
  );
}
```

For more control, use specific components:

- `DataViewList` – friendly cards/rows
- `DataViewTable` – tabular presentation with optional header/footers
- `DataViewDetail` – two-column grouped layout for record inspection

Renderers rely on the field definitions (`dataPath`, `format`) to extract values and render them consistently.

## CLI Scaffolding

```bash
# Interactive wizard
contractspec create --type data-view

# Generates packages/.../data-views/<name>.data-view.ts

# Optional renderer scaffold
contractspec build path/to/<name>.data-view.ts
# → produces <name>.renderer.tsx that wraps DataViewRenderer with sensible props
```

Wizard prompts:
- name (dot notation), version, entity
- kind (`list`, `table`, `detail`, `grid`)
- primary query operation (required) and optional item query
- fields (label, data path, format, sorting/filtering)

## Authoring Guidelines

1. **Separation of data & presentation**: keep fetching logic inside contract operations; DataViewSpec only references them via `source`.
2. **Versioning**: bump `meta.version` when field membership, ordering, or semantics change.
3. **Consistency**: reuse common field keys across modules to enable shared renderers and filters.
4. **States**: reference `PresentationRef` for empty/error/loader states to ensure consistent UX.
5. **Actions**: prefer referencing contract operations instead of embedding business logic in the UI.

## Roadmap

- Derived filters from `fields.filterable` (auto-generated UI).
- Table density presets per platform.
- Bridge to PolicySpec for field-level visibility (Phase 2 policy expansion).
- Automated docs/LLM sync via CLI.

