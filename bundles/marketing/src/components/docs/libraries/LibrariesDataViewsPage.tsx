// export const metadata: Metadata = {
//   title: 'DataView Library | ContractSpec',
//   description: 'Runtime and components for rendering DataViews.',
// };

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
        <pre className="bg-muted rounded-lg border p-4">
          <code>
            npm install @contractspec/lib.contracts
            @contractspec/lib.design-system
          </code>
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">DataViewRenderer</h2>
        <p>
          The primary component for rendering any DataView. It automatically
          selects the correct layout (List, Table, Grid, Detail) based on the
          spec.
        </p>

        <div className="bg-muted rounded-lg border p-4">
          <pre className="text-sm">
            {`import { DataViewRenderer } from '@contractspec/lib.design-system';
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
          </pre>
        </div>

        <h3 className="text-xl font-semibold">Props</h3>
        <ul className="list-disc space-y-2 pl-6">
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
        <p>
          The <code>DataViewQueryGenerator</code> utility helps translate
          DataView parameters (filters, sorting, pagination) into query
          arguments for your backend.
        </p>
        <div className="bg-muted rounded-lg border p-4">
          <pre className="text-sm">
            {`import { DataViewQueryGenerator } from '@contractspec/lib.contracts/data-views/query-generator';

const generator = new DataViewQueryGenerator(MyUserList);
const query = generator.generate({
  pagination: { page: 1, pageSize: 20 },
  filters: { role: 'admin' }
});

// query.input contains { skip: 0, take: 20, role: 'admin' }`}
          </pre>
        </div>
      </div>
    </div>
  );
}
