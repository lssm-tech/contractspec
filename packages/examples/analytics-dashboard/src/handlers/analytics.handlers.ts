/**
 * Runtime-local Analytics Dashboard handlers
 *
 * Database-backed handlers for the analytics-dashboard template.
 */
import type { DatabasePort, DbRow } from '@contractspec/lib.runtime-sandbox';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { web } from '@contractspec/lib.runtime-sandbox';
const { generateId } = web;

// ============ Types ============

export interface Dashboard {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  refreshInterval:
    | 'NONE'
    | 'MINUTE'
    | 'FIVE_MINUTES'
    | 'FIFTEEN_MINUTES'
    | 'HOUR'
    | 'DAY';
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Widget {
  id: string;
  dashboardId: string;
  name: string;
  type:
    | 'LINE_CHART'
    | 'BAR_CHART'
    | 'PIE_CHART'
    | 'AREA_CHART'
    | 'SCATTER_PLOT'
    | 'METRIC'
    | 'TABLE'
    | 'HEATMAP'
    | 'FUNNEL'
    | 'MAP'
    | 'TEXT'
    | 'EMBED';
  gridX: number;
  gridY: number;
  gridWidth: number;
  gridHeight: number;
  queryId?: string;
  config?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Query {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'SQL' | 'METRIC' | 'AGGREGATION' | 'CUSTOM';
  definition: Record<string, unknown>;
  sql?: string;
  cacheTtlSeconds: number;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDashboardInput {
  name: string;
  slug: string;
  description?: string;
  refreshInterval?: Dashboard['refreshInterval'];
}

export interface AddWidgetInput {
  dashboardId: string;
  name: string;
  type: Widget['type'];
  gridX?: number;
  gridY?: number;
  gridWidth?: number;
  gridHeight?: number;
  queryId?: string;
  config?: Record<string, unknown>;
}

export interface CreateQueryInput {
  name: string;
  description?: string;
  type: Query['type'];
  definition: Record<string, unknown>;
  sql?: string;
  cacheTtlSeconds?: number;
  isShared?: boolean;
}

export interface ListDashboardsInput {
  projectId: string;
  status?: Dashboard['status'] | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListDashboardsOutput {
  dashboards: Dashboard[];
  total: number;
}

export interface ListQueriesInput {
  projectId: string;
  type?: Query['type'] | 'all';
  isShared?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListQueriesOutput {
  queries: Query[];
  total: number;
}

// ============ Row Types ============

interface DashboardRow {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  refreshInterval: string;
  isPublic: number;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WidgetRow {
  id: string;
  dashboardId: string;
  name: string;
  type: string;
  gridX: number;
  gridY: number;
  gridWidth: number;
  gridHeight: number;
  queryId: string | null;
  config: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QueryRow {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  type: string;
  definition: string;
  sql: string | null;
  cacheTtlSeconds: number;
  isShared: number;
  createdAt: string;
  updatedAt: string;
}

function rowToDashboard(row: DashboardRow): Dashboard {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    status: row.status as Dashboard['status'],
    refreshInterval: row.refreshInterval as Dashboard['refreshInterval'],
    isPublic: row.isPublic === 1,
    shareToken: row.shareToken ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToWidget(row: WidgetRow): Widget {
  return {
    id: row.id,
    dashboardId: row.dashboardId,
    name: row.name,
    type: row.type as Widget['type'],
    gridX: row.gridX,
    gridY: row.gridY,
    gridWidth: row.gridWidth,
    gridHeight: row.gridHeight,
    queryId: row.queryId ?? undefined,
    config: row.config ? JSON.parse(row.config) : undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToQuery(row: QueryRow): Query {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    type: row.type as Query['type'],
    definition: JSON.parse(row.definition),
    sql: row.sql ?? undefined,
    cacheTtlSeconds: row.cacheTtlSeconds,
    isShared: row.isShared === 1,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// ============ Handler Factory ============

export function createAnalyticsHandlers(db: DatabasePort) {
  /**
   * List dashboards
   */
  async function listDashboards(
    input: ListDashboardsInput
  ): Promise<ListDashboardsOutput> {
    const { projectId, status, search, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM analytics_dashboard ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM analytics_dashboard ${whereClause} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as DashboardRow[];

    return {
      dashboards: rows.map(rowToDashboard),
      total,
    };
  }

  /**
   * Create a dashboard
   */
  async function createDashboard(
    input: CreateDashboardInput,
    context: { projectId: string; organizationId: string }
  ): Promise<Dashboard> {
    const id = generateId('dash');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO analytics_dashboard (id, projectId, organizationId, name, slug, description, status, refreshInterval, isPublic, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.slug,
        input.description ?? null,
        'DRAFT',
        input.refreshInterval ?? 'NONE',
        0,
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM analytics_dashboard WHERE id = ?`, [id])
    ).rows as unknown as DashboardRow[];

    return rowToDashboard(rows[0]!);
  }

  /**
   * Get a dashboard by ID or slug
   */
  async function getDashboard(input: {
    dashboardId?: string;
    slug?: string;
    shareToken?: string;
  }): Promise<Dashboard | null> {
    let whereClause = '';
    const params: string[] = [];

    if (input.dashboardId) {
      whereClause = 'WHERE id = ?';
      params.push(input.dashboardId);
    } else if (input.slug) {
      whereClause = 'WHERE slug = ?';
      params.push(input.slug);
    } else if (input.shareToken) {
      whereClause = 'WHERE shareToken = ?';
      params.push(input.shareToken);
    } else {
      return null;
    }

    const rows = (
      await db.query(`SELECT * FROM analytics_dashboard ${whereClause}`, params)
    ).rows as unknown as DashboardRow[];

    return rows[0] ? rowToDashboard(rows[0]) : null;
  }

  /**
   * Update dashboard
   */
  async function updateDashboard(
    dashboardId: string,
    updates: Partial<
      Pick<
        Dashboard,
        'name' | 'description' | 'status' | 'refreshInterval' | 'isPublic'
      >
    >
  ): Promise<Dashboard> {
    const now = new Date().toISOString();
    const setClauses: string[] = ['updatedAt = ?'];
    const params: (string | number)[] = [now];

    if (updates.name !== undefined) {
      setClauses.push('name = ?');
      params.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClauses.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status !== undefined) {
      setClauses.push('status = ?');
      params.push(updates.status);
    }
    if (updates.refreshInterval !== undefined) {
      setClauses.push('refreshInterval = ?');
      params.push(updates.refreshInterval);
    }
    if (updates.isPublic !== undefined) {
      setClauses.push('isPublic = ?');
      params.push(updates.isPublic ? 1 : 0);

      // Generate share token if making public
      if (updates.isPublic) {
        setClauses.push('shareToken = ?');
        params.push(generateId('share'));
      } else {
        setClauses.push('shareToken = NULL');
      }
    }

    params.push(dashboardId);

    await db.execute(
      `UPDATE analytics_dashboard SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    const rows = (
      await db.query(`SELECT * FROM analytics_dashboard WHERE id = ?`, [
        dashboardId,
      ])
    ).rows as unknown as DashboardRow[];

    return rowToDashboard(rows[0]!);
  }

  /**
   * Get widgets for a dashboard
   */
  async function getWidgets(dashboardId: string): Promise<Widget[]> {
    const rows = (
      await db.query(
        `SELECT * FROM analytics_widget WHERE dashboardId = ? ORDER BY gridY, gridX`,
        [dashboardId]
      )
    ).rows as unknown as WidgetRow[];

    return rows.map(rowToWidget);
  }

  /**
   * Add a widget to a dashboard
   */
  async function addWidget(input: AddWidgetInput): Promise<Widget> {
    const id = generateId('widget');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO analytics_widget (id, dashboardId, name, type, gridX, gridY, gridWidth, gridHeight, queryId, config, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.dashboardId,
        input.name,
        input.type,
        input.gridX ?? 0,
        input.gridY ?? 0,
        input.gridWidth ?? 6,
        input.gridHeight ?? 4,
        input.queryId ?? null,
        input.config ? JSON.stringify(input.config) : null,
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM analytics_widget WHERE id = ?`, [id])
    ).rows as unknown as WidgetRow[];

    return rowToWidget(rows[0]!);
  }

  /**
   * Update a widget
   */
  async function updateWidget(
    widgetId: string,
    updates: Partial<
      Pick<
        Widget,
        | 'name'
        | 'gridX'
        | 'gridY'
        | 'gridWidth'
        | 'gridHeight'
        | 'queryId'
        | 'config'
      >
    >
  ): Promise<Widget> {
    const now = new Date().toISOString();
    const setClauses: string[] = ['updatedAt = ?'];
    const params: (string | number | null)[] = [now];

    if (updates.name !== undefined) {
      setClauses.push('name = ?');
      params.push(updates.name);
    }
    if (updates.gridX !== undefined) {
      setClauses.push('gridX = ?');
      params.push(updates.gridX);
    }
    if (updates.gridY !== undefined) {
      setClauses.push('gridY = ?');
      params.push(updates.gridY);
    }
    if (updates.gridWidth !== undefined) {
      setClauses.push('gridWidth = ?');
      params.push(updates.gridWidth);
    }
    if (updates.gridHeight !== undefined) {
      setClauses.push('gridHeight = ?');
      params.push(updates.gridHeight);
    }
    if (updates.queryId !== undefined) {
      setClauses.push('queryId = ?');
      params.push(updates.queryId ?? null);
    }
    if (updates.config !== undefined) {
      setClauses.push('config = ?');
      params.push(updates.config ? JSON.stringify(updates.config) : null);
    }

    params.push(widgetId);

    await db.execute(
      `UPDATE analytics_widget SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    const rows = (
      await db.query(`SELECT * FROM analytics_widget WHERE id = ?`, [widgetId])
    ).rows as unknown as WidgetRow[];

    return rowToWidget(rows[0]!);
  }

  /**
   * Delete a widget
   */
  async function deleteWidget(widgetId: string): Promise<void> {
    await db.execute(`DELETE FROM analytics_widget WHERE id = ?`, [widgetId]);
  }

  /**
   * List queries
   */
  async function listQueries(
    input: ListQueriesInput
  ): Promise<ListQueriesOutput> {
    const { projectId, type, isShared, search, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (type && type !== 'all') {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (isShared !== undefined) {
      whereClause += ' AND isShared = ?';
      params.push(isShared ? 1 : 0);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM analytics_query ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM analytics_query ${whereClause} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as QueryRow[];

    return {
      queries: rows.map(rowToQuery),
      total,
    };
  }

  /**
   * Create a query
   */
  async function createQuery(
    input: CreateQueryInput,
    context: { projectId: string; organizationId: string }
  ): Promise<Query> {
    const id = generateId('query');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO analytics_query (id, projectId, organizationId, name, description, type, definition, sql, cacheTtlSeconds, isShared, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.description ?? null,
        input.type,
        JSON.stringify(input.definition),
        input.sql ?? null,
        input.cacheTtlSeconds ?? 300,
        input.isShared ? 1 : 0,
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM analytics_query WHERE id = ?`, [id])
    ).rows as unknown as QueryRow[];

    return rowToQuery(rows[0]!);
  }

  /**
   * Get a query by ID
   */
  async function getQuery(queryId: string): Promise<Query | null> {
    const rows = (
      await db.query(`SELECT * FROM analytics_query WHERE id = ?`, [queryId])
    ).rows as unknown as QueryRow[];

    return rows[0] ? rowToQuery(rows[0]) : null;
  }

  return {
    listDashboards,
    createDashboard,
    getDashboard,
    updateDashboard,
    getWidgets,
    addWidget,
    updateWidget,
    deleteWidget,
    listQueries,
    createQuery,
    getQuery,
  };
}

export type AnalyticsHandlers = ReturnType<typeof createAnalyticsHandlers>;
