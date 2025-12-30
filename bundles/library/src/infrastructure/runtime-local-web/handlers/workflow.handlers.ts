/**
 * Runtime-local Workflow handlers
 *
 * Database-backed handlers for the workflow-system template.
 */
import type { DatabasePort, DbRow } from '@contractspec/lib.runtime-sandbox';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { generateId } from '../utils/id';

// ============ Types ============

export interface WorkflowDefinition {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'APPROVAL' | 'SEQUENTIAL' | 'PARALLEL';
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  definitionId: string;
  name: string;
  description?: string;
  stepOrder: number;
  type: 'APPROVAL' | 'TASK' | 'NOTIFICATION';
  requiredRoles: string[];
  autoApproveCondition?: string;
  timeoutHours?: number;
  createdAt: Date;
}

export interface WorkflowInstance {
  id: string;
  projectId: string;
  definitionId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  currentStepId?: string;
  data?: Record<string, unknown>;
  requestedBy: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface WorkflowApproval {
  id: string;
  instanceId: string;
  stepId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED';
  actorId?: string;
  comment?: string;
  decidedAt?: Date;
  createdAt: Date;
}

export interface CreateWorkflowDefinitionInput {
  name: string;
  description?: string;
  type?: 'APPROVAL' | 'SEQUENTIAL' | 'PARALLEL';
}

export interface AddWorkflowStepInput {
  definitionId: string;
  name: string;
  description?: string;
  type?: 'APPROVAL' | 'TASK' | 'NOTIFICATION';
  requiredRoles: string[];
  autoApproveCondition?: string;
  timeoutHours?: number;
}

export interface StartWorkflowInput {
  definitionId: string;
  data?: Record<string, unknown>;
}

export interface ApproveStepInput {
  instanceId: string;
  comment?: string;
}

export interface RejectStepInput {
  instanceId: string;
  reason: string;
}

export interface ListWorkflowDefinitionsInput {
  projectId: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListWorkflowDefinitionsOutput {
  definitions: WorkflowDefinition[];
  total: number;
}

export interface ListWorkflowInstancesInput {
  projectId: string;
  definitionId?: string;
  status?:
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'all';
  requestedBy?: string;
  limit?: number;
  offset?: number;
}

export interface ListWorkflowInstancesOutput {
  instances: WorkflowInstance[];
  total: number;
}

// ============ Row Types ============

interface WorkflowDefinitionRow {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStepRow {
  id: string;
  definitionId: string;
  name: string;
  description: string | null;
  stepOrder: number;
  type: string;
  requiredRoles: string | null;
  autoApproveCondition: string | null;
  timeoutHours: number | null;
  createdAt: string;
}

interface WorkflowInstanceRow {
  id: string;
  projectId: string;
  definitionId: string;
  status: string;
  currentStepId: string | null;
  data: string | null;
  requestedBy: string;
  startedAt: string;
  completedAt: string | null;
}

interface WorkflowApprovalRow {
  id: string;
  instanceId: string;
  stepId: string;
  status: string;
  actorId: string | null;
  comment: string | null;
  decidedAt: string | null;
  createdAt: string;
}

function rowToDefinition(row: WorkflowDefinitionRow): WorkflowDefinition {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    type: row.type as WorkflowDefinition['type'],
    status: row.status as WorkflowDefinition['status'],
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToStep(row: WorkflowStepRow): WorkflowStep {
  return {
    id: row.id,
    definitionId: row.definitionId,
    name: row.name,
    description: row.description ?? undefined,
    stepOrder: row.stepOrder,
    type: row.type as WorkflowStep['type'],
    requiredRoles: row.requiredRoles ? JSON.parse(row.requiredRoles) : [],
    autoApproveCondition: row.autoApproveCondition ?? undefined,
    timeoutHours: row.timeoutHours ?? undefined,
    createdAt: new Date(row.createdAt),
  };
}

function rowToInstance(row: WorkflowInstanceRow): WorkflowInstance {
  return {
    id: row.id,
    projectId: row.projectId,
    definitionId: row.definitionId,
    status: row.status as WorkflowInstance['status'],
    currentStepId: row.currentStepId ?? undefined,
    data: row.data ? JSON.parse(row.data) : undefined,
    requestedBy: row.requestedBy,
    startedAt: new Date(row.startedAt),
    completedAt: row.completedAt ? new Date(row.completedAt) : undefined,
  };
}

function rowToApproval(row: WorkflowApprovalRow): WorkflowApproval {
  return {
    id: row.id,
    instanceId: row.instanceId,
    stepId: row.stepId,
    status: row.status as WorkflowApproval['status'],
    actorId: row.actorId ?? undefined,
    comment: row.comment ?? undefined,
    decidedAt: row.decidedAt ? new Date(row.decidedAt) : undefined,
    createdAt: new Date(row.createdAt),
  };
}

// ============ Handler Factory ============

export function createWorkflowHandlers(db: DatabasePort) {
  /**
   * List workflow definitions
   */
  async function listDefinitions(
    input: ListWorkflowDefinitionsInput
  ): Promise<ListWorkflowDefinitionsOutput> {
    const { projectId, status, search, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM workflow_definition ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM workflow_definition ${whereClause} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as WorkflowDefinitionRow[];

    return {
      definitions: rows.map(rowToDefinition),
      total,
    };
  }

  /**
   * Create a workflow definition
   */
  async function createDefinition(
    input: CreateWorkflowDefinitionInput,
    context: { projectId: string; organizationId: string }
  ): Promise<WorkflowDefinition> {
    const id = generateId('wfdef');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO workflow_definition (id, projectId, organizationId, name, description, type, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.description ?? null,
        input.type ?? 'APPROVAL',
        'DRAFT',
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM workflow_definition WHERE id = ?`, [id])
    ).rows as unknown as WorkflowDefinitionRow[];

    return rowToDefinition(rows[0]!);
  }

  /**
   * Add a step to a workflow definition
   */
  async function addStep(input: AddWorkflowStepInput): Promise<WorkflowStep> {
    const id = generateId('wfstep');
    const now = new Date().toISOString();

    // Get current max order
    const maxOrderResult = (
      await db.query(
        `SELECT MAX(stepOrder) as maxOrder FROM workflow_step WHERE definitionId = ?`,
        [input.definitionId]
      )
    ).rows as DbRow[];
    const nextOrder = ((maxOrderResult[0]?.maxOrder as number) ?? 0) + 1;

    await db.execute(
      `INSERT INTO workflow_step (id, definitionId, name, description, stepOrder, type, requiredRoles, autoApproveCondition, timeoutHours, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.definitionId,
        input.name,
        input.description ?? null,
        nextOrder,
        input.type ?? 'APPROVAL',
        JSON.stringify(input.requiredRoles),
        input.autoApproveCondition ?? null,
        input.timeoutHours ?? null,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM workflow_step WHERE id = ?`, [id])
    ).rows as unknown as WorkflowStepRow[];

    return rowToStep(rows[0]!);
  }

  /**
   * Get steps for a workflow definition
   */
  async function getSteps(definitionId: string): Promise<WorkflowStep[]> {
    const rows = (
      await db.query(
        `SELECT * FROM workflow_step WHERE definitionId = ? ORDER BY stepOrder`,
        [definitionId]
      )
    ).rows as unknown as WorkflowStepRow[];

    return rows.map(rowToStep);
  }

  /**
   * List workflow instances
   */
  async function listInstances(
    input: ListWorkflowInstancesInput
  ): Promise<ListWorkflowInstancesOutput> {
    const {
      projectId,
      definitionId,
      status,
      requestedBy,
      limit = 20,
      offset = 0,
    } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (definitionId) {
      whereClause += ' AND definitionId = ?';
      params.push(definitionId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (requestedBy) {
      whereClause += ' AND requestedBy = ?';
      params.push(requestedBy);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM workflow_instance ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM workflow_instance ${whereClause} ORDER BY startedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as WorkflowInstanceRow[];

    return {
      instances: rows.map(rowToInstance),
      total,
    };
  }

  /**
   * Start a workflow instance
   */
  async function startInstance(
    input: StartWorkflowInput,
    context: { projectId: string; requestedBy: string }
  ): Promise<WorkflowInstance> {
    const id = generateId('wfinst');
    const now = new Date().toISOString();

    // Get first step
    const steps = (
      await db.query(
        `SELECT * FROM workflow_step WHERE definitionId = ? ORDER BY stepOrder LIMIT 1`,
        [input.definitionId]
      )
    ).rows as unknown as WorkflowStepRow[];

    const firstStepId = steps[0]?.id ?? null;

    await db.execute(
      `INSERT INTO workflow_instance (id, projectId, definitionId, status, currentStepId, data, requestedBy, startedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        input.definitionId,
        firstStepId ? 'IN_PROGRESS' : 'PENDING',
        firstStepId,
        input.data ? JSON.stringify(input.data) : null,
        context.requestedBy,
        now,
      ]
    );

    // Create first approval if there's a step
    if (firstStepId) {
      await db.execute(
        `INSERT INTO workflow_approval (id, instanceId, stepId, status, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [generateId('wfappr'), id, firstStepId, 'PENDING', now]
      );
    }

    const rows = (
      await db.query(`SELECT * FROM workflow_instance WHERE id = ?`, [id])
    ).rows as unknown as WorkflowInstanceRow[];

    return rowToInstance(rows[0]!);
  }

  /**
   * Approve current step
   */
  async function approveStep(
    input: ApproveStepInput,
    context: { actorId: string }
  ): Promise<WorkflowInstance> {
    const now = new Date().toISOString();

    // Get instance
    const instances = (
      await db.query(`SELECT * FROM workflow_instance WHERE id = ?`, [
        input.instanceId,
      ])
    ).rows as unknown as WorkflowInstanceRow[];

    if (!instances[0]) {
      throw new Error('NOT_FOUND');
    }

    const instance = instances[0];

    // Update current approval
    await db.execute(
      `UPDATE workflow_approval SET status = 'APPROVED', actorId = ?, comment = ?, decidedAt = ? 
       WHERE instanceId = ? AND stepId = ? AND status = 'PENDING'`,
      [
        context.actorId,
        input.comment ?? null,
        now,
        input.instanceId,
        instance.currentStepId,
      ]
    );

    // Get next step
    const currentStep = (
      await db.query(`SELECT * FROM workflow_step WHERE id = ?`, [
        instance.currentStepId,
      ])
    ).rows as unknown as WorkflowStepRow[];

    const nextSteps = (
      await db.query(
        `SELECT * FROM workflow_step WHERE definitionId = ? AND stepOrder > ? ORDER BY stepOrder LIMIT 1`,
        [instance.definitionId, currentStep[0]?.stepOrder ?? 0]
      )
    ).rows as unknown as WorkflowStepRow[];

    if (nextSteps[0]) {
      // Move to next step
      await db.execute(
        `UPDATE workflow_instance SET currentStepId = ? WHERE id = ?`,
        [nextSteps[0].id, input.instanceId]
      );

      // Create approval for next step
      await db.execute(
        `INSERT INTO workflow_approval (id, instanceId, stepId, status, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          generateId('wfappr'),
          input.instanceId,
          nextSteps[0].id,
          'PENDING',
          now,
        ]
      );
    } else {
      // Complete workflow
      await db.execute(
        `UPDATE workflow_instance SET status = 'COMPLETED', currentStepId = NULL, completedAt = ? WHERE id = ?`,
        [now, input.instanceId]
      );
    }

    const updated = (
      await db.query(`SELECT * FROM workflow_instance WHERE id = ?`, [
        input.instanceId,
      ])
    ).rows as unknown as WorkflowInstanceRow[];

    return rowToInstance(updated[0]!);
  }

  /**
   * Reject current step
   */
  async function rejectStep(
    input: RejectStepInput,
    context: { actorId: string }
  ): Promise<WorkflowInstance> {
    const now = new Date().toISOString();

    // Get instance
    const instances = (
      await db.query(`SELECT * FROM workflow_instance WHERE id = ?`, [
        input.instanceId,
      ])
    ).rows as unknown as WorkflowInstanceRow[];

    if (!instances[0]) {
      throw new Error('NOT_FOUND');
    }

    // Update current approval
    await db.execute(
      `UPDATE workflow_approval SET status = 'REJECTED', actorId = ?, comment = ?, decidedAt = ? 
       WHERE instanceId = ? AND stepId = ? AND status = 'PENDING'`,
      [
        context.actorId,
        input.reason,
        now,
        input.instanceId,
        instances[0].currentStepId,
      ]
    );

    // Reject workflow
    await db.execute(
      `UPDATE workflow_instance SET status = 'REJECTED', completedAt = ? WHERE id = ?`,
      [now, input.instanceId]
    );

    const updated = (
      await db.query(`SELECT * FROM workflow_instance WHERE id = ?`, [
        input.instanceId,
      ])
    ).rows as unknown as WorkflowInstanceRow[];

    return rowToInstance(updated[0]!);
  }

  /**
   * Get approvals for an instance
   */
  async function getApprovals(instanceId: string): Promise<WorkflowApproval[]> {
    const rows = (
      await db.query(
        `SELECT * FROM workflow_approval WHERE instanceId = ? ORDER BY createdAt`,
        [instanceId]
      )
    ).rows as unknown as WorkflowApprovalRow[];

    return rows.map(rowToApproval);
  }

  return {
    listDefinitions,
    createDefinition,
    addStep,
    getSteps,
    listInstances,
    startInstance,
    approveStep,
    rejectStep,
    getApprovals,
  };
}

export type WorkflowHandlers = ReturnType<typeof createWorkflowHandlers>;
