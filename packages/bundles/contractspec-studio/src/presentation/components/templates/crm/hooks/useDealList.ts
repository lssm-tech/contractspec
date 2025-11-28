/**
 * Hook for fetching and managing deal list data
 *
 * Uses dynamic imports for handlers to ensure correct build order.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  mockGetDealsByStageHandler,
  mockGetPipelineStagesHandler,
  mockListDealsHandler,
} from '@lssm/example.crm-pipeline/handlers';

// Re-export types for convenience
export interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: 'OPEN' | 'WON' | 'LOST' | 'STALE';
  contactId?: string;
  companyId?: string;
  ownerId: string;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListDealsOutput {
  deals: Deal[];
  total: number;
  totalValue: number;
}

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
  const [stages, setStages] = useState<
    { id: string; name: string; position: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const pipelineId = options.pipelineId ?? 'pipeline-1';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dealsResult, stageDealsResult, stagesResult] = await Promise.all([
        mockListDealsHandler({
          pipelineId,
          stageId: options.stageId,
          status: options.status === 'all' ? undefined : options.status,
          search: options.search,
          limit: options.limit ?? 50,
          offset: (page - 1) * (options.limit ?? 50),
        }),
        mockGetDealsByStageHandler({ pipelineId }),
        mockGetPipelineStagesHandler({ pipelineId }),
      ]);
      setData(dealsResult);
      setDealsByStage(stageDealsResult);
      setStages(stagesResult);
      console.log('fetching deals for pipeline', {
        dealsResult,
        stageDealsResult,
        stagesResult,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [
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
