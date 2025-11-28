/**
 * Hook for fetching and managing deal list data
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListDealsHandler,
  mockGetDealsByStageHandler,
  mockGetPipelineStagesHandler,
  type ListDealsInput,
  type ListDealsOutput,
  type Deal,
} from '@lssm/example.crm-pipeline/handlers';

export interface UseDealListOptions {
  pipelineId?: string;
  stageId?: string;
  status?: 'OPEN' | 'WON' | 'LOST' | 'all';
  search?: string;
  limit?: number;
}

export function useDealList(options: UseDealListOptions = {}) {
  const [data, setData] = useState<ListDealsOutput | null>(null);
  const [dealsByStage, setDealsByStage] = useState<Record<string, Deal[]>>({});
  const [stages, setStages] = useState<Array<{ id: string; name: string; position: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const pipelineId = options.pipelineId ?? 'pipeline-1';

  const input: ListDealsInput = useMemo(
    () => ({
      pipelineId,
      stageId: options.stageId,
      status: options.status,
      search: options.search,
      limit: options.limit ?? 50,
      offset: (page - 1) * (options.limit ?? 50),
    }),
    [pipelineId, options.stageId, options.status, options.search, options.limit, page]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsResult, stageDealsResult, stagesResult] = await Promise.all([
        mockListDealsHandler(input),
        mockGetDealsByStageHandler({ pipelineId }),
        mockGetPipelineStagesHandler({ pipelineId }),
      ]);
      setData(dealsResult);
      setDealsByStage(stageDealsResult);
      setStages(stagesResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [input, pipelineId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!data) return null;
    const open = data.deals.filter((d) => d.status === 'OPEN');
    const won = data.deals.filter((d) => d.status === 'WON');
    const lost = data.deals.filter((d) => d.status === 'LOST');

    return {
      total: data.total,
      totalValue: data.totalValue,
      openCount: open.length,
      openValue: open.reduce((sum, d) => sum + d.value, 0),
      wonCount: won.length,
      wonValue: won.reduce((sum, d) => sum + d.value, 0),
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

