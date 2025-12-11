/**
 * Hook for fetching and managing project list data
 *
 * Uses runtime-local database-backed handlers.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTemplateRuntime } from '../../../../../templates/runtime';
import type {
  Project as RuntimeProject,
  Subscription as RuntimeSubscription,
} from '../../../../../infrastructure/runtime-local-web';

// Re-export types for convenience
export type Project = RuntimeProject;
export type Subscription = RuntimeSubscription;

export interface ListProjectsOutput {
  items: Project[];
  total: number;
}

export interface UseProjectListOptions {
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'all';
  search?: string;
  limit?: number;
}

export function useProjectList(options: UseProjectListOptions = {}) {
  const { handlers, projectId } = useTemplateRuntime();
  const { saas } = handlers;

  const [data, setData] = useState<ListProjectsOutput | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [projectsResult, subscriptionResult] = await Promise.all([
        saas.listProjects({
          projectId,
          status: options.status === 'all' ? undefined : options.status,
          search: options.search,
          limit: options.limit ?? 20,
          offset: (page - 1) * (options.limit ?? 20),
        }),
        saas.getSubscription({ projectId }),
      ]);
      setData({
        items: projectsResult.items,
        total: projectsResult.total,
      });
      setSubscription(subscriptionResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [saas, projectId, options.status, options.search, options.limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!data) return null;
    const items = data.items;
    return {
      total: data.total,
      activeCount: items.filter((p) => p.status === 'ACTIVE').length,
      draftCount: items.filter((p) => p.status === 'DRAFT').length,
      // Subscription stats are optional since they may not be seeded
      projectLimit: 10, // Default limit for demo
      usagePercent: Math.min((data.total / 10) * 100, 100),
    };
  }, [data]);

  return {
    data,
    subscription,
    loading,
    error,
    stats,
    page,
    refetch: fetchData,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => page > 1 && setPage((p) => p - 1),
  };
}
