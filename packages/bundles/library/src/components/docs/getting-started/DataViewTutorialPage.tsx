import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const DATAVIEW_TUTORIAL_EXAMPLE = `import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import { ListTransactions } from './list-transactions';

export const TransactionHistory = defineDataView({
  meta: {
    key: 'billing.transactionHistory',
    version: '1.0.0',
    entity: 'transaction',
    title: 'Transaction History',
    description: 'Customer payment history',
    domain: 'billing',
    owners: ['team-billing'],
    tags: ['payments'],
    stability: 'stable',
  },
  source: {
    primary: {
      key: ListTransactions.meta.key,
      version: ListTransactions.meta.version,
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

export function DataViewTutorialPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Display Data with DataViews</h1>
				<p className="text-lg text-muted-foreground">
					Define a filterable, sortable transaction history view that works
					across web and mobile without duplicating UI code.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">1. Define the underlying query</h2>
				<p className="text-muted-foreground">
					First, create a query operation to fetch the data:
				</p>
				<CodeBlock
					language="typescript"
					filename="lib/specs/billing/list-transactions.ts"
					code={`import { defineQuery } from '@contractspec/lib.contracts-spec';

export const ListTransactions = defineQuery({
  meta: {
    key: 'billing.listTransactions',
    version: '1.0.0',
    description: 'Fetch customer transaction history',
  },
  io: {
    input: /* pagination + filters */,
    output: /* array of transactions */,
  },
  policy: { auth: 'user' },
});`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">2. Define the DataView spec</h2>
				<p className="text-muted-foreground">
					Wrap your query with presentation metadata:
				</p>
				<CodeBlock
					language="typescript"
					filename="lib/specs/billing/transaction-history.data-view.ts"
					code={DATAVIEW_TUTORIAL_EXAMPLE}
				/>
				<p className="text-muted-foreground text-sm">
					The live version of this pattern is available in the canonical{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Data Grid Showcase
					</Link>
					.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">3. Render on the frontend</h2>
				<p className="text-muted-foreground">
					Use the runtime renderer in your React or React Native app:
				</p>
				<CodeBlock
					language="tsx"
					filename="app/dashboard/transactions/page.tsx"
					code={`'use client';

import { DataViewRenderer } from '@contractspec/lib.design-system';
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
				/>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h3 className="font-bold">Why DataViews?</h3>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>Same spec renders on web (React) and mobile (React Native)</li>
					<li>Filters, sorting, and pagination handled automatically</li>
					<li>
						Column visibility, pinning, resizing, and row expansion stay
						contract-driven
					</li>
					<li>Format rules (currency, dates, badges) applied consistently</li>
					<li>Export to CSV/PDF using the same spec</li>
					<li>A/B test different layouts without touching the backend</li>
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
