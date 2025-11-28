/**
 * Hook for fetching and managing project list data
 *
 * Uses dynamic imports for handlers to ensure correct build order.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  mockListProjectsHandler,
  mockGetSubscriptionHandler,
} from '@lssm/example.saas-boilerplate/handlers';

// Re-export types for convenience
export interface Project {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  organizationId: string;
  createdBy: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  planName: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  limits: {
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
  usage: {
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
}

export interface ListProjectsOutput {
  projects: Project[];
  total: number;
}

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [projectsResult, subscriptionResult] = await Promise.all([
        mockListProjectsHandler({
          status: options.status === 'all' ? undefined : options.status,
          search: options.search,
          limit: options.limit ?? 20,
          offset: (page - 1) * (options.limit ?? 20),
        }),
        mockGetSubscriptionHandler(),
      ]);
      setData(projectsResult);
      setSubscription(subscriptionResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options.status, options.search, options.limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!data || !subscription) return null;
    const items = data.projects;
    return {
      total: data.total,
      activeCount: items.filter((p: Project) => p.status === 'ACTIVE').length,
      draftCount: items.filter((p: Project) => p.status === 'DRAFT').length,
      projectLimit: subscription.limits.projects,
      usagePercent:
        (subscription.usage.projects / subscription.limits.projects) * 100,
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
