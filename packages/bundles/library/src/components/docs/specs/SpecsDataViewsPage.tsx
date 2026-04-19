import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const SPECS_DATAVIEWS_EXAMPLE = `import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import { ListDataGridShowcaseRowsQuery } from '@contractspec/example.data-grid-showcase/contracts/data-grid-showcase.operation';

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
});`;

// export const metadata = {
//   title: 'DataViews: ContractSpec Docs',
//   description:
//     'Learn how to define data views for querying, filtering, and presenting data in ContractSpec.',
// };

export function SpecsDataViewsPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">DataViews</h1>
				<p className="text-muted-foreground">
					A <strong>DataViewSpec</strong> describes how data should be queried,
					filtered, sorted, and presented to users. Runtime adapters execute
					optimized database queries and serve list views, detail views, and
					search interfaces while respecting policy constraints.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Core concepts</h2>
				<div className="space-y-3">
					<div>
						<h3 className="font-semibold text-lg">Data sources</h3>
						<p className="text-muted-foreground">
							A DataView connects to one or more data sources—databases, APIs,
							or other capabilities. You specify the source and the fields you
							want to expose.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Filtering</h3>
						<p className="text-muted-foreground">
							Define filters that users can apply to narrow down results.
							Filters can be simple (e.g., "status equals 'active'") or complex
							(e.g., "created within the last 30 days AND assigned to current
							user").
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Sorting</h3>
						<p className="text-muted-foreground">
							Specify which fields can be sorted and the default sort order.
							ContractSpec generates efficient database queries with proper
							indexes.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Pagination</h3>
						<p className="text-muted-foreground">
							DataViews automatically support pagination to handle large
							datasets. You can configure page size limits and cursor-based or
							offset-based pagination.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Aggregations</h3>
						<p className="text-muted-foreground">
							Compute aggregates like counts, sums, averages, and group-by
							operations. These are useful for dashboards and summary views.
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Example DataViewSpec</h2>
				<p className="text-muted-foreground">
					Here is the canonical table contract used by the live{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Data Grid Showcase
					</Link>
					:
				</p>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{SPECS_DATAVIEWS_EXAMPLE}</pre>
				</div>
				<p className="text-muted-foreground text-sm">
					This one contract drives the DataView lane, while the same rows and
					controller also feed the raw web primitive, native-first primitive,
					and composed design-system demos.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Policy integration</h2>
				<p className="text-muted-foreground">
					DataViews automatically enforce{' '}
					<Link
						href="/docs/specs/policy"
						className="text-violet-400 hover:text-violet-300"
					>
						PolicySpecs
					</Link>
					. If a user doesn't have permission to see certain fields, those
					fields are automatically filtered out or redacted. If a user can only
					see their own data, the query is automatically scoped.
				</p>
				<p className="text-muted-foreground">
					This means you define the data view once, and it works correctly for
					all users based on their permissions—no need to write separate queries
					for different roles.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Served outputs</h2>
				<p className="text-muted-foreground">
					From a DataViewSpec, ContractSpec serves:
				</p>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						<strong>Database queries</strong> – Optimized SQL or NoSQL queries
						executed at runtime
					</li>
					<li>
						<strong>API endpoints</strong> – RESTful or GraphQL endpoints for
						fetching data
					</li>
					<li>
						<strong>UI components</strong> – List views, tables, cards, and
						detail views
					</li>
					<li>
						<strong>Search interfaces</strong> – Full-text search with
						autocomplete
					</li>
					<li>
						<strong>Export functions</strong> – CSV, JSON, or Excel exports
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Best practices</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						Only expose fields that users actually need—this improves
						performance and security.
					</li>
					<li>Use appropriate indexes for sortable and filterable fields.</li>
					<li>
						Set reasonable pagination limits to prevent performance issues.
					</li>
					<li>
						Use aggregations sparingly—they can be expensive on large datasets.
					</li>
					<li>
						Test DataViews with realistic data volumes to ensure they perform
						well.
					</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/specs/capabilities" className="btn-ghost">
					Previous: Capabilities
				</Link>
				<Link href="/docs/specs/workflows" className="btn-primary">
					Next: Workflows <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
