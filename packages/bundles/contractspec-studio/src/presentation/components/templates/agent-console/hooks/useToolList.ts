/**
 * Hook for fetching and managing tool list data
 *
 * Uses dynamic imports for handlers to ensure correct build order.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { mockListToolsHandler } from '@lssm/example.agent-console/handlers/index';

// Re-export types for convenience
export interface Tool {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED' | 'DISABLED';
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListToolsOutput {
  items: Tool[];
  total: number;
  hasMore: boolean;
}

export interface UseToolListOptions {
  search?: string;
  category?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED' | 'all';
  limit?: number;
}

export function useToolList(options: UseToolListOptions = {}) {
  const [data, setData] = useState<ListToolsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await mockListToolsHandler({
        organizationId: 'demo-org',
        search: options.search,
        category: options.category,
        status: options.status === 'all' ? undefined : options.status,
        limit: options.limit ?? 50,
        offset: (page - 1) * (options.limit ?? 50),
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options.search, options.category, options.status, options.limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats and grouping
  const { stats, groupedByCategory, categoryStats } = useMemo(() => {
    if (!data) return { stats: null, groupedByCategory: {}, categoryStats: [] };
    const items = data.items;

    const active = items.filter((t: Tool) => t.status === 'ACTIVE').length;
    const inactive = items.filter((t: Tool) => t.status === 'INACTIVE').length;

    // Group by category
    const grouped: Record<string, Tool[]> = {};
    const byCategory: Record<string, number> = {};

    items.forEach((t: Tool) => {
      const cat = t.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    // Category stats sorted by count
    const catStats = Object.entries(byCategory)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      stats: {
        total: data.total,
        active,
        inactive,
        topCategories: catStats.slice(0, 5),
      },
      groupedByCategory: grouped,
      categoryStats: catStats,
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    stats,
    groupedByCategory,
    categoryStats,
    page,
    refetch: fetchData,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => page > 1 && setPage((p) => p - 1),
  };
}
