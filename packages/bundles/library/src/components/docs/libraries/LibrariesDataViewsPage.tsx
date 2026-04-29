import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
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

const COLLECTION_DATAVIEW_EXAMPLE = `import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';

export const AccountsDataView = defineDataView({
  meta: {
    key: 'crm.accounts',
    version: '1.0.0',
    title: 'Accounts',
    description: 'Customer account workspace',
    domain: 'crm',
    entity: 'account',
    owners: ['@crm'],
    tags: ['crm', 'accounts'],
    stability: 'stable',
  },
  source: {
    primary: { key: 'crm.accounts.list', version: '1.0.0' },
  },
  view: {
    kind: 'table',
    fields: [
      { key: 'name', label: 'Name', dataPath: 'name', sortable: true },
      { key: 'owner', label: 'Owner', dataPath: 'owner' },
      { key: 'arr', label: 'ARR', dataPath: 'arr', format: { type: 'currency', currency: 'EUR' } },
      {
        key: 'internalNotes',
        label: 'Internal notes',
        dataPath: 'internalNotes',
        visibility: { minDataDepth: 'detailed' },
      },
    ],
    columns: [
      { field: 'name' },
      { field: 'owner' },
      { field: 'arr' },
      { field: 'internalNotes' },
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
  },
});`;

const PERSONALIZED_RENDERER_EXAMPLE = `import { DataViewRenderer } from '@contractspec/lib.design-system';
import { resolveDataViewPreferences } from '@contractspec/lib.personalization/data-view-preferences';

const resolved = resolveDataViewPreferences({
  spec: AccountsDataView,
  preferences: profile.canonical,
  insights,
  record: savedDataViewPreference,
});

<DataViewRenderer
  spec={AccountsDataView}
  items={accounts}
  defaultViewMode={resolved.viewMode}
  defaultDensity={resolved.density}
  defaultDataDepth={resolved.dataDepth}
  pagination={{
    page,
    pageSize: resolved.pageSize ?? 25,
    total,
  }}
  onViewModeChange={(viewMode) => {
    tracker.trackDataViewInteraction({
      dataViewKey: AccountsDataView.meta.key,
      dataViewVersion: AccountsDataView.meta.version,
      action: 'view_mode_changed',
      viewMode,
    });
  }}
  onDensityChange={(density) => {
    tracker.trackDataViewInteraction({
      dataViewKey: AccountsDataView.meta.key,
      action: 'density_changed',
      density,
    });
  }}
  onDataDepthChange={(dataDepth) => {
    tracker.trackDataViewInteraction({
      dataViewKey: AccountsDataView.meta.key,
      action: 'data_depth_changed',
      dataDepth,
    });
  }}
/>;
`;

const DATAVIEW_AGENT_PROMPT = `Implement a production DataView for <entity>.

Requirements:
- Define one canonical DataViewSpec with kind 'table', collection viewModes for list/grid/table, pagination defaults, toolbar search/filter/view mode/density/dataDepth controls, and personalization persist hints.
- Mark fields that should only appear in richer experiences with visibility.minDataDepth.
- Render it with DataViewRenderer using plain props from resolveDataViewPreferences.
- Track user interactions with trackDataViewInteraction for view mode, density, data depth, search, filters, sorting, and pagination.
- Keep @contractspec/lib.design-system independent from @contractspec/lib.personalization.
- Add focused tests for default resolution, invalid-mode fallback, data-depth projection, and behavior-derived preferred view mode.`;

export function LibrariesDataViewsPage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-4">
				<H1 className="font-bold text-4xl">DataViews Runtime Library</H1>
				<P className="text-lg text-muted-foreground">
					The <Code>@contractspec/lib.contracts-spec/data-views</Code> and{' '}
					<Code>@contractspec/lib.design-system</Code> libraries provide the
					runtime logic and UI components to render DataViews in your
					application.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Installation</H2>
				<InstallCommand
					package={[
						'@contractspec/lib.contracts-spec',
						'@contractspec/lib.design-system',
					]}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">DataViewRenderer</H2>
				<P className="text-muted-foreground">
					The primary component for rendering any DataView. It automatically
					selects the correct layout (List, Table, Grid, Detail) based on the
					spec.
				</P>

				<CodeBlock
					language="tsx"
					code={`import { DataViewRenderer } from '@contractspec/lib.design-system';
import { MyUserList } from './specs/users.data-view';

export function UserPage() {
  return (
    <DataViewRenderer
      spec={MyUserList}
      items={users}
      pagination={{ page: 1, pageSize: 20, total: 100 }}
      onPageChange={(page) => fetchPage(page)}
    />
  );
}`}
				/>

				<H3 className="font-semibold text-xl">Props</H3>
				<List className="list-disc space-y-2 pl-6 text-muted-foreground">
					<ListItem>
						<Text>
							<Code>spec</Code>: The DataViewSpec definition.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>items</Code>: Array of data items to render.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>filters</Code>: Current filter state object.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>onFilterChange</Code>: Callback when typed filters change.
							Renderers emit <Code>DataViewFilterValue</Code> objects for
							numeric, percent, currency, temporal, duration, and boolean
							filters.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>pagination</Code>: Object with <Code>page</Code>,{' '}
							<Code>pageSize</Code>, <Code>total</Code>.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>onPageChange</Code>: Callback when page changes.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>viewMode</Code> / <Code>defaultViewMode</Code>: Controlled
							or initial collection mode for specs that allow <Code>list</Code>,{' '}
							<Code>grid</Code>, or <Code>table</Code> projections through{' '}
							<Code>view.collection.viewModes</Code>.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>density</Code> / <Code>defaultDensity</Code>: Controlled or
							initial density for collection renderers. Host apps can seed this
							from <Code>@contractspec/lib.personalization</Code> while specs
							can declare <Code>view.collection.density</Code> and table{' '}
							<Code>view.density</Code> defaults.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							<Code>dataDepth</Code> / <Code>defaultDataDepth</Code>: Controlled
							or initial summary/standard/detailed/exhaustive projection. Fields
							can declare <Code>visibility.minDataDepth</Code>, and collection
							specs can opt into <Code>view.collection.personalization</Code>{' '}
							persistence hints.
						</Text>
					</ListItem>
				</List>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">
					Collection Defaults And Data Depth
				</H2>
				<P className="text-muted-foreground">
					Use one authored <Code>DataViewSpec</Code> for list, grid, and table
					experiences. <Code>view.collection</Code> declares allowed modes,
					toolbar controls, pagination defaults, density, data depth, and
					persistence hints. <Code>visibility.minDataDepth</Code> lets a field
					appear only when the renderer is in a detailed or exhaustive mode.
				</P>
				<CodeBlock language="typescript" code={COLLECTION_DATAVIEW_EXAMPLE} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Personalization Bridge</H2>
				<P className="text-muted-foreground">
					Resolve user preferences in the host app, then pass ordinary renderer
					props into <Code>DataViewRenderer</Code>. The bridge helper lives in{' '}
					<Code>@contractspec/lib.personalization</Code>, so the design-system
					renderer stays portable for apps that do not use personalization. See
					the{' '}
					<Link
						href="/docs/libraries/personalization"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						<Text>personalization library guide</Text>
					</Link>{' '}
					for the behavior tracker, analyzer, and DataView preference resolver.
				</P>
				<CodeBlock language="tsx" code={PERSONALIZED_RENDERER_EXAMPLE} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Agent Prompt</H2>
				<P className="text-muted-foreground">
					Use this prompt when asking an implementation agent to add a
					preference-aware collection DataView without breaking package
					boundaries.
				</P>
				<CodeBlock language="markdown" code={DATAVIEW_AGENT_PROMPT} />
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">Query Generation</H2>
				<P className="text-muted-foreground">
					The <Code>DataViewQueryGenerator</Code> utility helps translate
					DataView parameters (filters, sorting, pagination) into query
					arguments for your backend.
				</P>
				<CodeBlock
					language="typescript"
					code={`import { DataViewQueryGenerator } from '@contractspec/lib.contracts-spec/data-views/query-generator';

const generator = new DataViewQueryGenerator(MyUserList);
const params = {
  pagination: { page: 1, pageSize: 20 },
  filters: {
    role: { kind: 'single', value: 'admin' },
    revenue: { kind: 'range', from: 1000, to: 5000 },
    lastSeenAt: { kind: 'single', value: '2026-04-28T08:30:00Z' }
  }
};

const errors = generator.validateParams(params);
const query = generator.generate(params);

// query.input contains skip/take plus the typed filter payloads.`}
				/>
			</VStack>

			<HStack className="items-center gap-4 pt-4">
				<Link href="/docs/libraries" className="btn-ghost">
					<Text>Back to Libraries</Text>
				</Link>
				<Link href="/docs/libraries/data-backend" className="btn-primary">
					<Text>Next: Data & Backend</Text> <ChevronRight size={16} />
				</Link>
			</HStack>
		</VStack>
	);
}
