/**
 * Workflow instance handlers.
 */

import type {
  StateMachineState,
  TransitionContext,
} from '../state-machine';
import {
  createStateMachineEngine,
  buildStateMachineDefinition,
} from '../state-machine';
import type {
  WorkflowInstanceRecord,
  WorkflowStepRecord,
  HandlerContext,
} from '../shared/types';
import { mockDataStore } from '../shared/mock-data';
import { createApprovalRequests } from '../approval/approval.handler';

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
  const workflow = Array.from(mockDataStore.workflows.values()).find(
    (w) =>
      w.key === input.workflowKey &&
      w.status === 'ACTIVE' &&
      w.organizationId === context.organizationId
  );

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
): Promise<{
  success: boolean;
  instance: WorkflowInstanceRecord;
  previousStepKey?: string;
  currentStepKey?: string;
  message?: string;
}> {
  const instance = mockDataStore.instances.get(input.instanceId);
  if (!instance) {
    throw new Error(`Instance ${input.instanceId} not found`);
  }

  const workflow = mockDataStore.workflows.get(instance.workflowDefinitionId);
  if (!workflow) {
    throw new Error(`Workflow ${instance.workflowDefinitionId} not found`);
  }

  // Get all steps for this workflow
  const steps = Array.from(mockDataStore.steps.values()).filter(
    (s) => s.workflowDefinitionId === workflow.id
  );

  // Build state machine
  const definition = buildStateMachineDefinition(
    {
      key: workflow.key,
      name: workflow.name,
      version: workflow.version,
      initialStepId: workflow.initialStepId ?? null,
    },
    steps
  );
  const currentStep = steps.find((s) => s.id === instance.currentStepId);

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
  const result = engine.transition(
    definition,
    state,
    input.action,
    transitionContext
  );

  if (!result.success) {
    return {
      success: false,
      instance,
      message: result.error,
    };
  }

  // Update instance
  const previousStepKey = currentStep?.key;
  const newStep = steps.find((s) => s.key === result.currentStepKey);

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


