/**
 * Hook for fetching and managing run list data
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListRunsHandler,
  mockGetRunMetricsHandler,
  type ListRunsInput,
  type ListRunsOutput,
  type RunMetrics,
} from '@lssm/example.agent-console/handlers';

export interface UseRunListOptions {
  organizationId?: string;
  agentId?: string;
  status?:
    | 'QUEUED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED';
  limit?: number;
}

export interface UseRunListState {
  data: ListRunsOutput | null;
  metrics: RunMetrics | null;
  loading: boolean;
  error: Error | null;
}

export function useRunList(options: UseRunListOptions = {}) {
  const [state, setState] = useState<UseRunListState>({
    data: null,
    metrics: null,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(1);

  const input: ListRunsInput = useMemo(
    () => ({
      organizationId: options.organizationId ?? 'demo-org',
      agentId: options.agentId,
      status: options.status,
      limit: options.limit ?? 20,
      offset: (page - 1) * (options.limit ?? 20),
    }),
    [
      options.organizationId,
      options.agentId,
      options.status,
      options.limit,
      page,
    ]
  );

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [runsResult, metricsResult] = await Promise.all([
        mockListRunsHandler(input),
        mockGetRunMetricsHandler({
          organizationId: input.organizationId ?? 'demo-org',
          agentId: input.agentId,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          endDate: new Date(),
          granularity: 'day',
        }),
      ]);
      setState({
        data: runsResult,
        metrics: metricsResult,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        data: null,
        metrics: null,
        loading: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      });
    }
  }, [input]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (state.data?.hasMore) {
      setPage((p) => p + 1);
    }
  }, [state.data?.hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }, [page]);

  return {
    ...state,
    page,
    refetch,
    nextPage,
    prevPage,
  };
}
