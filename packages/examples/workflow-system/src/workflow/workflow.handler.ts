/**
 * Workflow definition handlers.
 */

import type {
  WorkflowDefinitionRecord,
  WorkflowStepRecord,
  HandlerContext,
} from '../shared/types';
import { mockDataStore } from '../shared/mock-data';

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
    type:
      | 'START'
      | 'APPROVAL'
      | 'TASK'
      | 'CONDITION'
      | 'PARALLEL'
      | 'WAIT'
      | 'ACTION'
      | 'END';
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
  const existingSteps = Array.from(mockDataStore.steps.values()).filter(
    (s) => s.workflowDefinitionId === input.workflowId
  );
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


