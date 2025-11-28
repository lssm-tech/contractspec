'use client';

/**
 * CRM Dashboard
 *
 * Properly integrated with ContractSpec example handlers
 * and design-system components.
 */
import { useState } from 'react';
import {
  StatCard,
  StatCardGroup,
  LoaderBlock,
  ErrorState,
} from '@lssm/lib.design-system';
import { useDealList, type Deal } from './hooks/useDealList';
import { CrmPipelineBoard } from './CrmPipelineBoard';

type Tab = 'pipeline' | 'list' | 'metrics';

function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CrmDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const { data, dealsByStage, stages, loading, error, stats, refetch } =
    useDealList();

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: 'pipeline', label: 'Pipeline', icon: '📊' },
    { id: 'list', label: 'All Deals', icon: '📋' },
    { id: 'metrics', label: 'Metrics', icon: '📈' },
  ];

  if (loading && !data) {
    return <LoaderBlock label="Loading CRM..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load CRM"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      {stats && (
        <StatCardGroup>
          <StatCard
            label="Total Pipeline"
            value={formatCurrency(stats.totalValue)}
            hint={`${stats.total} deals`}
          />
          <StatCard
            label="Open Deals"
            value={formatCurrency(stats.openValue)}
            hint={`${stats.openCount} active`}
          />
          <StatCard
            label="Won"
            value={formatCurrency(stats.wonValue)}
            hint={`${stats.wonCount} closed`}
          />
          <StatCard label="Lost" value={stats.lostCount} hint="deals lost" />
        </StatCardGroup>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-muted flex gap-1 rounded-lg p-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[400px]" role="tabpanel">
        {activeTab === 'pipeline' && (
          <CrmPipelineBoard dealsByStage={dealsByStage} stages={stages} />
        )}
        {activeTab === 'list' && <DealListTab data={data} />}
        {activeTab === 'metrics' && <MetricsTab stats={stats} />}
      </div>
    </div>
  );
}

function DealListTab({
  data,
}: {
  data: ReturnType<typeof useDealList>['data'];
}) {
  if (!data?.deals.length) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        No deals found
      </div>
    );
  }

  return (
    <div className="border-border rounded-lg border">
      <table className="w-full">
        <thead className="border-border bg-muted/30 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Deal</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Expected Close
            </th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {data.deals.map((deal: Deal) => (
            <tr key={deal.id} className="hover:bg-muted/50">
              <td className="px-4 py-3">
                <div className="font-medium">{deal.name}</div>
              </td>
              <td className="px-4 py-3 font-mono">
                {formatCurrency(deal.value, deal.currency)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    deal.status === 'WON'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : deal.status === 'LOST'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  {deal.status}
                </span>
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {deal.expectedCloseDate?.toLocaleDateString() ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricsTab({
  stats,
}: {
  stats: ReturnType<typeof useDealList>['stats'];
}) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="border-border bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Pipeline Overview</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-sm">Win Rate</dt>
            <dd className="text-2xl font-semibold">
              {stats.total > 0
                ? ((stats.wonCount / stats.total) * 100).toFixed(0)
                : 0}
              %
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Avg Deal Size</dt>
            <dd className="text-2xl font-semibold">
              {formatCurrency(
                stats.total > 0 ? stats.totalValue / stats.total : 0
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Conversion</dt>
            <dd className="text-2xl font-semibold">
              {stats.wonCount} / {stats.total}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
