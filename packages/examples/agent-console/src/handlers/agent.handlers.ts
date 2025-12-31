/**
 * Runtime-local Agent Console handlers
 *
 * Database-backed handlers for agent management and runs.
 */
import type { DatabasePort } from '@contractspec/lib.runtime-sandbox';
import { web } from '@contractspec/lib.runtime-sandbox';
const { generateId } = web;

// ============ Types ============

export interface Agent {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  modelProvider: string;
  modelName: string;
  systemPrompt?: string;
  temperature: number;
  maxTokens: number;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Tool {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  version: string;
  category:
    | 'RETRIEVAL'
    | 'COMPUTATION'
    | 'COMMUNICATION'
    | 'INTEGRATION'
    | 'UTILITY'
    | 'CUSTOM';
  status: 'ACTIVE' | 'DISABLED' | 'DEPRECATED' | 'DRAFT';
  inputSchema?: string;
  outputSchema?: string;
  endpoint?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Run {
  id: string;
  projectId: string;
  agentId: string;
  agentName?: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  input?: string;
  output?: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  durationMs?: number;
  errorMessage?: string;
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface RunMetrics {
  totalRuns: number;
  successRate: number;
  averageDurationMs: number;
  totalTokens: number;
  totalCostUsd: number;
}

export interface ListAgentsInput {
  projectId: string;
  organizationId?: string;
  status?: Agent['status'] | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListAgentsOutput {
  items: Agent[];
  total: number;
  hasMore: boolean;
}

export interface ListToolsInput {
  projectId: string;
  organizationId?: string;
  category?: Tool['category'] | 'all';
  status?: Tool['status'] | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListToolsOutput {
  items: Tool[];
  total: number;
  hasMore: boolean;
}

export interface ListRunsInput {
  projectId: string;
  organizationId?: string;
  agentId?: string;
  status?: Run['status'] | 'all';
  limit?: number;
  offset?: number;
}

export interface ListRunsOutput {
  items: Run[];
  total: number;
  hasMore: boolean;
}

export interface CreateAgentInput {
  name: string;
  description?: string;
  modelProvider?: string;
  modelName?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface UpdateAgentInput {
  id: string;
  name?: string;
  description?: string;
  status?: Agent['status'];
}

// ============ Row Types ============

interface AgentRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  modelProvider: string;
  modelName: string;
  systemPrompt: string | null;
  temperature: number;
  maxTokens: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ToolRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  version: string;
  category: string;
  status: string;
  inputSchema: string | null;
  outputSchema: string | null;
  endpoint: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RunRow extends Record<string, unknown> {
  id: string;
  projectId: string;
  agentId: string;
  status: string;
  input: string | null;
  output: string | null;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  durationMs: number | null;
  errorMessage: string | null;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

function rowToAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    modelProvider: row.modelProvider,
    modelName: row.modelName,
    systemPrompt: row.systemPrompt ?? undefined,
    temperature: row.temperature,
    maxTokens: row.maxTokens,
    status: row.status as Agent['status'],
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToTool(row: ToolRow): Tool {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    version: row.version,
    category: row.category as Tool['category'],
    status: row.status as Tool['status'],
    inputSchema: row.inputSchema ?? undefined,
    outputSchema: row.outputSchema ?? undefined,
    endpoint: row.endpoint ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToRun(row: RunRow, agentName?: string): Run {
  return {
    id: row.id,
    projectId: row.projectId,
    agentId: row.agentId,
    agentName,
    status: row.status as Run['status'],
    input: row.input ?? undefined,
    output: row.output ?? undefined,
    totalTokens: row.totalTokens,
    promptTokens: row.promptTokens,
    completionTokens: row.completionTokens,
    estimatedCostUsd: row.estimatedCostUsd,
    durationMs: row.durationMs ?? undefined,
    errorMessage: row.errorMessage ?? undefined,
    queuedAt: new Date(row.queuedAt),
    startedAt: row.startedAt ? new Date(row.startedAt) : undefined,
    completedAt: row.completedAt ? new Date(row.completedAt) : undefined,
  };
}

// ============ Handler Factory ============

export function createAgentHandlers(db: DatabasePort) {
  /**
   * List agents
   */
  async function listAgents(input: ListAgentsInput): Promise<ListAgentsOutput> {
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
        `SELECT COUNT(*) as count FROM agent_definition ${whereClause}`,
        params
      )
    ).rows as unknown as { count: number }[];
    const total = countResult[0]?.count ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM agent_definition ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as AgentRow[];

    return {
      items: rows.map(rowToAgent),
      total,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Get a single agent
   */
  async function getAgent(id: string): Promise<Agent | null> {
    const rows = (
      await db.query(`SELECT * FROM agent_definition WHERE id = ?`, [id])
    ).rows as unknown as AgentRow[];
    return rows[0] ? rowToAgent(rows[0]) : null;
  }

  /**
   * Create an agent
   */
  async function createAgent(
    input: CreateAgentInput,
    context: { projectId: string; organizationId: string }
  ): Promise<Agent> {
    const id = generateId('agent');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO agent_definition (id, projectId, organizationId, name, description, modelProvider, modelName, systemPrompt, temperature, maxTokens, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.description ?? null,
        input.modelProvider ?? 'openai',
        input.modelName ?? 'gpt-4',
        input.systemPrompt ?? null,
        input.temperature ?? 0.7,
        input.maxTokens ?? 4096,
        'DRAFT',
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM agent_definition WHERE id = ?`, [id])
    ).rows as unknown as AgentRow[];

    const row = rows[0];
    if (!row) {
      throw new Error('Failed to retrieve created agent');
    }

    return rowToAgent(row);
  }

  /**
   * Update an agent
   */
  async function updateAgent(input: UpdateAgentInput): Promise<Agent> {
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
      `UPDATE agent_definition SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const rows = (
      await db.query(`SELECT * FROM agent_definition WHERE id = ?`, [input.id])
    ).rows as unknown as AgentRow[];

    if (!rows[0]) {
      throw new Error('NOT_FOUND');
    }

    return rowToAgent(rows[0]);
  }

  /**
   * List tools
   */
  async function listTools(input: ListToolsInput): Promise<ListToolsOutput> {
    const {
      projectId,
      organizationId,
      category,
      status,
      search,
      limit = 50,
      offset = 0,
    } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (organizationId) {
      whereClause += ' AND organizationId = ?';
      params.push(organizationId);
    }

    if (category && category !== 'all') {
      whereClause += ' AND category = ?';
      params.push(category);
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
        `SELECT COUNT(*) as count FROM agent_tool ${whereClause}`,
        params
      )
    ).rows as unknown as { count: number }[];
    const total = countResult[0]?.count ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM agent_tool ${whereClause} ORDER BY name ASC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as ToolRow[];

    return {
      items: rows.map(rowToTool),
      total,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * List runs
   */
  async function listRuns(input: ListRunsInput): Promise<ListRunsOutput> {
    const { projectId, agentId, status, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE r.projectId = ?';
    const params: (string | number)[] = [projectId];

    if (agentId) {
      whereClause += ' AND r.agentId = ?';
      params.push(agentId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM agent_run r ${whereClause}`,
        params
      )
    ).rows as unknown as { count: number }[];
    const total = countResult[0]?.count ?? 0;

    const rows = (
      await db.query(
        `SELECT r.*, a.name as agentName 
       FROM agent_run r 
       LEFT JOIN agent_definition a ON r.agentId = a.id 
       ${whereClause} 
       ORDER BY r.queuedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as (RunRow & { agentName: string })[];

    return {
      items: rows.map((r) => rowToRun(r, r.agentName)),
      total,
      hasMore: offset + rows.length < total,
    };
  }

  /**
   * Get run metrics
   */
  async function getRunMetrics(input: {
    projectId: string;
    agentId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<RunMetrics> {
    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [input.projectId];

    if (input.agentId) {
      whereClause += ' AND agentId = ?';
      params.push(input.agentId);
    }

    if (input.startDate) {
      whereClause += ' AND queuedAt >= ?';
      params.push(input.startDate.toISOString());
    }

    if (input.endDate) {
      whereClause += ' AND queuedAt <= ?';
      params.push(input.endDate.toISOString());
    }

    const result = (
      await db.query(
        `SELECT 
        COUNT(*) as totalRuns,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedRuns,
        AVG(CASE WHEN status = 'COMPLETED' THEN durationMs ELSE NULL END) as avgDuration,
        COALESCE(SUM(totalTokens), 0) as totalTokens,
        COALESCE(SUM(estimatedCostUsd), 0) as totalCost
       FROM agent_run ${whereClause}`,
        params
      )
    ).rows as unknown as {
      totalRuns: number;
      completedRuns: number;
      avgDuration: number | null;
      totalTokens: number;
      totalCost: number;
    }[];

    const data = result[0];
    const totalRuns = data?.totalRuns ?? 0;
    const completedRuns = data?.completedRuns ?? 0;

    return {
      totalRuns,
      successRate: totalRuns > 0 ? completedRuns / totalRuns : 0,
      averageDurationMs: data?.avgDuration ?? 0,
      totalTokens: data?.totalTokens ?? 0,
      totalCostUsd: data?.totalCost ?? 0,
    };
  }

  return {
    listAgents,
    getAgent,
    createAgent,
    updateAgent,
    listTools,
    listRuns,
    getRunMetrics,
  };
}

export type AgentHandlers = ReturnType<typeof createAgentHandlers>;
