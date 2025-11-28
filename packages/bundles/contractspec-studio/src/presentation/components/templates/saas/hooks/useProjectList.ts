/**
 * Hook for fetching and managing project list data
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListProjectsHandler,
  mockGetSubscriptionHandler,
  type ListProjectsInput,
  type ListProjectsOutput,
  type Subscription,
} from '@lssm/example.saas-boilerplate/handlers';

export interface UseProjectListOptions {
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'all';
  search?: string;
  limit?: number;
}

export function useProjectList(options: UseProjectListOptions = {}) {
  const [data, setData] = useState<ListProjectsOutput | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const input: ListProjectsInput = useMemo(
    () => ({
      status: options.status,
      search: options.search,
      limit: options.limit ?? 20,
      offset: (page - 1) * (options.limit ?? 20),
    }),
    [options.status, options.search, options.limit, page]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsResult, subscriptionResult] = await Promise.all([
        mockListProjectsHandler(input),
        mockGetSubscriptionHandler(),
      ]);
      setData(projectsResult);
      setSubscription(subscriptionResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    if (!data || !subscription) return null;
    const items = data.projects;
    return {
      total: data.total,
      activeCount: items.filter((p) => p.status === 'ACTIVE').length,
      draftCount: items.filter((p) => p.status === 'DRAFT').length,
      projectLimit: subscription.limits.projects,
      usagePercent: (subscription.usage.projects / subscription.limits.projects) * 100,
    };
  }, [data, subscription]);

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

