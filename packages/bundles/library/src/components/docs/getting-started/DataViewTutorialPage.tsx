import { CodeBlock } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { List, ListItem } from '@contractspec/lib.design-system/list';
import {
	H1,
	H2,
	H3,
	P,
	Text,
} from '@contractspec/lib.design-system/typography';
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
      {
        key: 'amount',
        label: 'Amount',
        dataPath: 'amount',
        sortable: true,
        format: { type: 'currency', currency: 'EUR', rounded: true },
      },
      {
        key: 'renewalDate',
        label: 'Renewal',
        dataPath: 'renewalDate',
        format: { type: 'date', dateStyle: 'medium' },
      },
      {
        key: 'processingTime',
        label: 'Processing time',
        dataPath: 'processingMinutes',
        format: { type: 'duration', unit: 'minute', display: 'digital' },
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
      toolbar: {
        search: true,
        viewMode: true,
        filters: true,
        density: true,
        dataDepth: true,
      },
      pagination: {
        pageSize: 25,
        pageSizeOptions: [10, 25, 50],
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
        key: 'amount',
        label: 'Amount',
        field: 'amount',
        type: 'currency',
        valueMode: 'range',
      },
      {
        key: 'renewalDate',
        label: 'Renewal',
        field: 'renewalDate',
        type: 'date',
        valueMode: 'range',
      },
    ],
  },
});`;

export function DataViewTutorialPage() {
	return (
		<VStack className="space-y-8">
			<VStack className="space-y-4">
				<H1 className="font-bold text-4xl">Display Data with DataViews</H1>
				<P className="text-lg text-muted-foreground">
					Define a filterable, sortable transaction history view that works
					across web and mobile without duplicating UI code.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">1. Define the underlying query</H2>
				<P className="text-muted-foreground">
					First, create a query operation to fetch the data:
				</P>
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
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">2. Define the DataView spec</H2>
				<P className="text-muted-foreground">
					Wrap your query with presentation metadata:
				</P>
				<CodeBlock
					language="typescript"
					filename="lib/specs/billing/transaction-history.data-view.ts"
					code={DATAVIEW_TUTORIAL_EXAMPLE}
				/>
				<P className="text-muted-foreground text-sm">
					The live version of this pattern is available in the canonical{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						<Text>Data Grid Showcase</Text>
					</Link>
					.
				</P>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">3. Render on the frontend</H2>
				<P className="text-muted-foreground">
					Use the runtime renderer in your React or React Native app:
				</P>
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
        items={data?.items ?? []}
        loading={isLoading}
        defaultViewMode="table"
        defaultDensity="comfortable"
        defaultDataDepth="standard"
        onFilterChange={(filters) => {
          // refetch with new filters
        }}
      />
    </div>
  );
}`}
				/>
			</VStack>

			<VStack className="space-y-4">
				<H2 className="font-bold text-2xl">4. Add personalization</H2>
				<P className="text-muted-foreground">
					When the app has a user profile or behavior insights, resolve DataView
					preferences before rendering. The renderer receives plain props;
					personalization stays in the app/runtime boundary.
				</P>
				<CodeBlock
					language="tsx"
					filename="app/dashboard/transactions/PersonalizedTransactions.tsx"
					code={`'use client';

import { DataViewRenderer } from '@contractspec/lib.design-system';
import { resolveDataViewPreferences } from '@contractspec/lib.personalization/data-view-preferences';
import { createBehaviorTracker } from '@contractspec/lib.personalization';

const tracker = createBehaviorTracker({
  store,
  context: { tenantId: tenant.id, userId: user.id },
});

const resolved = resolveDataViewPreferences({
  spec: TransactionHistory,
  preferences: profile.canonical,
  insights,
  record: savedTransactionViewPreference,
});

<DataViewRenderer
  spec={TransactionHistory}
  items={transactions}
  defaultViewMode={resolved.viewMode}
  defaultDensity={resolved.density}
  defaultDataDepth={resolved.dataDepth}
  pagination={{ page, pageSize: resolved.pageSize ?? 25, total }}
  onViewModeChange={(viewMode) =>
    tracker.trackDataViewInteraction({
      dataViewKey: TransactionHistory.meta.key,
      action: 'view_mode_changed',
      viewMode,
    })
  }
  onDataDepthChange={(dataDepth) =>
    tracker.trackDataViewInteraction({
      dataViewKey: TransactionHistory.meta.key,
      action: 'data_depth_changed',
      dataDepth,
    })
  }
/>;`}
				/>
			</VStack>

			<VStack className="card-subtle space-y-4 p-6">
				<H3 className="font-bold">Why DataViews?</H3>
				<List className="space-y-2 text-muted-foreground text-sm">
					<ListItem>
						<Text>
							Same spec renders on web (React) and mobile (React Native)
						</Text>
					</ListItem>
					<ListItem>
						<Text>Filters, sorting, and pagination handled automatically</Text>
					</ListItem>
					<ListItem>
						<Text>
							Column visibility, pinning, resizing, and row expansion stay
							contract-driven
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							List, grid, and table modes can share one collection config with
							toolbar and pagination defaults
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Data depth lets summary screens hide detailed fields without
							forking the spec
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Typed format rules for numbers, percent values, currency, dates,
							times, datetimes, and durations applied consistently
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Personalization helpers can seed preferred view mode, density,
							data depth, and page size from user preferences or behavior
							insights
						</Text>
					</ListItem>
					<ListItem>
						<Text>Export to CSV/PDF using the same spec</Text>
					</ListItem>
					<ListItem>
						<Text>A/B test different layouts without touching the backend</Text>
					</ListItem>
				</List>
			</VStack>

			<HStack className="items-center gap-4 pt-4">
				<Link href="/docs/libraries/data-views" className="btn-primary">
					<Text>DataView API Reference</Text> <ChevronRight size={16} />
				</Link>
				<Link href="/docs/specs/workflows" className="btn-ghost">
					<Text>Next: Workflows</Text>
				</Link>
			</HStack>
		</VStack>
	);
}
