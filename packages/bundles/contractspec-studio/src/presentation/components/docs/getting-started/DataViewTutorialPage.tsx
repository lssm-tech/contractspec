import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata: Metadata = {
//   title: 'Getting Started with DataViews | ContractSpec',
//   description: 'Learn how to create and render your first DataView.',
// };

export function DataViewTutorialPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Display Data with DataViews</h1>
        <p className="text-muted-foreground text-lg">
          Define a filterable, sortable transaction history view that works
          across web and mobile without duplicating UI code.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">1. Define the underlying query</h2>
        <p className="text-muted-foreground">
          First, create a query operation to fetch the data:
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`// lib/specs/billing/list-transactions.ts
import { defineQuery } from '@lssm/lib.contracts';

export const ListTransactions = defineQuery({
  meta: {
    name: 'billing.listTransactions',
    version: 1,
    description: 'Fetch customer transaction history',
  },
  io: {
    input: /* pagination + filters */,
    output: /* array of transactions */,
  },
  policy: { auth: 'user' },
});`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">2. Define the DataView spec</h2>
        <p className="text-muted-foreground">
          Wrap your query with presentation metadata:
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`// lib/specs/billing/transaction-history.data-view.ts
import { defineDataView } from '@lssm/lib.contracts';
import { ListTransactions } from './list-transactions';

export const TransactionHistory = defineDataView({
  meta: {
    name: 'billing.transactionHistory',
    version: 1,
    entity: 'transaction',
    description: 'Customer payment history',
    goal: 'Help customers track spending',
    context: 'Account dashboard',
    owners: ['team-billing'],
    stability: 'stable',
    tags: ['payments'],
  },
  source: {
    primary: ListTransactions,
  },
  view: {
    kind: 'list',
    fields: [
      { 
        key: 'date', 
        label: 'Date', 
        dataPath: 'createdAt', 
        format: 'date',
        sortable: true 
      },
      { 
        key: 'description', 
        label: 'Description', 
        dataPath: 'description' 
      },
      { 
        key: 'amount', 
        label: 'Amount', 
        dataPath: 'amount', 
        format: 'currency',
        sortable: true 
      },
      { 
        key: 'status', 
        label: 'Status', 
        dataPath: 'status', 
        format: 'badge' 
      },
    ],
    filters: [
      { 
        key: 'status', 
        label: 'Status', 
        field: 'status', 
        type: 'enum',
        options: [
          { value: 'succeeded', label: 'Paid' },
          { value: 'pending', label: 'Pending' },
          { value: 'failed', label: 'Failed' },
        ],
      },
      {
        key: 'dateRange',
        label: 'Date Range',
        field: 'createdAt',
        type: 'dateRange',
      },
    ],
    defaultSort: { field: 'date', direction: 'desc' },
    pagination: { pageSize: 25 },
  },
});`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">3. Render on the frontend</h2>
        <p className="text-muted-foreground">
          Use the runtime renderer in your React or React Native app:
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`// app/dashboard/transactions/page.tsx
'use client';

import { DataViewRenderer } from '@lssm/lib.design-system';
import { TransactionHistory } from '@/lib/specs/billing/transaction-history.data-view';
import { useQuery } from '@tanstack/react-query';

export function TransactionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetch('/api/ops/billing.listTransactions').then(r => r.json()),
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>
      <DataViewRenderer 
        spec={TransactionHistory}
        data={data?.items ?? []}
        loading={isLoading}
        onFilterChange={(filters) => {
          // refetch with new filters
        }}
      />
    </div>
  );
}`}
        </pre>
      </div>

      <div className="card-subtle space-y-4 p-6">
        <h3 className="font-bold">Why DataViews?</h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>✓ Same spec renders on web (React) and mobile (React Native)</li>
          <li>✓ Filters, sorting, and pagination handled automatically</li>
          <li>✓ Format rules (currency, dates, badges) applied consistently</li>
          <li>✓ Export to CSV/PDF using the same spec</li>
          <li>✓ A/B test different layouts without touching the backend</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/data-views" className="btn-primary">
          DataView API Reference <ChevronRight size={16} />
        </Link>
        <Link href="/docs/specs/workflows" className="btn-ghost">
          Next: Workflows
        </Link>
      </div>
    </div>
  );
}
