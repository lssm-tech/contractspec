/**
 * Hook for fetching and managing run list data
 *
 * Uses runtime-local database-backed handlers.
 */
import { useState, useEffect, useCallback } from 'react';
import { useTemplateRuntime } from '../../../../../templates/runtime';
import type {
  Run as RuntimeRun,
  ListRunsOutput as RuntimeListRunsOutput,
  RunMetrics as RuntimeRunMetrics,
} from '@lssm/lib.runtime-local';

// Re-export types for convenience
export type Run = RuntimeRun;
export type ListRunsOutput = RuntimeListRunsOutput;
export type RunMetrics = RuntimeRunMetrics;

export interface UseRunListOptions {
  agentId?: string;
  status?: Run['status'] | 'all';
  limit?: number;
}

export function useRunList(options: UseRunListOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime();
  const { agent } = handlers;

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
        agent.listRuns({
          projectId,
          agentId: options.agentId,
          status: options.status === 'all' ? undefined : options.status,
          limit: options.limit ?? 20,
          offset: (page - 1) * (options.limit ?? 20),
        }),
        agent.getRunMetrics({
          projectId,
          agentId: options.agentId,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          endDate: new Date(),
        }),
      ]);
      setData(runsResult);
      setMetrics(metricsResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [agent, projectId, options.agentId, options.status, options.limit, page]);

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
