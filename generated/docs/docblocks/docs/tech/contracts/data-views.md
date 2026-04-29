# DataViewSpec Overview

## Purpose

`DataViewSpec` is the declarative contract for projecting entities into list/detail/table/grid experiences. Each spec ties to contract operations (`source.primary`, `source.item`) and describes how the UI should present, sort, filter, paginate, and pin records. Host applications use the spec to render UI with shared components (`DataViewRenderer`, `DataViewList`, `DataViewTable`, `DataViewDetail`) while keeping presentation logic in a single source of truth.

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
  - `list`: card/compact list, `primaryField`, `secondaryFields`, optional shared `collection` defaults.
  - `table`: column configuration plus execution mode, selection, column visibility, column resizing, column pinning, row expansion, initial state, and optional shared `collection` defaults.
  - `detail`: sections of fields for record inspection.
  - `grid`: multi-column card grid with optional shared `collection` defaults.
- **DataViewCollectionConfig**: shared listing defaults for `list`, `grid`, and `table`, including allowed/default view modes, toolbar controls, query page size, density, data depth, and personalization persistence hints. `view.kind` remains the authored canonical shape; renderers may project to allowed collection modes without mutating the source spec.
- **DataViewField**: `key`, `label`, `dataPath`, formatting hints (`format`), sort/filter toggles, optional presentation override, and optional `visibility.minDataDepth` for summary/standard/detailed/exhaustive projection.
- **DataViewFilter**: describes filter inputs (search, enum, number, date, boolean).
- **DataViewAction**: simple declarative actions (`navigation` or `operation`).

## Registry Usage

```ts
import { DataViewRegistry } from '@contractspec/lib.contracts-spec/data-views';
import { ResidentsDataView } from './data-views/residents.data-view';

const registry = new DataViewRegistry();
registry.register(ResidentsDataView);

const listView = registry.get('residents.admin.list');
```

Registries guard against duplicate `(name, version)` pairs and make latest-version lookup trivial.

## Rendering

```tsx
import { DataViewRenderer } from '@contractspec/lib.design-system';
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
- `DataViewTable` – tabular presentation with shared sorting, pagination, visibility, pinning, resizing, and expansion controls
- `DataViewDetail` – two-column grouped layout for record inspection

Renderers rely on the field definitions (`dataPath`, `format`) to extract values and render them consistently.

Collection renderers can also accept `viewMode`, `density`, and `dataDepth`
props directly. Apps that use `@contractspec/lib.personalization` should resolve
user or behavior-derived preferences with `resolveDataViewPreferences(...)` and
pass the resulting plain values into `DataViewRenderer`; the design-system
renderer intentionally has no hard dependency on personalization.

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
- Policy-aware field visibility for table columns.
- Automated docs/LLM sync via CLI.
