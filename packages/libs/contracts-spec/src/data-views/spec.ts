import type { DocBlock } from '../docs/types';
import type { ExperimentRef } from '../experiments/spec';
import type { DataViewRef } from '../features/types';
import type {
	DataViewConfig,
	DataViewMeta,
	DataViewSource,
	DataViewStates,
} from './types';

// Re-export for backwards compatibility
export type { DataViewRef };

/**
 * Complete specification for a data view.
 */
export interface DataViewSpec {
	meta: DataViewMeta;
	source: DataViewSource;
	view: DataViewConfig;
	states?: DataViewStates;
	policy?: { flags?: string[]; pii?: string[] };
	experiments?: ExperimentRef[];
}

/**
 * Helper to define a data view spec with type safety.
 */
export function defineDataView(spec: DataViewSpec): DataViewSpec {
	return spec;
}

export const tech_contracts_data_views_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.data-views',
		title: 'DataViewSpec Overview',
		summary:
			'`DataViewSpec` is the declarative contract for projecting entities into list/detail/table/grid experiences. Each spec ties to contract operations (`source.primary`, `source.item`) and describes how the UI should present, sort, filter, paginate, and pin records. Host applications use the spec to render UI with shared components (`DataViewRenderer`, `DataViewList`, `DataViewTable`, `DataViewDetail`) while keeping presentation logic in a single source of truth.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/data-views',
		tags: ['tech', 'contracts', 'data-views'],
		body: "# DataViewSpec Overview\n\n## Purpose\n\n`DataViewSpec` is the declarative contract for projecting entities into list/detail/table/grid experiences. Each spec ties to contract operations (`source.primary`, `source.item`) and describes how the UI should present, sort, filter, paginate, and pin records. Host applications use the spec to render UI with shared components (`DataViewRenderer`, `DataViewList`, `DataViewTable`, `DataViewDetail`) while keeping presentation logic in a single source of truth.\n\n## Location\n\n- Type definitions and registry: `packages/libs/contracts/src/data-views.ts`\n- React renderers: `packages/libs/design-system/src/components/data-view`\n- CLI scaffolding: `contractspec create --type data-view`\n\n## Schema Highlights\n\n```ts\nexport interface DataViewSpec {\n  meta: DataViewMeta;       // ownership meta + { name, version, entity }\n  source: DataViewSource;   // contract operations and refresh events\n  view: DataViewConfig;     // union of list/detail/table/grid definitions\n  states?: DataViewStates;  // optional empty/error/loading presentations\n  policy?: { flags?: string[]; pii?: string[] };\n}\n```\n\n- **DataViewMeta**: `name`, `version`, `entity`, ownership metadata (title, description, domain, owners, tags, stability).\n- **DataViewSource**:\n  - `primary`: required query operation (`OpRef`) for fetching collections.\n  - `item`: optional detail query (recommended for `detail` views).\n  - `mutations`: optional create/update/delete operation refs.\n  - `refreshEvents`: events that should trigger refresh.\n- **DataViewConfig** (union):\n  - `list`: card/compact list, `primaryField`, `secondaryFields`.\n  - `table`: column configuration plus execution mode, selection, column visibility, column resizing, column pinning, row expansion, and initial state.\n  - `detail`: sections of fields for record inspection.\n  - `grid`: multi-column grid (rendered as card list today).\n- **DataViewField**: `key`, `label`, `dataPath`, formatting hints (`format`), sort/filter toggles, optional presentation override.\n- **DataViewFilter**: describes filter inputs (search, enum, number, date, boolean).\n- **DataViewAction**: simple declarative actions (`navigation` or `operation`).\n\n## Registry Usage\n\n```ts\nimport { DataViewRegistry } from '@contractspec/lib.contracts-spec/data-views';\nimport { ResidentsDataView } from './data-views/residents.data-view';\n\nconst registry = new DataViewRegistry();\nregistry.register(ResidentsDataView);\n\nconst listView = registry.get('residents.admin.list');\n```\n\nRegistries guard against duplicate `(name, version)` pairs and make latest-version lookup trivial.\n\n## Rendering\n\n```tsx\nimport { DataViewRenderer } from '@contractspec/lib.design-system';\nimport { ResidentsDataView } from '../contracts/data-views/residents.data-view';\n\nfunction ResidentsTable({ rows }: { rows: Record<string, unknown>[] }) {\n  return (\n    <DataViewRenderer\n      spec={ResidentsDataView}\n      items={rows}\n      onRowClick={(row) => console.log('Selected', row)}\n    />\n  );\n}\n```\n\nFor more control, use specific components:\n\n- `DataViewList` \u2013 friendly cards/rows\n- `DataViewTable` \u2013 tabular presentation with shared sorting, pagination, visibility, pinning, resizing, and expansion controls\n- `DataViewDetail` \u2013 two-column grouped layout for record inspection\n\nRenderers rely on the field definitions (`dataPath`, `format`) to extract values and render them consistently.\n\n## CLI Scaffolding\n\n```bash\n# Interactive wizard\ncontractspec create --type data-view\n\n# Generates packages/.../data-views/<name>.data-view.ts\n\n# Optional renderer scaffold\ncontractspec build path/to/<name>.data-view.ts\n# \u2192 produces <name>.renderer.tsx that wraps DataViewRenderer with sensible props\n```\n\nWizard prompts:\n- name (dot notation), version, entity\n- kind (`list`, `table`, `detail`, `grid`)\n- primary query operation (required) and optional item query\n- fields (label, data path, format, sorting/filtering)\n\n## Authoring Guidelines\n\n1. **Separation of data & presentation**: keep fetching logic inside contract operations; DataViewSpec only references them via `source`.\n2. **Versioning**: bump `meta.version` when field membership, ordering, or semantics change.\n3. **Consistency**: reuse common field keys across modules to enable shared renderers and filters.\n4. **States**: reference `PresentationRef` for empty/error/loader states to ensure consistent UX.\n5. **Actions**: prefer referencing contract operations instead of embedding business logic in the UI.\n\n## Roadmap\n\n- Derived filters from `fields.filterable` (auto-generated UI).\n- Policy-aware field visibility for table columns.\n- Automated docs/LLM sync via CLI.\n\n",
	},
];
