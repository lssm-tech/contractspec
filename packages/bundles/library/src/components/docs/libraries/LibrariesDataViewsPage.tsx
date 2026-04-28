import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesDataViewsPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">DataViews Runtime Library</h1>
				<p className="text-lg text-muted-foreground">
					The <code>@contractspec/lib.contracts-spec/data-views</code> and{' '}
					<code>@contractspec/lib.design-system</code> libraries provide the
					runtime logic and UI components to render DataViews in your
					application.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand
					package={[
						'@contractspec/lib.contracts-spec',
						'@contractspec/lib.design-system',
					]}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">DataViewRenderer</h2>
				<p className="text-muted-foreground">
					The primary component for rendering any DataView. It automatically
					selects the correct layout (List, Table, Grid, Detail) based on the
					spec.
				</p>

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

				<h3 className="font-semibold text-xl">Props</h3>
				<ul className="list-disc space-y-2 pl-6 text-muted-foreground">
					<li>
						<code>spec</code>: The DataViewSpec definition.
					</li>
					<li>
						<code>items</code>: Array of data items to render.
					</li>
					<li>
						<code>filters</code>: Current filter state object.
					</li>
					<li>
						<code>onFilterChange</code>: Callback when typed filters change.
						Renderers emit <code>DataViewFilterValue</code> objects for numeric,
						percent, currency, temporal, duration, and boolean filters.
					</li>
					<li>
						<code>pagination</code>: Object with <code>page</code>,{' '}
						<code>pageSize</code>, <code>total</code>.
					</li>
					<li>
						<code>onPageChange</code>: Callback when page changes.
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Query Generation</h2>
				<p className="text-muted-foreground">
					The <code>DataViewQueryGenerator</code> utility helps translate
					DataView parameters (filters, sorting, pagination) into query
					arguments for your backend.
				</p>
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
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries" className="btn-ghost">
					Back to Libraries
				</Link>
				<Link href="/docs/libraries/data-backend" className="btn-primary">
					Next: Data & Backend <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
