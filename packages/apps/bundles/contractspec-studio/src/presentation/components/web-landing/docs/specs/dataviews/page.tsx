import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'DataViews: ContractSpec Docs',
//   description:
//     'Learn how to define data views for querying, filtering, and presenting data in ContractSpec.',
// };

export default function DataViewsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">DataViews</h1>
        <p className="text-muted-foreground">
          A <strong>DataViewSpec</strong> describes how data should be queried,
          filtered, sorted, and presented to users. Runtime adapters execute
          optimized database queries and serve list views, detail views, and
          search interfaces while respecting policy constraints.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core concepts</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Data sources</h3>
            <p className="text-muted-foreground">
              A DataView connects to one or more data sources—databases, APIs,
              or other capabilities. You specify the source and the fields you
              want to expose.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Filtering</h3>
            <p className="text-muted-foreground">
              Define filters that users can apply to narrow down results.
              Filters can be simple (e.g., "status equals 'active'") or complex
              (e.g., "created within the last 30 days AND assigned to current
              user").
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Sorting</h3>
            <p className="text-muted-foreground">
              Specify which fields can be sorted and the default sort order.
              ContractSpec generates efficient database queries with proper
              indexes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Pagination</h3>
            <p className="text-muted-foreground">
              DataViews automatically support pagination to handle large
              datasets. You can configure page size limits and cursor-based or
              offset-based pagination.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Aggregations</h3>
            <p className="text-muted-foreground">
              Compute aggregates like counts, sums, averages, and group-by
              operations. These are useful for dashboards and summary views.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example DataViewSpec</h2>
        <p className="text-muted-foreground">
          Here's a DataView for listing orders in TypeScript:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { defineDataView } from '@lssm/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

export const OrderList = defineDataView({
  meta: {
    name: 'order.list',
    version: 1,
    description: 'List of recent orders',
  },
  source: {
    type: 'database',
    table: 'orders',
  },
  fields: [
    { name: 'orderId', type: 'uuid', sortable: true },
    { name: 'customerName', type: 'string', searchable: true },
    { name: 'total', type: 'number', sortable: true },
    { 
      name: 'status', 
      type: 'enum', 
      values: ['pending', 'processing', 'shipped'],
      filterable: true 
    },
    { 
      name: 'createdAt', 
      type: 'timestamp', 
      sortable: true, 
      defaultSort: 'desc' 
    },
  ],
  filters: [
    { name: 'status', field: 'status', operator: 'in' },
    { name: 'dateRange', field: 'createdAt', operator: 'between' },
    { name: 'minTotal', field: 'total', operator: 'gte' },
  ],
  pagination: {
    type: 'cursor',
    defaultPageSize: 50,
    maxPageSize: 200,
  },
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Policy integration</h2>
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
        <h2 className="text-2xl font-bold">Served outputs</h2>
        <p className="text-muted-foreground">
          From a DataViewSpec, ContractSpec serves:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
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
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
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
