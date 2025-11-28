/**
 * Hook for fetching and managing tool list data
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListToolsHandler,
  type ListToolsInput,
  type ListToolsOutput,
} from '@lssm/example.agent-console/handlers';

export interface UseToolListOptions {
  organizationId?: string;
  category?: 'RETRIEVAL' | 'COMPUTATION' | 'COMMUNICATION' | 'INTEGRATION' | 'UTILITY' | 'CUSTOM';
  status?: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'DISABLED';
  search?: string;
  limit?: number;
}

export function useToolList(options: UseToolListOptions = {}) {
  const [data, setData] = useState<ListToolsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const input: ListToolsInput = useMemo(
    () => ({
      organizationId: options.organizationId ?? 'demo-org',
      category: options.category,
      status: options.status,
      search: options.search,
      limit: options.limit ?? 20,
      offset: (page - 1) * (options.limit ?? 20),
    }),
    [options.organizationId, options.category, options.status, options.search, options.limit, page]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockListToolsHandler(input);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Group tools by category
  const groupedByCategory = useMemo(() => {
    if (!data?.items) return {};
    return data.items.reduce(
      (acc, tool) => {
        const category = tool.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(tool);
        return acc;
      },
      {} as Record<string, typeof data.items>
    );
  }, [data?.items]);

  // Stats by category
  const categoryStats = useMemo(() => {
    if (!data?.items) return [];
    const counts = data.items.reduce(
      (acc, tool) => {
        acc[tool.category] = (acc[tool.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [data?.items]);

  return {
    data,
    loading,
    error,
    page,
    refetch,
    groupedByCategory,
    categoryStats,
    nextPage: () => data?.hasMore && setPage((p) => p + 1),
    prevPage: () => page > 1 && setPage((p) => p - 1),
  };
}

