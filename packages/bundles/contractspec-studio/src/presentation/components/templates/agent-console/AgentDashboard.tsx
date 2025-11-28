'use client';

/**
 * Agent Console Dashboard
 *
 * Properly integrated with ContractSpec example handlers,
 * design-system components, and presentation-runtime patterns.
 */
import { useState, useMemo } from 'react';
import { StatCard, StatCardGroup } from '@lssm/lib.design-system';
import { AgentListView } from './views/AgentListView';
import { RunListView } from './views/RunListView';
import { ToolRegistryView } from './views/ToolRegistryView';
import { useRunList, type RunMetrics } from './hooks/useRunList';

type Tab = 'runs' | 'agents' | 'tools' | 'metrics';

export function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('runs');
  const { metrics, loading: metricsLoading } = useRunList();

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: 'runs', label: 'Runs', icon: '▶' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'tools', label: 'Tools', icon: '🔧' },
    { id: 'metrics', label: 'Metrics', icon: '📊' },
  ];

  // Compute summary stats from metrics
  const summaryStats = useMemo(() => {
    if (!metrics) {
      return [
        { label: 'Total Runs', value: '-', hint: 'Loading...' },
        { label: 'Success Rate', value: '-', hint: '' },
        { label: 'Total Tokens', value: '-', hint: '' },
        { label: 'Total Cost', value: '-', hint: '' },
      ];
    }
    return [
      {
        label: 'Total Runs',
        value: metrics.totalRuns.toLocaleString(),
        hint: `${(metrics.successRate * 100).toFixed(0)}% success`,
      },
      {
        label: 'Success Rate',
        value: `${(metrics.successRate * 100).toFixed(0)}%`,
        hint: 'of all runs',
      },
      {
        label: 'Total Tokens',
        value:
          metrics.totalTokens >= 1000000
            ? `${(metrics.totalTokens / 1000000).toFixed(1)}M`
            : `${(metrics.totalTokens / 1000).toFixed(0)}K`,
        hint: 'This period',
      },
      {
        label: 'Total Cost',
        value: `$${metrics.totalCostUsd.toFixed(2)}`,
        hint: 'This period',
      },
    ];
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Summary Stats Row */}
      <StatCardGroup>
        {summaryStats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
          />
        ))}
      </StatCardGroup>

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
        {activeTab === 'runs' && <RunListView />}
        {activeTab === 'agents' && <AgentListView />}
        {activeTab === 'tools' && <ToolRegistryView />}
        {activeTab === 'metrics' && <MetricsView metrics={metrics} />}
      </div>
    </div>
  );
}

/**
 * Metrics View - Shows usage analytics
 */
function MetricsView({ metrics }: { metrics: RunMetrics | null }) {
  if (!metrics) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        Loading metrics...
      </div>
    );
  }

  // Calculate derived metrics
  const completedRuns = Math.round(metrics.totalRuns * metrics.successRate);
  const failedRuns = metrics.totalRuns - completedRuns;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Usage Analytics</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Success/Failure breakdown */}
        <div className="border-border bg-card rounded-xl border p-4">
          <h4 className="font-medium">Run Outcomes</h4>
          <div className="mt-4 space-y-3">
            <ProgressBar
              label="Completed"
              value={completedRuns}
              total={metrics.totalRuns}
              color="bg-green-500"
            />
            <ProgressBar
              label="Failed"
              value={failedRuns}
              total={metrics.totalRuns}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Key Stats */}
        <div className="border-border bg-card rounded-xl border p-4">
          <h4 className="font-medium">Performance</h4>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-muted-foreground text-sm">Avg Duration</dt>
              <dd className="text-xl font-semibold">
                {(metrics.avgDurationMs / 1000).toFixed(1)}s
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Success Rate</dt>
              <dd className="text-xl font-semibold">
                {(metrics.successRate * 100).toFixed(0)}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-border bg-card rounded-xl border p-4">
        <h4 className="font-medium">Key Metrics</h4>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-sm">Total Runs</dt>
            <dd className="text-2xl font-semibold">
              {metrics.totalRuns.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Total Tokens</dt>
            <dd className="text-2xl font-semibold">
              {(metrics.totalTokens / 1000).toFixed(0)}K
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Cost per Run</dt>
            <dd className="text-2xl font-semibold">
              $
              {metrics.totalRuns > 0
                ? (metrics.totalCostUsd / metrics.totalRuns).toFixed(4)
                : '0'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
