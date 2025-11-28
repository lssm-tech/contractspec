/**
 * Hook for fetching and managing deal list data
 *
 * Uses runtime-local database-backed handlers.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTemplateRuntime } from '../../../../../templates/runtime';
import type {
  Deal as RuntimeDeal,
  Stage,
  ListDealsOutput as RuntimeListDealsOutput,
} from '@lssm/lib.runtime-local';

// Re-export types for convenience
export type Deal = RuntimeDeal;
export type ListDealsOutput = RuntimeListDealsOutput;

export interface UseDealListOptions {
  pipelineId?: string;
  stageId?: string;
  status?: 'OPEN' | 'WON' | 'LOST' | 'all';
  search?: string;
  limit?: number;
}

export function useDealList(options: UseDealListOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime();
  const { crm } = handlers;

  const [data, setData] = useState<ListDealsOutput | null>(null);
  const [dealsByStage, setDealsByStage] = useState<Record<string, Deal[]>>({});
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const pipelineId = options.pipelineId ?? 'pipeline-1';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dealsResult, stageDealsResult, stagesResult] = await Promise.all([
        crm.listDeals({
          projectId,
          pipelineId,
          stageId: options.stageId,
          status: options.status === 'all' ? undefined : options.status,
          search: options.search,
          limit: options.limit ?? 50,
          offset: (page - 1) * (options.limit ?? 50),
        }),
        crm.getDealsByStage({ projectId, pipelineId }),
        crm.getPipelineStages({ pipelineId }),
      ]);
      setData(dealsResult);
      setDealsByStage(stageDealsResult);
      setStages(stagesResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [
    crm,
    projectId,
    pipelineId,
    options.stageId,
    options.status,
    options.search,
    options.limit,
    page,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!data) return null;
    const open = data.deals.filter((d: Deal) => d.status === 'OPEN');
    const won = data.deals.filter((d: Deal) => d.status === 'WON');
    const lost = data.deals.filter((d: Deal) => d.status === 'LOST');

    return {
      total: data.total,
      totalValue: data.totalValue,
      openCount: open.length,
      openValue: open.reduce((sum: number, d: Deal) => sum + d.value, 0),
      wonCount: won.length,
      wonValue: won.reduce((sum: number, d: Deal) => sum + d.value, 0),
      lostCount: lost.length,
    };
  }, [data]);

  return {
    data,
    dealsByStage,
    stages,
    loading,
    error,
    stats,
    page,
    refetch: fetchData,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => page > 1 && setPage((p) => p - 1),
  };
}
