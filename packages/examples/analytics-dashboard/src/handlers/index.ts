/**
 * Analytics Dashboard Handlers
 */

export interface AnalyticsHandlerContext {
  userId: string;
  userRoles: string[];
  organizationId: string;
}

// ============ Mock Data Store ============

export const mockAnalyticsStore = {
  dashboards: new Map<string, unknown>(),
  widgets: new Map<string, unknown>(),
  queries: new Map<string, unknown>(),
  filters: new Map<string, unknown>(),
  reports: new Map<string, unknown>(),
};

// ============ Handlers ============

export async function handleCreateDashboard(
  input: {
    name: string;
    slug: string;
    description?: string;
    refreshInterval?: string;
    dateRange?: unknown;
  },
  context: AnalyticsHandlerContext
): Promise<{ id: string; name: string; slug: string; status: string; createdAt: Date }> {
  const id = `dash_${Date.now()}`;
  const now = new Date();

  const dashboard = {
    id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    status: 'DRAFT',
    refreshInterval: input.refreshInterval ?? 'NONE',
    dateRange: input.dateRange,
    isPublic: false,
    organizationId: context.organizationId,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
  };

  mockAnalyticsStore.dashboards.set(id, dashboard);

  return {
    id,
    name: input.name,
    slug: input.slug,
    status: 'DRAFT',
    createdAt: now,
  };
}

export async function handleAddWidget(
  input: {
    dashboardId: string;
    name: string;
    type: string;
    gridX?: number;
    gridY?: number;
    gridWidth?: number;
    gridHeight?: number;
    queryId?: string;
    config?: unknown;
  },
  _context: AnalyticsHandlerContext
): Promise<{ id: string; dashboardId: string; name: string; type: string }> {
  const id = `widget_${Date.now()}`;
  const now = new Date();

  const widget = {
    id,
    dashboardId: input.dashboardId,
    name: input.name,
    type: input.type,
    gridX: input.gridX ?? 0,
    gridY: input.gridY ?? 0,
    gridWidth: input.gridWidth ?? 6,
    gridHeight: input.gridHeight ?? 4,
    queryId: input.queryId,
    config: input.config,
    createdAt: now,
    updatedAt: now,
  };

  mockAnalyticsStore.widgets.set(id, widget);

  return {
    id,
    dashboardId: input.dashboardId,
    name: input.name,
    type: input.type,
  };
}

export async function handleCreateQuery(
  input: {
    name: string;
    description?: string;
    type: string;
    definition: unknown;
    sql?: string;
    metricIds?: string[];
    cacheTtlSeconds?: number;
    isShared?: boolean;
  },
  context: AnalyticsHandlerContext
): Promise<{ id: string; name: string; type: string; isShared: boolean; createdAt: Date }> {
  const id = `query_${Date.now()}`;
  const now = new Date();

  const query = {
    id,
    name: input.name,
    description: input.description,
    type: input.type,
    definition: input.definition,
    sql: input.sql,
    metricIds: input.metricIds ?? [],
    cacheTtlSeconds: input.cacheTtlSeconds ?? 300,
    isShared: input.isShared ?? false,
    organizationId: context.organizationId,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
  };

  mockAnalyticsStore.queries.set(id, query);

  return {
    id,
    name: input.name,
    type: input.type,
    isShared: input.isShared ?? false,
    createdAt: now,
  };
}

export async function handleListDashboards(
  input: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  },
  context: AnalyticsHandlerContext
): Promise<{ dashboards: unknown[]; total: number }> {
  let dashboards = Array.from(mockAnalyticsStore.dashboards.values())
    .filter((d) => (d as { organizationId: string }).organizationId === context.organizationId);

  if (input.status) {
    dashboards = dashboards.filter((d) => (d as { status: string }).status === input.status);
  }

  if (input.search) {
    const search = input.search.toLowerCase();
    dashboards = dashboards.filter((d) => 
      (d as { name: string }).name.toLowerCase().includes(search) ||
      (d as { description?: string }).description?.toLowerCase().includes(search)
    );
  }

  const total = dashboards.length;
  const offset = input.offset ?? 0;
  const limit = input.limit ?? 20;

  dashboards = dashboards
    .sort((a, b) => {
      const aTime = (a as { createdAt: Date }).createdAt.getTime();
      const bTime = (b as { createdAt: Date }).createdAt.getTime();
      return bTime - aTime;
    })
    .slice(offset, offset + limit);

  return { dashboards, total };
}

export async function handleGetDashboard(
  input: {
    dashboardId?: string;
    slug?: string;
    shareToken?: string;
  },
  context: AnalyticsHandlerContext
): Promise<unknown> {
  let dashboard: unknown;

  if (input.dashboardId) {
    dashboard = mockAnalyticsStore.dashboards.get(input.dashboardId);
  } else if (input.slug) {
    dashboard = Array.from(mockAnalyticsStore.dashboards.values()).find(
      (d) => 
        (d as { slug: string }).slug === input.slug &&
        (d as { organizationId: string }).organizationId === context.organizationId
    );
  } else if (input.shareToken) {
    dashboard = Array.from(mockAnalyticsStore.dashboards.values()).find(
      (d) => (d as { shareToken?: string }).shareToken === input.shareToken
    );
  }

  if (!dashboard) {
    throw new Error('Dashboard not found');
  }

  // Get widgets for dashboard
  const widgets = Array.from(mockAnalyticsStore.widgets.values()).filter(
    (w) => (w as { dashboardId: string }).dashboardId === (dashboard as { id: string }).id
  );

  return { ...dashboard, widgets };
}

