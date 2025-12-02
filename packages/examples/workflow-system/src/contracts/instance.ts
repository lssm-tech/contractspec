import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['example.workflow-system'] as const;

// ============ Enums ============

const InstanceStatusSchemaEnum = defineEnum('InstanceStatus', [
  'PENDING',
  'RUNNING',
  'WAITING',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
  'FAILED',
  'TIMEOUT',
]);

// ============ Schemas ============

export const WorkflowInstanceModel = defineSchemaModel({
  name: 'WorkflowInstanceModel',
  description: 'A running workflow instance',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowDefinitionId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: InstanceStatusSchemaEnum, isOptional: false },
    currentStepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    contextData: { type: ScalarTypeEnum.JSON(), isOptional: true },
    triggeredBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    outcome: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    resultData: { type: ScalarTypeEnum.JSON(), isOptional: true },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const StartWorkflowInputModel = defineSchemaModel({
  name: 'StartWorkflowInput',
  description: 'Input for starting a workflow',
  fields: {
    workflowKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    contextData: { type: ScalarTypeEnum.JSON(), isOptional: true },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const TransitionInputModel = defineSchemaModel({
  name: 'TransitionInput',
  description: 'Input for transitioning a workflow',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    action: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    data: { type: ScalarTypeEnum.JSON(), isOptional: true },
    comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const TransitionResultModel = defineSchemaModel({
  name: 'TransitionResult',
  description: 'Result of a workflow transition',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    instance: { type: WorkflowInstanceModel, isOptional: false },
    previousStepKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    currentStepKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    message: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const PauseResumeInputModel = defineSchemaModel({
  name: 'PauseResumeInput',
  description: 'Input for pausing/resuming a workflow',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const CancelWorkflowInputModel = defineSchemaModel({
  name: 'CancelWorkflowInput',
  description: 'Input for cancelling a workflow',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListInstancesInputModel = defineSchemaModel({
  name: 'ListInstancesInput',
  description: 'Input for listing workflow instances',
  fields: {
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: InstanceStatusSchemaEnum, isOptional: true },
    referenceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    triggeredBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

export const ListInstancesOutputModel = defineSchemaModel({
  name: 'ListInstancesOutput',
  description: 'Output for listing workflow instances',
  fields: {
    instances: {
      type: WorkflowInstanceModel,
      isArray: true,
      isOptional: false,
    },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Start a new workflow instance.
 */
export const StartWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.instance.start',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'start'],
    description: 'Start a new workflow instance.',
    goal: 'Initiate a workflow for a business process.',
    context: 'Order creation, request submission, etc.',
  },
  io: {
    input: StartWorkflowInputModel,
    output: WorkflowInstanceModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.instance.started',
        version: 1,
        when: 'Workflow starts',
        payload: WorkflowInstanceModel,
      },
      {
        name: 'workflow.step.entered',
        version: 1,
        when: 'First step entered',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.started'],
  },
});

/**
 * Transition workflow to next step.
 */
export const TransitionWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.instance.transition',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'transition', 'state-machine'],
    description: 'Transition a workflow instance to the next step.',
    goal: 'Move workflow forward based on action.',
    context: 'Task completion, approval decisions.',
  },
  io: {
    input: TransitionInputModel,
    output: TransitionResultModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.step.exited',
        version: 1,
        when: 'Step is exited',
        payload: WorkflowInstanceModel,
      },
      {
        name: 'workflow.step.entered',
        version: 1,
        when: 'New step is entered',
        payload: WorkflowInstanceModel,
      },
      {
        name: 'workflow.instance.completed',
        version: 1,
        when: 'Workflow reaches end',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.transitioned'],
  },
});

/**
 * Pause a running workflow.
 */
export const PauseWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.instance.pause',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'pause'],
    description: 'Pause a running workflow instance.',
    goal: 'Temporarily halt workflow execution.',
    context: 'Administrative action, emergency stop.',
  },
  io: {
    input: PauseResumeInputModel,
    output: WorkflowInstanceModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.instance.paused',
        version: 1,
        when: 'Workflow is paused',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.paused'],
  },
});

/**
 * Resume a paused workflow.
 */
export const ResumeWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.instance.resume',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'resume'],
    description: 'Resume a paused workflow instance.',
    goal: 'Continue workflow execution.',
    context: 'Administrative action.',
  },
  io: {
    input: PauseResumeInputModel,
    output: WorkflowInstanceModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.instance.resumed',
        version: 1,
        when: 'Workflow is resumed',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.resumed'],
  },
});

/**
 * Cancel a workflow instance.
 */
export const CancelWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.instance.cancel',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'cancel'],
    description: 'Cancel a workflow instance.',
    goal: 'Terminate workflow without completion.',
    context: 'User request, system cancellation.',
  },
  io: {
    input: CancelWorkflowInputModel,
    output: WorkflowInstanceModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.instance.cancelled',
        version: 1,
        when: 'Workflow is cancelled',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.cancelled'],
  },
});

/**
 * List workflow instances.
 */
export const ListInstancesContract = defineQuery({
  meta: {
    name: 'workflow.instance.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'list'],
    description: 'List workflow instances with filtering.',
    goal: 'Browse and search running workflows.',
    context: 'Dashboard, monitoring.',
  },
  io: {
    input: ListInstancesInputModel,
    output: ListInstancesOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get a single workflow instance.
 */
export const GetInstanceInputModel = defineSchemaModel({
  name: 'GetInstanceInput',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const GetInstanceContract = defineQuery({
  meta: {
    name: 'workflow.instance.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'get'],
    description: 'Get a workflow instance with details.',
    goal: 'View workflow instance details.',
    context: 'Instance detail view.',
  },
  io: {
    input: GetInstanceInputModel,
    output: WorkflowInstanceModel,
  },
  policy: {
    auth: 'user',
  },
});
