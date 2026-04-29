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
