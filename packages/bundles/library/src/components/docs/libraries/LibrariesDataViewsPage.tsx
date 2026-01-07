import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesDataViewsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">DataViews Runtime Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@contractspec/lib.contracts/data-views</code> and{' '}
          <code>@contractspec/lib.design-system</code> libraries provide the
          runtime logic and UI components to render DataViews in your
          application.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package={['@contractspec/lib.contracts', '@contractspec/lib.design-system']} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">DataViewRenderer</h2>
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

        <h3 className="text-xl font-semibold">Props</h3>
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
            <code>onFilterChange</code>: Callback when filters change.
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
        <h2 className="text-2xl font-bold">Query Generation</h2>
        <p className="text-muted-foreground">
          The <code>DataViewQueryGenerator</code> utility helps translate
          DataView parameters (filters, sorting, pagination) into query
          arguments for your backend.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { DataViewQueryGenerator } from '@contractspec/lib.contracts/data-views/query-generator';

const generator = new DataViewQueryGenerator(MyUserList);
const query = generator.generate({
  pagination: { page: 1, pageSize: 20 },
  filters: { role: 'admin' }
});

// query.input contains { skip: 0, take: 20, role: 'admin' }`}
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
