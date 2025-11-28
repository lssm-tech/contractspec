/**
 * Hook for fetching and managing agent list data
 *
 * Connects to mock handlers for demo/sandbox use
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListAgentsHandler,
  type ListAgentsInput,
  type ListAgentsOutput,
} from '@lssm/example.agent-console/handlers';

export interface UseAgentListOptions {
  organizationId?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  modelProvider?: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'MISTRAL' | 'CUSTOM';
  search?: string;
  limit?: number;
}

export interface UseAgentListState {
  data: ListAgentsOutput | null;
  loading: boolean;
  error: Error | null;
}

export function useAgentList(options: UseAgentListOptions = {}) {
  const [state, setState] = useState<UseAgentListState>({
    data: null,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(1);

  const input: ListAgentsInput = useMemo(
    () => ({
      organizationId: options.organizationId ?? 'demo-org',
      status: options.status,
      modelProvider: options.modelProvider,
      search: options.search,
      limit: options.limit ?? 20,
      offset: (page - 1) * (options.limit ?? 20),
    }),
    [options.organizationId, options.status, options.modelProvider, options.search, options.limit, page]
  );

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await mockListAgentsHandler(input);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err instanceof Error ? err : new Error('Unknown error') });
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

  // Compute stats from data
  const stats = useMemo(() => {
    if (!state.data) return null;
    const items = state.data.items;
    return {
      total: state.data.total,
      activeCount: items.filter((a) => a.status === 'ACTIVE').length,
      pausedCount: items.filter((a) => a.status === 'PAUSED').length,
      draftCount: items.filter((a) => a.status === 'DRAFT').length,
    };
  }, [state.data]);

  return {
    ...state,
    stats,
    page,
    refetch,
    nextPage,
    prevPage,
  };
}

