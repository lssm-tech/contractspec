/**
 * Workflow System Handlers
 * 
 * These are reference handler implementations that demonstrate
 * how to handle workflow system contracts. In production, these
 * would be adapted to specific infrastructure.
 */

import type { StateMachineDefinition, StateMachineState, TransitionContext } from '../state-machine';
import { createStateMachineEngine, buildStateMachineDefinition, createInitialState } from '../state-machine';

// ============ Types ============

export interface WorkflowDefinitionRecord {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED';
  triggerType: 'MANUAL' | 'EVENT' | 'SCHEDULED' | 'API';
  initialStepId?: string;
  featureFlagKey?: string;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface WorkflowStepRecord {
  id: string;
  workflowDefinitionId: string;
  key: string;
  name: string;
  description?: string;
  type: 'START' | 'APPROVAL' | 'TASK' | 'CONDITION' | 'PARALLEL' | 'WAIT' | 'ACTION' | 'END';
  position: number;
  transitions: Record<string, string>;
  approvalMode?: 'ANY' | 'ALL' | 'MAJORITY' | 'SEQUENTIAL';
  approverRoles: string[];
  timeoutSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInstanceRecord {
  id: string;
  workflowDefinitionId: string;
  referenceId?: string;
  referenceType?: string;
  status: 'PENDING' | 'RUNNING' | 'WAITING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'TIMEOUT';
  currentStepId?: string;
  contextData: Record<string, unknown>;
  triggeredBy: string;
  organizationId: string;
  priority: number;
  dueAt?: Date;
  outcome?: string;
  resultData?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ApprovalRequestRecord {
  id: string;
  workflowInstanceId: string;
  stepExecutionId: string;
  approverId: string;
  approverRole?: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED' | 'ESCALATED' | 'WITHDRAWN' | 'EXPIRED';
  decision?: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'DELEGATE' | 'ABSTAIN';
  decisionComment?: string;
  decidedAt?: Date;
  dueAt?: Date;
  contextSnapshot?: Record<string, unknown>;
  sequenceOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Handler Context ============

export interface HandlerContext {
  userId: string;
  userRoles: string[];
  organizationId: string;
}

// ============ Mock Data Store ============

/**
 * In-memory store for demo purposes.
 * In production, this would be backed by a database.
 */
export const mockDataStore = {
  workflows: new Map<string, WorkflowDefinitionRecord>(),
  steps: new Map<string, WorkflowStepRecord>(),
  instances: new Map<string, WorkflowInstanceRecord>(),
  approvals: new Map<string, ApprovalRequestRecord>(),
  stepExecutions: new Map<string, { id: string; instanceId: string; stepId: string; status: string }>(),
};

// ============ Workflow Definition Handlers ============

export async function handleCreateWorkflow(
  input: {
    name: string;
    key: string;
    description?: string;
    triggerType?: 'MANUAL' | 'EVENT' | 'SCHEDULED' | 'API';
    featureFlagKey?: string;
  },
  context: HandlerContext
): Promise<WorkflowDefinitionRecord> {
  const id = `wf_${Date.now()}`;
  const now = new Date();

  const workflow: WorkflowDefinitionRecord = {
    id,
    key: input.key,
    name: input.name,
    description: input.description,
    version: 1,
    status: 'DRAFT',
    triggerType: input.triggerType ?? 'MANUAL',
    featureFlagKey: input.featureFlagKey,
    organizationId: context.organizationId,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
  };

  mockDataStore.workflows.set(id, workflow);
  return workflow;
}

export async function handleAddStep(
  input: {
    workflowId: string;
    key: string;
    name: string;
    description?: string;
    type: 'START' | 'APPROVAL' | 'TASK' | 'CONDITION' | 'PARALLEL' | 'WAIT' | 'ACTION' | 'END';
    position?: number;
    transitions: Record<string, string>;
    approvalMode?: 'ANY' | 'ALL' | 'MAJORITY' | 'SEQUENTIAL';
    approverRoles?: string[];
    timeoutSeconds?: number;
  },
  _context: HandlerContext
): Promise<WorkflowStepRecord> {
  const id = `step_${Date.now()}`;
  const now = new Date();

  // Calculate position
  const existingSteps = Array.from(mockDataStore.steps.values())
    .filter(s => s.workflowDefinitionId === input.workflowId);
  const position = input.position ?? existingSteps.length;

  const step: WorkflowStepRecord = {
    id,
    workflowDefinitionId: input.workflowId,
    key: input.key,
    name: input.name,
    description: input.description,
    type: input.type,
    position,
    transitions: input.transitions,
    approvalMode: input.approvalMode,
    approverRoles: input.approverRoles ?? [],
    timeoutSeconds: input.timeoutSeconds,
    createdAt: now,
    updatedAt: now,
  };

  mockDataStore.steps.set(id, step);

  // Update workflow with initial step if this is the first step
  if (existingSteps.length === 0 || input.type === 'START') {
    const workflow = mockDataStore.workflows.get(input.workflowId);
    if (workflow) {
      workflow.initialStepId = id;
      workflow.updatedAt = now;
    }
  }

  return step;
}

export async function handlePublishWorkflow(
  input: { workflowId: string },
  _context: HandlerContext
): Promise<WorkflowDefinitionRecord> {
  const workflow = mockDataStore.workflows.get(input.workflowId);
  if (!workflow) {
    throw new Error(`Workflow ${input.workflowId} not found`);
  }

  const now = new Date();
  workflow.status = 'ACTIVE';
  workflow.publishedAt = now;
  workflow.updatedAt = now;

  return workflow;
}

// ============ Workflow Instance Handlers ============

export async function handleStartWorkflow(
  input: {
    workflowKey: string;
    contextData?: Record<string, unknown>;
    referenceId?: string;
    referenceType?: string;
    priority?: number;
    dueAt?: Date;
  },
  context: HandlerContext
): Promise<WorkflowInstanceRecord> {
  // Find active workflow by key
  const workflow = Array.from(mockDataStore.workflows.values())
    .find(w => w.key === input.workflowKey && w.status === 'ACTIVE' && w.organizationId === context.organizationId);

  if (!workflow) {
    throw new Error(`Active workflow ${input.workflowKey} not found`);
  }

  const id = `inst_${Date.now()}`;
  const now = new Date();

  const instance: WorkflowInstanceRecord = {
    id,
    workflowDefinitionId: workflow.id,
    referenceId: input.referenceId,
    referenceType: input.referenceType,
    status: 'RUNNING',
    currentStepId: workflow.initialStepId,
    contextData: input.contextData ?? {},
    triggeredBy: context.userId,
    organizationId: context.organizationId,
    priority: input.priority ?? 0,
    dueAt: input.dueAt,
    createdAt: now,
    updatedAt: now,
    startedAt: now,
  };

  mockDataStore.instances.set(id, instance);

  // Check if first step is an approval step
  if (workflow.initialStepId) {
    const firstStep = mockDataStore.steps.get(workflow.initialStepId);
    if (firstStep?.type === 'APPROVAL') {
      instance.status = 'WAITING';
      // Create approval requests for approvers
      await createApprovalRequests(instance, firstStep, context);
    }
  }

  return instance;
}

export async function handleTransitionWorkflow(
  input: {
    instanceId: string;
    action: string;
    data?: Record<string, unknown>;
    comment?: string;
  },
  context: HandlerContext
): Promise<{ success: boolean; instance: WorkflowInstanceRecord; previousStepKey?: string; currentStepKey?: string; message?: string }> {
  const instance = mockDataStore.instances.get(input.instanceId);
  if (!instance) {
    throw new Error(`Instance ${input.instanceId} not found`);
  }

  const workflow = mockDataStore.workflows.get(instance.workflowDefinitionId);
  if (!workflow) {
    throw new Error(`Workflow ${instance.workflowDefinitionId} not found`);
  }

  // Get all steps for this workflow
  const steps = Array.from(mockDataStore.steps.values())
    .filter(s => s.workflowDefinitionId === workflow.id);

  // Build state machine
  const definition = buildStateMachineDefinition(workflow, steps);
  const currentStep = steps.find(s => s.id === instance.currentStepId);
  
  const state: StateMachineState = {
    currentStepKey: currentStep?.key ?? '',
    status: instance.status,
    contextData: instance.contextData,
    history: [],
  };

  const transitionContext: TransitionContext = {
    userId: context.userId,
    userRoles: context.userRoles,
    data: input.data,
  };

  const engine = createStateMachineEngine();
  const result = engine.transition(definition, state, input.action, transitionContext);

  if (!result.success) {
    return {
      success: false,
      instance,
      message: result.error,
    };
  }

  // Update instance
  const previousStepKey = currentStep?.key;
  const newStep = steps.find(s => s.key === result.currentStepKey);
  
  instance.currentStepId = newStep?.id;
  instance.status = result.status;
  instance.contextData = { ...instance.contextData, ...input.data };
  instance.updatedAt = new Date();

  if (result.status === 'COMPLETED') {
    instance.completedAt = new Date();
    instance.outcome = input.action;
  }

  // Handle approval steps
  if (newStep?.type === 'APPROVAL') {
    instance.status = 'WAITING';
    await createApprovalRequests(instance, newStep, context);
  }

  return {
    success: true,
    instance,
    previousStepKey,
    currentStepKey: result.currentStepKey ?? undefined,
  };
}

// ============ Approval Handlers ============

async function createApprovalRequests(
  instance: WorkflowInstanceRecord,
  step: WorkflowStepRecord,
  _context: HandlerContext
): Promise<void> {
  const now = new Date();

  // Create approval request for each approver role
  // In production, this would resolve roles to actual users
  for (let i = 0; i < step.approverRoles.length; i++) {
    const role = step.approverRoles[i];
    const id = `approval_${Date.now()}_${i}`;

    const request: ApprovalRequestRecord = {
      id,
      workflowInstanceId: instance.id,
      stepExecutionId: `exec_${instance.id}_${step.id}`,
      approverId: `user_${role}`, // In production, resolve to actual user
      approverRole: role,
      title: `Approval required for ${step.name}`,
      description: step.description,
      status: 'PENDING',
      contextSnapshot: instance.contextData,
      sequenceOrder: i,
      createdAt: now,
      updatedAt: now,
    };

    mockDataStore.approvals.set(id, request);
  }
}

export async function handleSubmitDecision(
  input: {
    requestId: string;
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | 'DELEGATE' | 'ABSTAIN';
    comment?: string;
    data?: Record<string, unknown>;
  },
  context: HandlerContext
): Promise<ApprovalRequestRecord> {
  const request = mockDataStore.approvals.get(input.requestId);
  if (!request) {
    throw new Error(`Approval request ${input.requestId} not found`);
  }

  // Verify approver
  if (request.approverId !== context.userId && !context.userRoles.includes(request.approverRole ?? '')) {
    throw new Error('User is not authorized to make this decision');
  }

  const now = new Date();
  request.decision = input.decision;
  request.decisionComment = input.comment;
  request.decidedAt = now;
  request.updatedAt = now;

  if (input.decision === 'APPROVE') {
    request.status = 'APPROVED';
    // Trigger workflow transition
    await handleTransitionWorkflow(
      {
        instanceId: request.workflowInstanceId,
        action: 'approve',
        data: input.data,
        comment: input.comment,
      },
      context
    );
  } else if (input.decision === 'REJECT') {
    request.status = 'REJECTED';
    await handleTransitionWorkflow(
      {
        instanceId: request.workflowInstanceId,
        action: 'reject',
        data: input.data,
        comment: input.comment,
      },
      context
    );
  }

  return request;
}

export async function handleListMyApprovals(
  input: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELEGATED' | 'ESCALATED' | 'WITHDRAWN' | 'EXPIRED';
    limit?: number;
    offset?: number;
  },
  context: HandlerContext
): Promise<{ requests: ApprovalRequestRecord[]; total: number; pendingCount: number }> {
  let requests = Array.from(mockDataStore.approvals.values())
    .filter(r => r.approverId === context.userId || context.userRoles.includes(r.approverRole ?? ''));

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  if (input.status) {
    requests = requests.filter(r => r.status === input.status);
  }

  const total = requests.length;
  const offset = input.offset ?? 0;
  const limit = input.limit ?? 20;

  requests = requests
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(offset, offset + limit);

  return { requests, total, pendingCount };
}

