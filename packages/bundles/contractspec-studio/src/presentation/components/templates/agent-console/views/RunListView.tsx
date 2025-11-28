'use client';

/**
 * Run List View - Shows agent execution runs with stats
 */
import { StatCard, StatCardGroup, StatusChip, EmptyState, LoaderBlock, ErrorState } from '@lssm/lib.design-system';
import { useRunList } from '../hooks/useRunList';

interface RunListViewProps {
  agentId?: string;
  onRunClick?: (runId: string) => void;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'warning',
  QUEUED: 'neutral',
  FAILED: 'danger',
  CANCELLED: 'danger',
  EXPIRED: 'danger',
};

function formatDuration(ms?: number): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function formatTokens(tokens: number): string {
  if (tokens < 1000) return tokens.toString();
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(2)}M`;
}

function formatCost(cost?: number): string {
  if (!cost) return '-';
  return `$${cost.toFixed(4)}`;
}

export function RunListView({ agentId, onRunClick }: RunListViewProps) {
  const { data, metrics, loading, error, refetch } = useRunList({ agentId });

  if (loading && !data) {
    return <LoaderBlock label="Loading runs..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load runs"
        description={error.message}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        title="No runs yet"
        description="Execute an agent to see run history here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Stats */}
      {metrics && (
        <StatCardGroup>
          <StatCard label="Total Runs" value={metrics.totalRuns} />
          <StatCard
            label="Success Rate"
            value={`${(metrics.successRate * 100).toFixed(1)}%`}
            variant={metrics.successRate >= 0.9 ? 'success' : metrics.successRate >= 0.7 ? 'warning' : 'danger'}
          />
          <StatCard label="Total Tokens" value={formatTokens(metrics.totalTokens)} />
          <StatCard label="Total Cost" value={`$${metrics.totalCostUsd.toFixed(2)}`} />
        </StatCardGroup>
      )}

      {/* Run List */}
      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Run</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Agent</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Tokens</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Duration</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.items.map((run) => (
              <tr
                key={run.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => onRunClick?.(run.id)}
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-sm">{run.id.slice(-8)}</div>
                  <div className="text-xs text-muted-foreground">
                    {run.queuedAt.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{run.agentName}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusChip
                    status={run.status.toLowerCase() as 'active' | 'warning' | 'neutral'}
                    variant={statusVariantMap[run.status] ?? 'neutral'}
                  >
                    {run.status}
                  </StatusChip>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatTokens(run.totalTokens)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatDuration(run.durationMs)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatCost(run.estimatedCostUsd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {data.items.length} of {data.total} runs
      </div>
    </div>
  );
}

