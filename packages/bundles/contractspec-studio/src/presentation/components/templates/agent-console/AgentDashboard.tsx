'use client';

/**
 * Agent Console Dashboard
 *
 * Properly integrated with ContractSpec example handlers,
 * design-system components, and presentation-runtime patterns.
 */
import { useState, useMemo } from 'react';
import { StatCard, StatCardGroup, Button } from '@lssm/lib.design-system';
import { AgentListView } from './views/AgentListView';
import { RunListView } from './views/RunListView';
import { ToolRegistryView } from './views/ToolRegistryView';
import { useRunList } from './hooks/useRunList';

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
        { label: 'Total Runs', value: '-', change: 'Loading...' },
        { label: 'Success Rate', value: '-', change: '' },
        { label: 'Total Tokens', value: '-', change: '' },
        { label: 'Total Cost', value: '-', change: '' },
      ];
    }
    return [
      {
        label: 'Total Runs',
        value: metrics.totalRuns.toLocaleString(),
        change: `${metrics.completedRuns} completed`,
      },
      {
        label: 'Success Rate',
        value: `${(metrics.successRate * 100).toFixed(0)}%`,
        change: `${metrics.failedRuns} failed`,
      },
      {
        label: 'Total Tokens',
        value:
          metrics.totalTokens >= 1000000
            ? `${(metrics.totalTokens / 1000000).toFixed(1)}M`
            : `${(metrics.totalTokens / 1000).toFixed(0)}K`,
        change: 'This period',
      },
      {
        label: 'Total Cost',
        value: `$${metrics.totalCostUsd.toFixed(2)}`,
        change: 'This period',
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
            description={stat.change}
            loading={metricsLoading && stat.value === '-'}
          />
        ))}
      </StatCardGroup>

      {/* Navigation Tabs */}
      <nav className="flex gap-1 rounded-lg bg-muted p-1" role="tablist">
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
function MetricsView({ metrics }: { metrics: ReturnType<typeof useRunList>['metrics'] }) {
  if (!metrics) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Usage Analytics</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Success/Failure breakdown */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="font-medium">Run Outcomes</h4>
          <div className="mt-4 space-y-3">
            <ProgressBar
              label="Completed"
              value={metrics.completedRuns}
              total={metrics.totalRuns}
              color="bg-green-500"
            />
            <ProgressBar
              label="Failed"
              value={metrics.failedRuns}
              total={metrics.totalRuns}
              color="bg-red-500"
            />
            <ProgressBar
              label="Other"
              value={metrics.totalRuns - metrics.completedRuns - metrics.failedRuns}
              total={metrics.totalRuns}
              color="bg-yellow-500"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="font-medium">Recent Activity</h4>
          <div className="mt-4 space-y-2">
            {metrics.timeline.map((point) => (
              <div
                key={point.period}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{point.period}</span>
                <div className="flex gap-4">
                  <span>{point.runs} runs</span>
                  <span className="text-muted-foreground">${point.costUsd.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="font-medium">Key Metrics</h4>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">Avg Duration</dt>
            <dd className="text-2xl font-semibold">
              {(metrics.averageDurationMs / 1000).toFixed(1)}s
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Total Tokens</dt>
            <dd className="text-2xl font-semibold">
              {(metrics.totalTokens / 1000).toFixed(0)}K
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Cost per Run</dt>
            <dd className="text-2xl font-semibold">
              ${metrics.totalRuns > 0 ? (metrics.totalCostUsd / metrics.totalRuns).toFixed(4) : '0'}
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
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
