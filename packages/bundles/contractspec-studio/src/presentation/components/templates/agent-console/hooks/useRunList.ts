/**
 * Hook for fetching and managing run list data
 *
 * Uses dynamic imports for handlers to ensure correct build order.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListRunsHandler,
  mockGetRunMetricsHandler,
} from '@lssm/example.agent-console/handlers/index';

// Re-export types for convenience
export interface Run {
  id: string;
  agentId: string;
  agentName: string;
  status:
    | 'QUEUED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED';
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
  stepCount: number;
  toolCallCount: number;
}

export interface RunMetrics {
  totalRuns: number;
  successRate: number;
  avgDurationMs: number;
  totalTokens: number;
  totalCostUsd: number;
}

export interface ListRunsOutput {
  items: Run[];
  total: number;
  hasMore: boolean;
}

export interface UseRunListOptions {
  agentId?: string;
  status?: Run['status'] | 'all';
  limit?: number;
}

export function useRunList(options: UseRunListOptions = {}) {
  const [data, setData] = useState<ListRunsOutput | null>(null);
  const [metrics, setMetrics] = useState<RunMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [runsResult, metricsResult] = await Promise.all([
        mockListRunsHandler({
          organizationId: 'demo-org',
          agentId: options.agentId,
          status: options.status === 'all' ? undefined : options.status,
          limit: options.limit ?? 20,
          offset: (page - 1) * (options.limit ?? 20),
        }),
        mockGetRunMetricsHandler({
          organizationId: 'demo-org',
          agentId: options.agentId,
        }),
      ]);
      setData(runsResult);
      setMetrics(metricsResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options.agentId, options.status, options.limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    metrics,
    loading,
    error,
    page,
    refetch: fetchData,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => page > 1 && setPage((p) => p - 1),
  };
}
