/**
 * Runtime-local SaaS Boilerplate handlers
 *
 * Database-backed handlers for project and billing management.
 */
import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { generateId } from '../utils/id';

// ============ Types ============

export interface Project {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  projectId: string;
  organizationId: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  billingCycle: 'MONTHLY' | 'YEARLY';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface ListProjectsInput {
  projectId: string;
  organizationId?: string;
  status?: Project['status'] | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListProjectsOutput {
  items: Project[];
  total: number;
  hasMore: boolean;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  tier?: Project['tier'];
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: Project['status'];
}

// ============ Row Types ============

interface ProjectRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: string;
  tier: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  organizationId: string;
  plan: string;
  status: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: number;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    status: row.status as Project['status'],
    tier: row.tier as Project['tier'],
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    plan: row.plan as Subscription['plan'],
    status: row.status as Subscription['status'],
    billingCycle: row.billingCycle as Subscription['billingCycle'],
    currentPeriodStart: new Date(row.currentPeriodStart),
    currentPeriodEnd: new Date(row.currentPeriodEnd),
    cancelAtPeriodEnd: Boolean(row.cancelAtPeriodEnd),
  };
}

// ============ Handler Factory ============

export function createSaasHandlers(db: DatabasePort) {
  /**
   * List projects
   */
  async function listProjects(
    input: ListProjectsInput
  ): Promise<ListProjectsOutput> {
    const {
      projectId,
      organizationId,
      status,
      search,
      limit = 20,
      offset = 0,
    } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (organizationId) {
      whereClause += ' AND organizationId = ?';
      params.push(organizationId);
    }

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
        `SELECT COUNT(*) as count FROM saas_project ${whereClause}`,
        params
      )
    ).rows as unknown as { count: number }[];
    const total = countResult[0]?.count ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM saas_project ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as ProjectRow[];

    return {
      items: rows.map(rowToProject),
      total,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Get a single project
   */
  async function getProject(id: string): Promise<Project | null> {
    const rows = (
      await db.query(`SELECT * FROM saas_project WHERE id = ?`, [id])
    ).rows as unknown as ProjectRow[];
    return rows[0] ? rowToProject(rows[0]) : null;
  }

  /**
   * Create a project
   */
  async function createProject(
    input: CreateProjectInput,
    context: { projectId: string; organizationId: string }
  ): Promise<Project> {
    const id = generateId('proj');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO saas_project (id, projectId, organizationId, name, description, status, tier, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.description ?? null,
        'DRAFT',
        input.tier ?? 'FREE',
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM saas_project WHERE id = ?`, [id])
    ).rows as unknown as ProjectRow[];

    return rowToProject(rows[0]!);
  }

  /**
   * Update a project
   */
  async function updateProject(input: UpdateProjectInput): Promise<Project> {
    const now = new Date().toISOString();
    const updates: string[] = ['updatedAt = ?'];
    const params: (string | null)[] = [now];

    if (input.name !== undefined) {
      updates.push('name = ?');
      params.push(input.name);
    }

    if (input.description !== undefined) {
      updates.push('description = ?');
      params.push(input.description);
    }

    if (input.status !== undefined) {
      updates.push('status = ?');
      params.push(input.status);
    }

    params.push(input.id);

    await db.execute(
      `UPDATE saas_project SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const rows = (
      await db.query(`SELECT * FROM saas_project WHERE id = ?`, [input.id])
    ).rows as unknown as ProjectRow[];

    if (!rows[0]) {
      throw new Error('NOT_FOUND');
    }

    return rowToProject(rows[0]);
  }

  /**
   * Delete a project
   */
  async function deleteProject(id: string): Promise<void> {
    await db.execute(`DELETE FROM saas_project WHERE id = ?`, [id]);
  }

  /**
   * Get subscription for an organization
   */
  async function getSubscription(input: {
    projectId: string;
    organizationId?: string;
  }): Promise<Subscription | null> {
    let query = `SELECT * FROM saas_subscription WHERE projectId = ?`;
    const params: string[] = [input.projectId];

    if (input.organizationId) {
      query += ' AND organizationId = ?';
      params.push(input.organizationId);
    }

    query += ' LIMIT 1';

    const rows = (await db.query(query, params))
      .rows as unknown as SubscriptionRow[];
    return rows[0] ? rowToSubscription(rows[0]) : null;
  }

  return {
    listProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getSubscription,
  };
}

export type SaasHandlers = ReturnType<typeof createSaasHandlers>;
