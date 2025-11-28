/**
 * Hook for fetching and managing tool list data
 *
 * Uses runtime-local database-backed handlers.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTemplateRuntime } from '../../../../../templates/runtime';
import type {
  Tool as RuntimeTool,
  ListToolsOutput as RuntimeListToolsOutput,
} from '@lssm/lib.runtime-local';

// Re-export types for convenience
export type Tool = RuntimeTool;
export type ListToolsOutput = RuntimeListToolsOutput;

export type ToolCategory = Tool['category'];
export type ToolStatus = Tool['status'];

export interface UseToolListOptions {
  search?: string;
  category?: ToolCategory;
  status?: ToolStatus | 'all';
  limit?: number;
}

export function useToolList(options: UseToolListOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime();
  const { agent } = handlers;

  const [data, setData] = useState<ListToolsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await agent.listTools({
        projectId,
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
  }, [
    agent,
    projectId,
    options.search,
    options.category,
    options.status,
    options.limit,
    page,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats and grouping
  const { stats, groupedByCategory, categoryStats } = useMemo(() => {
    if (!data) return { stats: null, groupedByCategory: {}, categoryStats: [] };
    const items = data.items;

    const active = items.filter((t) => t.status === 'ACTIVE').length;
    const deprecated = items.filter((t) => t.status === 'DEPRECATED').length;
    const disabled = items.filter((t) => t.status === 'DISABLED').length;

    // Group by category
    const grouped: Record<string, Tool[]> = {};
    const byCategory: Record<string, number> = {};

    items.forEach((t) => {
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
        deprecated,
        disabled,
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
