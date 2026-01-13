/**
 * Runtime-local CRM handlers
 *
 * These handlers work with the in-browser SQLite database
 * instead of in-memory mock arrays.
 */
import type { DatabasePort, DbRow } from '@contractspec/lib.runtime-sandbox';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { web } from '@contractspec/lib.runtime-sandbox';
const { generateId } = web;

// ============ Types ============

export interface Deal {
  id: string;
  projectId: string;
  name: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: 'OPEN' | 'WON' | 'LOST' | 'STALE';
  contactId?: string;
  companyId?: string;
  ownerId: string;
  expectedCloseDate?: Date;
  wonSource?: string;
  lostReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stage {
  id: string;
  pipelineId: string;
  name: string;
  position: number;
}

export interface CreateDealInput {
  name: string;
  value: number;
  currency?: string;
  pipelineId: string;
  stageId: string;
  contactId?: string;
  companyId?: string;
  expectedCloseDate?: Date;
}

export interface MoveDealInput {
  dealId: string;
  stageId: string;
}

export interface WinDealInput {
  dealId: string;
  wonSource?: string;
  notes?: string;
}

export interface LoseDealInput {
  dealId: string;
  lostReason: string;
  notes?: string;
}

export interface ListDealsInput {
  projectId: string;
  pipelineId?: string;
  stageId?: string;
  status?: 'OPEN' | 'WON' | 'LOST' | 'all';
  ownerId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListDealsOutput {
  deals: Deal[];
  total: number;
  totalValue: number;
}

// ============ Row Type ============

// Note: We don't use DbRow generics here - just cast the results
// to the expected types since we know the schema

interface DealRow {
  id: string;
  projectId: string;
  name: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: string;
  contactId: string | null;
  companyId: string | null;
  ownerId: string;
  expectedCloseDate: string | null;
  wonSource: string | null;
  lostReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StageRow {
  id: string;
  pipelineId: string;
  name: string;
  position: number;
}

function rowToDeal(row: DealRow): Deal {
  return {
    id: row.id,
    projectId: row.projectId,
    name: row.name,
    value: row.value,
    currency: row.currency,
    pipelineId: row.pipelineId,
    stageId: row.stageId,
    status: row.status as Deal['status'],
    contactId: row.contactId ?? undefined,
    companyId: row.companyId ?? undefined,
    ownerId: row.ownerId,
    expectedCloseDate: row.expectedCloseDate
      ? new Date(row.expectedCloseDate)
      : undefined,
    wonSource: row.wonSource ?? undefined,
    lostReason: row.lostReason ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// ============ Handler Factory ============

export function createCrmHandlers(db: DatabasePort) {
  /**
   * List deals with filtering
   */
  async function listDeals(input: ListDealsInput): Promise<ListDealsOutput> {
    const {
      projectId,
      pipelineId,
      stageId,
      status,
      ownerId,
      search,
      limit = 20,
      offset = 0,
    } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (pipelineId) {
      whereClause += ' AND pipelineId = ?';
      params.push(pipelineId);
    }

    if (stageId) {
      whereClause += ' AND stageId = ?';
      params.push(stageId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (ownerId) {
      whereClause += ' AND ownerId = ?';
      params.push(ownerId);
    }

    if (search) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get total count
    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM crm_deal ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    // Get total value
    const valueResult = (
      await db.query(
        `SELECT COALESCE(SUM(value), 0) as total FROM crm_deal ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const totalValue = (valueResult[0]?.total as number) ?? 0;

    // Get paginated deals
    const dealRows = (
      await db.query(
        `SELECT * FROM crm_deal ${whereClause} ORDER BY value DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as DealRow[];

    return {
      deals: dealRows.map(rowToDeal),
      total,
      totalValue,
    };
  }

  /**
   * Create a new deal
   */
  async function createDeal(
    input: CreateDealInput,
    context: { projectId: string; ownerId: string }
  ): Promise<Deal> {
    const id = generateId('deal');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO crm_deal (id, projectId, pipelineId, stageId, name, value, currency, status, contactId, companyId, ownerId, expectedCloseDate, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        input.pipelineId,
        input.stageId,
        input.name,
        input.value,
        input.currency ?? 'USD',
        'OPEN',
        input.contactId ?? null,
        input.companyId ?? null,
        context.ownerId,
        input.expectedCloseDate?.toISOString() ?? null,
        now,
        now,
      ]
    );

    const rows = (await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [id]))
      .rows as unknown as DealRow[];

    if (!rows[0]) {
      throw new Error('Failed to create deal');
    }

    return rowToDeal(rows[0]);
  }

  /**
   * Move a deal to a different stage
   */
  async function moveDeal(input: MoveDealInput): Promise<Deal> {
    const now = new Date().toISOString();

    // Verify deal exists
    const existing = (
      await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [input.dealId])
    ).rows as unknown as DealRow[];

    if (!existing[0]) {
      throw new Error('NOT_FOUND');
    }

    // Verify stage exists
    const stage = (
      await db.query(`SELECT * FROM crm_stage WHERE id = ?`, [input.stageId])
    ).rows as unknown as StageRow[];

    if (!stage[0]) {
      throw new Error('INVALID_STAGE');
    }

    await db.execute(
      `UPDATE crm_deal SET stageId = ?, updatedAt = ? WHERE id = ?`,
      [input.stageId, now, input.dealId]
    );

    const rows = (
      await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [input.dealId])
    ).rows as unknown as DealRow[];

    return rowToDeal(rows[0]!);
  }

  /**
   * Mark a deal as won
   */
  async function winDeal(input: WinDealInput): Promise<Deal> {
    const now = new Date().toISOString();

    // Verify deal exists
    const existing = (
      await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [input.dealId])
    ).rows as unknown as DealRow[];

    if (!existing[0]) {
      throw new Error('NOT_FOUND');
    }

    await db.execute(
      `UPDATE crm_deal SET status = 'WON', wonSource = ?, notes = ?, updatedAt = ? WHERE id = ?`,
      [input.wonSource ?? null, input.notes ?? null, now, input.dealId]
    );

    const rows = (
      await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [input.dealId])
    ).rows as unknown as DealRow[];

    return rowToDeal(rows[0]!);
  }

  /**
   * Mark a deal as lost
   */
  async function loseDeal(input: LoseDealInput): Promise<Deal> {
    const now = new Date().toISOString();

    // Verify deal exists
    const existing = (
      await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [input.dealId])
    ).rows as unknown as DealRow[];

    if (!existing[0]) {
      throw new Error('NOT_FOUND');
    }

    await db.execute(
      `UPDATE crm_deal SET status = 'LOST', lostReason = ?, notes = ?, updatedAt = ? WHERE id = ?`,
      [input.lostReason, input.notes ?? null, now, input.dealId]
    );

    const rows = (
      await db.query(`SELECT * FROM crm_deal WHERE id = ?`, [input.dealId])
    ).rows as unknown as DealRow[];

    return rowToDeal(rows[0]!);
  }

  /**
   * Get deals grouped by stage
   */
  async function getDealsByStage(input: {
    projectId: string;
    pipelineId: string;
  }): Promise<Record<string, Deal[]>> {
    const deals = (
      await db.query(
        `SELECT * FROM crm_deal WHERE projectId = ? AND pipelineId = ? AND status = 'OPEN' ORDER BY value DESC`,
        [input.projectId, input.pipelineId]
      )
    ).rows as unknown as DealRow[];

    const stages = (
      await db.query(
        `SELECT * FROM crm_stage WHERE pipelineId = ? ORDER BY position`,
        [input.pipelineId]
      )
    ).rows as unknown as StageRow[];

    const grouped: Record<string, Deal[]> = {};
    for (const stage of stages) {
      grouped[stage.id] = deals
        .filter((d) => d.stageId === stage.id)
        .map(rowToDeal);
    }

    return grouped;
  }

  /**
   * Get pipeline stages
   */
  async function getPipelineStages(input: {
    pipelineId: string;
  }): Promise<Stage[]> {
    const rows = (
      await db.query(
        `SELECT * FROM crm_stage WHERE pipelineId = ? ORDER BY position`,
        [input.pipelineId]
      )
    ).rows as unknown as StageRow[];

    return rows.map((row) => ({
      id: row.id,
      pipelineId: row.pipelineId,
      name: row.name,
      position: row.position,
    }));
  }

  return {
    listDeals,
    createDeal,
    moveDeal,
    winDeal,
    loseDeal,
    getDealsByStage,
    getPipelineStages,
  };
}

export type CrmHandlers = ReturnType<typeof createCrmHandlers>;
