import { CodeBlock } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { List, ListItem } from '@contractspec/lib.design-system/list';
import {
	Code,
	H1,
	H2,
	H3,
	P,
	Text,
} from '@contractspec/lib.design-system/typography';
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
      {
        key: 'arr',
        label: 'ARR',
        dataPath: 'arr',
        sortable: true,
        format: { type: 'currency', currency: 'USD', rounded: true },
      },
      {
        key: 'healthScore',
        label: 'Health score',
        dataPath: 'healthScore',
        format: { type: 'percent', valueScale: 'fraction', maximumFractionDigits: 1 },
      },
      {
        key: 'lastActivityAt',
        label: 'Last activity',
        dataPath: 'lastActivityAt',
        format: { type: 'datetime', dateStyle: 'medium', timeStyle: 'short' },
      },
      {
        key: 'notes',
        label: 'Notes',
        dataPath: 'notes',
        visibility: { minDataDepth: 'detailed' },
      },
    ],
    collection: {
      viewModes: {
        defaultMode: 'table',
        allowedModes: ['list', 'grid', 'table'],
      },
      pagination: {
        pageSize: 25,
        pageSizeOptions: [10, 25, 50],
      },
      toolbar: {
        search: true,
        viewMode: true,
        filters: true,
        density: true,
        dataDepth: true,
      },
      density: 'comfortable',
      dataDepth: 'standard',
      personalization: {
        enabled: true,
        persist: {
          viewMode: true,
          density: true,
          dataDepth: true,
          pageSize: true,
        },
      },
    },
    filters: [
      { key: 'status', label: 'Status', field: 'status', type: 'enum' },
      {
        key: 'arr',
        label: 'ARR',
        field: 'arr',
        type: 'currency',
        valueMode: 'range',
      },
      {
        key: 'lastActivityAt',
        label: 'Last activity',
        field: 'lastActivityAt',
        type: 'datetime',
        valueMode: 'range',
      },
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
		<VStack className="space-y-8">
			<VStack className="space-y-4">
				<H1 className="font-bold text-4xl">DataViews</H1>
				<P className="text-muted-foreground">
					A <Text className="font-semibold">DataViewSpec</Text> describes how
					data should be queried, filtered, sorted, and presented to users.
					Runtime adapters execute optimized database queries and serve list
					views, detail views, and search interfaces while respecting policy
					constraints.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Core concepts</H2>
				<VStack className="space-y-3">
					<VStack>
						<H3 className="font-semibold text-lg">Data sources</H3>
						<P className="text-muted-foreground">
							A DataView connects to one or more data sources—databases, APIs,
							or other capabilities. You specify the source and the fields you
							want to expose.
						</P>
					</VStack>
					<VStack>
						<H3 className="font-semibold text-lg">Filtering</H3>
						<P className="text-muted-foreground">
							Define filters that users can apply to narrow down results.
							Filters are typed as search, enum, number, percent, currency,
							date, time, datetime, duration, or boolean so renderers and query
							helpers can validate values before execution.
						</P>
					</VStack>
					<VStack>
						<H3 className="font-semibold text-lg">Sorting</H3>
						<P className="text-muted-foreground">
							Specify which fields can be sorted and the default sort order.
							ContractSpec generates efficient database queries with proper
							indexes.
						</P>
					</VStack>
					<VStack>
						<H3 className="font-semibold text-lg">Pagination</H3>
						<P className="text-muted-foreground">
							DataViews automatically support pagination to handle large
							datasets. You can configure page size limits and cursor-based or
							offset-based pagination.
						</P>
					</VStack>
					<VStack>
						<H3 className="font-semibold text-lg">
							Collection modes and data depth
						</H3>
						<P className="text-muted-foreground">
							List, grid, and table views can share a single{' '}
							<Code>view.collection</Code> contract. It declares allowed view
							modes, toolbar controls, page-size defaults, density, data depth,
							and persistence hints. Fields can use{' '}
							<Code>visibility.minDataDepth</Code> so summary views stay light
							while detailed views expose richer context.
						</P>
					</VStack>
					<VStack>
						<H3 className="font-semibold text-lg">Personalization hints</H3>
						<P className="text-muted-foreground">
							The contract layer stays neutral: it can opt into persistence with{' '}
							<Code>view.collection.personalization</Code>, but it does not
							import the personalization runtime. Host apps resolve preferences
							and behavior insights into renderer props.
						</P>
					</VStack>
				</VStack>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Example DataViewSpec</H2>
				<P className="text-muted-foreground">
					Here is the canonical table contract used by the live{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						<Text>Data Grid Showcase</Text>
					</Link>
					:
				</P>
				<CodeBlock language="typescript" code={SPECS_DATAVIEWS_EXAMPLE} />
				<P className="text-muted-foreground text-sm">
					This one contract drives the DataView lane, while the same rows and
					controller also feed the raw web primitive, native-first primitive,
					and composed design-system demos.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Policy integration</H2>
				<P className="text-muted-foreground">
					DataViews automatically enforce{' '}
					<Link
						href="/docs/specs/policy"
						className="text-violet-400 hover:text-violet-300"
					>
						<Text>PolicySpecs</Text>
					</Link>
					. If a user doesn't have permission to see certain fields, those
					fields are automatically filtered out or redacted. If a user can only
					see their own data, the query is automatically scoped.
				</P>
				<P className="text-muted-foreground">
					This means you define the data view once, and it works correctly for
					all users based on their permissions—no need to write separate queries
					for different roles.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Personalized Rendering Pattern</H2>
				<P className="text-muted-foreground">
					To personalize a DataView, keep the spec declarative and resolve
					user-specific defaults at the app boundary. Use{' '}
					<Code>resolveDataViewPreferences</Code> from{' '}
					<Code>@contractspec/lib.personalization/data-view-preferences</Code>
					to compute <Code>viewMode</Code>, <Code>density</Code>,{' '}
					<Code>dataDepth</Code>, and <Code>pageSize</Code>. Pass those values
					to <Code>DataViewRenderer</Code> as controlled or default props, then
					record UI changes with <Code>trackDataViewInteraction</Code>.
				</P>
				<CodeBlock
					language="tsx"
					code={`const resolved = resolveDataViewPreferences({
  spec: DataGridShowcaseDataView,
  preferences: profile.canonical,
  insights,
  record: savedPreference,
});

<DataViewRenderer
  spec={DataGridShowcaseDataView}
  items={rows}
  defaultViewMode={resolved.viewMode}
  defaultDensity={resolved.density}
  defaultDataDepth={resolved.dataDepth}
/>;`}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Served outputs</H2>
				<P className="text-muted-foreground">
					From a DataViewSpec, ContractSpec serves:
				</P>
				<List className="list-inside list-disc space-y-2 text-muted-foreground">
					<ListItem>
						<Text>
							<Text className="font-semibold">Database queries</Text> –
							Optimized SQL or NoSQL queries executed at runtime
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Text className="font-semibold">API endpoints</Text> – RESTful or
							GraphQL endpoints for fetching data
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Text className="font-semibold">UI components</Text> – List views,
							tables, cards, and detail views
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Text className="font-semibold">Personalized defaults</Text> –
							Plain renderer props for preferred mode, density, data depth, and
							page size
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Text className="font-semibold">Search interfaces</Text> –
							Full-text search with autocomplete
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Text className="font-semibold">Export functions</Text> – CSV,
							JSON, or Excel exports
						</Text>
					</ListItem>
				</List>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Best practices</H2>
				<List className="list-inside list-disc space-y-2 text-muted-foreground">
					<ListItem>
						<Text>
							Only expose fields that users actually need—this improves
							performance and security.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Use appropriate indexes for sortable and filterable fields.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Set reasonable pagination limits to prevent performance issues.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Use <Code>allowedModes</Code> to constrain mode switching to
							layouts that the fields and row actions can support.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Store preferences only for dimensions enabled by{' '}
							<Code>view.collection.personalization.persist</Code>.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Test DataViews with realistic data volumes to ensure they perform
							well.
						</Text>
					</ListItem>
				</List>
			</VStack>

			<HStack className="items-center gap-4 pt-4">
				<Link href="/docs/specs/capabilities" className="btn-ghost">
					<Text>Previous: Capabilities</Text>
				</Link>
				<Link href="/docs/specs/workflows" className="btn-primary">
					<Text>Next: Workflows</Text> <ChevronRight size={16} />
				</Link>
			</HStack>
		</VStack>
	);
}
