'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  Dashboard,
  Query,
  Widget,
} from '../../handlers/analytics.handlers';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';

export interface AnalyticsStats {
  totalDashboards: number;
  publishedDashboards: number;
  totalQueries: number;
  sharedQueries: number;
}

export function useAnalyticsData(projectId = 'local-project') {
  const { handlers } = useTemplateRuntime();
  const analytics = handlers.analytics;
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(
    null
  );
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashResult, queryResult] = await Promise.all([
        handlers.listDashboards({ projectId, limit: 100 }),
        handlers.listQueries({ projectId, limit: 100 }),
      ]);

      setDashboards(dashResult.dashboards);
      setQueries(queryResult.queries);

      // Select first dashboard if available
      if (dashResult.dashboards.length > 0 && !selectedDashboard) {
        const first = dashResult.dashboards[0];
        if (first) {
          setSelectedDashboard(first);
          const dashboardWidgets = await handlers.getWidgets(first.id);
          setWidgets(dashboardWidgets);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load analytics')
      );
    } finally {
      setLoading(false);
    }
  }, [handlers, projectId, selectedDashboard]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectDashboard = useCallback(
    async (dashboard: Dashboard) => {
      setSelectedDashboard(dashboard);
      const dashboardWidgets = await handlers.getWidgets(dashboard.id);
      setWidgets(dashboardWidgets);
    },
    [handlers]
  );

  const stats: AnalyticsStats = {
    totalDashboards: dashboards.length,
    publishedDashboards: dashboards.filter((d) => d.status === 'PUBLISHED')
      .length,
    totalQueries: queries.length,
    sharedQueries: queries.filter((q) => q.isShared).length,
  };

  return {
    dashboards,
    queries,
    selectedDashboard,
    widgets,
    loading,
    error,
    stats,
    refetch: fetchData,
    selectDashboard,
  };
}
