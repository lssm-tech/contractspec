'use client';

/**
 * Run List View - Shows agent execution runs with stats
 */
import {
  StatCard,
  StatCardGroup,
  StatusChip,
  EmptyState,
  LoaderBlock,
  ErrorState,
} from '@contractspec/lib.design-system';
import { useRunList, type Run } from '../hooks/useRunList';

interface RunListViewProps {
  agentId?: string;
  onRunClick?: (runId: string) => void;
}

function getStatusTone(
  status: Run['status']
): 'success' | 'warning' | 'neutral' | 'danger' {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'RUNNING':
      return 'warning';
    case 'QUEUED':
      return 'neutral';
    case 'FAILED':
    case 'CANCELLED':
      return 'danger';
    default:
      return 'neutral';
  }
}

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
        onRetry={refetch}
        retryLabel="Retry"
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
          />
          <StatCard
            label="Total Tokens"
            value={formatTokens(metrics.totalTokens)}
          />
          <StatCard
            label="Total Cost"
            value={`$${metrics.totalCostUsd.toFixed(2)}`}
          />
        </StatCardGroup>
      )}

      {/* Run List */}
      <div className="border-border rounded-lg border">
        <table className="w-full">
          <thead className="border-border bg-muted/30 border-b">
            <tr>
              <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                Run
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                Agent
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                Tokens
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                Duration
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                Cost
              </th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {data.items.map((run: Run) => (
              <tr
                key={run.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onRunClick?.(run.id)}
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-sm">{run.id.slice(-8)}</div>
                  <div className="text-muted-foreground text-xs">
                    {run.queuedAt.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{run.agentName}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusChip
                    tone={getStatusTone(run.status)}
                    label={run.status}
                  />
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
      <div className="text-muted-foreground text-center text-sm">
        Showing {data.items.length} of {data.total} runs
      </div>
    </div>
  );
}
