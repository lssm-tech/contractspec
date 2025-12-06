'use client';

/**
 * Analytics Dashboard
 *
 * Interactive dashboard for the analytics-dashboard template.
 * Displays dashboards, widgets, and queries.
 */
import { useState } from 'react';
import {
  Button,
  ErrorState,
  LoaderBlock,
  StatCard,
  StatCardGroup,
} from '@lssm/lib.design-system';
import { useAnalyticsData } from './hooks/useAnalyticsData';

type Tab = 'dashboards' | 'queries';

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  ARCHIVED:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const WIDGET_ICONS: Record<string, string> = {
  LINE_CHART: '📈',
  BAR_CHART: '📊',
  PIE_CHART: '🥧',
  AREA_CHART: '📉',
  SCATTER_PLOT: '⚬',
  METRIC: '🔢',
  TABLE: '📋',
  HEATMAP: '🗺️',
  FUNNEL: '⏬',
  MAP: '🌍',
  TEXT: '📝',
  EMBED: '🔗',
};

const QUERY_TYPE_COLORS: Record<string, string> = {
  SQL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  METRIC:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  AGGREGATION:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  CUSTOM: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboards');
  const {
    dashboards,
    queries,
    selectedDashboard,
    widgets,
    loading,
    error,
    stats,
    refetch,
    selectDashboard,
  } = useAnalyticsData();

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboards', label: 'Dashboards', icon: '📊' },
    { id: 'queries', label: 'Queries', icon: '🔍' },
  ];

  if (loading) {
    return <LoaderBlock label="Loading Analytics..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load Analytics"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Button onClick={() => alert('Create dashboard modal')}>
          <span className="mr-2">+</span> New Dashboard
        </Button>
      </div>

      {/* Stats Row */}
      <StatCardGroup>
        <StatCard
          label="Dashboards"
          value={stats.totalDashboards}
          hint={`${stats.publishedDashboards} published`}
        />
        <StatCard
          label="Queries"
          value={stats.totalQueries}
          hint={`${stats.sharedQueries} shared`}
        />
        <StatCard
          label="Widgets"
          value={widgets.length}
          hint="on current dashboard"
        />
      </StatCardGroup>

      {/* Navigation Tabs */}
      <nav className="bg-muted flex gap-1 rounded-lg p-1" role="tablist">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[400px]" role="tabpanel">
        {activeTab === 'dashboards' && (
          <div className="space-y-6">
            {/* Dashboard List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  onClick={() => selectDashboard(dashboard)}
                  className={`border-border bg-card cursor-pointer rounded-lg border p-4 transition-all ${
                    selectedDashboard?.id === dashboard.id
                      ? 'ring-primary ring-2'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{dashboard.name}</h3>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[dashboard.status] ?? ''}`}
                    >
                      {dashboard.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3 text-sm">
                    {dashboard.description}
                  </p>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>/{dashboard.slug}</span>
                    {dashboard.isPublic && (
                      <span className="text-green-600 dark:text-green-400">
                        🌐 Public
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {dashboards.length === 0 && (
                <div className="text-muted-foreground col-span-full flex h-64 items-center justify-center">
                  No dashboards created yet
                </div>
              )}
            </div>

            {/* Widget Grid for Selected Dashboard */}
            {selectedDashboard && widgets.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Widgets in "{selectedDashboard.name}"
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="border-border bg-card rounded-lg border p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">
                          {WIDGET_ICONS[widget.type] ?? '📊'}
                        </span>
                        <span className="font-medium">{widget.name}</span>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {widget.type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-muted-foreground mt-2 text-xs">
                        Position: ({widget.gridX}, {widget.gridY}) •{' '}
                        {widget.gridWidth}x{widget.gridHeight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="border-border rounded-lg border">
            <table className="w-full">
              <thead className="border-border bg-muted/30 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Query
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Cache TTL
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Shared
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {queries.map((query) => (
                  <tr key={query.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{query.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {query.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${QUERY_TYPE_COLORS[query.type] ?? ''}`}
                      >
                        {query.type}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {query.cacheTtlSeconds}s
                    </td>
                    <td className="px-4 py-3">
                      {query.isShared ? (
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {queries.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted-foreground px-4 py-8 text-center"
                    >
                      No queries saved
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
