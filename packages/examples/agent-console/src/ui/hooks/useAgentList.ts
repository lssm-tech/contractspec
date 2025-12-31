/**
 * Hook for fetching and managing agent list data
 *
 * Uses runtime-local database-backed handlers.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import type {
  Agent as RuntimeAgent,
  ListAgentsOutput as RuntimeListAgentsOutput,
} from '../../handlers/agent.handlers';
import type { AgentHandlers } from '../../handlers/agent.handlers';

// Re-export types for convenience
export type Agent = RuntimeAgent;
export type ListAgentsOutput = RuntimeListAgentsOutput;

export interface UseAgentListOptions {
  search?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'all';
  limit?: number;
}

export function useAgentList(options: UseAgentListOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime<{agent: AgentHandlers}>();
  const { agent } = handlers;

  const [data, setData] = useState<ListAgentsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await agent.listAgents({
        projectId,
        search: options.search,
        status: options.status === 'all' ? undefined : options.status,
        limit: options.limit ?? 20,
        offset: (page - 1) * (options.limit ?? 20),
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [agent, projectId, options.search, options.status, options.limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!data) return null;
    return {
      total: data.total,
      active: data.items.filter((a) => a.status === 'ACTIVE').length,
      paused: data.items.filter((a) => a.status === 'PAUSED').length,
      draft: data.items.filter((a) => a.status === 'DRAFT').length,
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    stats,
    page,
    refetch: fetchData,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => page > 1 && setPage((p) => p - 1),
  };
}
