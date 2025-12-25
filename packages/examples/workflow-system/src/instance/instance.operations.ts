import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { InstanceStatusEnum } from './instance.enum';
import {
  StartWorkflowInputModel,
  TransitionInputModel,
  TransitionResultModel,
  WorkflowInstanceModel,
} from './instance.schema';

const OWNERS = ['@example.workflow-system'] as const;

/**
 * Start a new workflow instance.
 */
export const StartWorkflowContract = defineCommand({
  meta: {
    key: 'workflow.instance.start',
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
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.instance.started',
        version: 1,
        when: 'Workflow starts',
        payload: WorkflowInstanceModel,
      },
      {
        key: 'workflow.step.entered',
        version: 1,
        when: 'First step entered',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.started'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'start-workflow-happy-path',
        given: ['Workflow definition exists'],
        when: ['User starts workflow'],
        then: ['Instance is created and started'],
      },
    ],
    examples: [
      {
        key: 'start-onboarding',
        input: {
          workflowKey: 'onboarding-v1',
          context: { employeeId: 'emp-123' },
        },
        output: { id: 'inst-456', status: 'running' },
      },
    ],
  },
});

/**
 * Transition workflow to next step.
 */
export const TransitionWorkflowContract = defineCommand({
  meta: {
    key: 'workflow.instance.transition',
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
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.step.exited',
        version: 1,
        when: 'Step is exited',
        payload: WorkflowInstanceModel,
      },
      {
        key: 'workflow.step.entered',
        version: 1,
        when: 'New step is entered',
        payload: WorkflowInstanceModel,
      },
      {
        key: 'workflow.instance.completed',
        version: 1,
        when: 'Workflow reaches end',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.transitioned'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'transition-workflow-happy-path',
        given: ['Workflow instance is waiting at step'],
        when: ['User provides input'],
        then: ['Instance moves to next step'],
      },
    ],
    examples: [
      {
        key: 'complete-task',
        input: {
          instanceId: 'inst-456',
          action: 'complete',
          data: { approved: true },
        },
        output: { success: true, nextStep: 'notify-hr' },
      },
    ],
  },
});

/**
 * Pause a running workflow.
 */
export const PauseWorkflowContract = defineCommand({
  meta: {
    key: 'workflow.instance.pause',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'pause'],
    description: 'Pause a running workflow instance.',
    goal: 'Temporarily halt workflow execution.',
    context: 'Administrative action, emergency stop.',
  },
  io: {
    input: defineSchemaModel({
      name: 'PauseResumeInput',
      fields: {
        instanceId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      },
    }),
    output: WorkflowInstanceModel,
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.instance.paused',
        version: 1,
        when: 'Workflow is paused',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.paused'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'pause-workflow-happy-path',
        given: ['Workflow is running'],
        when: ['Admin pauses workflow'],
        then: ['Instance status becomes PAUSED'],
      },
    ],
    examples: [
      {
        key: 'pause-maintenance',
        input: { instanceId: 'inst-456', reason: 'System maintenance' },
        output: { id: 'inst-456', status: 'paused' },
      },
    ],
  },
});

/**
 * Resume a paused workflow.
 */
export const ResumeWorkflowContract = defineCommand({
  meta: {
    key: 'workflow.instance.resume',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'resume'],
    description: 'Resume a paused workflow instance.',
    goal: 'Continue workflow execution.',
    context: 'Administrative action.',
  },
  io: {
    input: defineSchemaModel({
      name: 'PauseResumeInput',
      fields: {
        instanceId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      },
    }),
    output: WorkflowInstanceModel,
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.instance.resumed',
        version: 1,
        when: 'Workflow is resumed',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.resumed'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'resume-workflow-happy-path',
        given: ['Workflow is paused'],
        when: ['Admin resumes workflow'],
        then: ['Instance status becomes RUNNING'],
      },
    ],
    examples: [
      {
        key: 'resume-normal',
        input: { instanceId: 'inst-456', reason: 'Issue resolved' },
        output: { id: 'inst-456', status: 'running' },
      },
    ],
  },
});

/**
 * Cancel a workflow instance.
 */
export const CancelWorkflowContract = defineCommand({
  meta: {
    key: 'workflow.instance.cancel',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'cancel'],
    description: 'Cancel a workflow instance.',
    goal: 'Terminate workflow without completion.',
    context: 'User request, system cancellation.',
  },
  io: {
    input: defineSchemaModel({
      name: 'CancelWorkflowInput',
      fields: {
        instanceId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        reason: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: WorkflowInstanceModel,
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.instance.cancelled',
        version: 1,
        when: 'Workflow is cancelled',
        payload: WorkflowInstanceModel,
      },
    ],
    audit: ['workflow.instance.cancelled'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'cancel-workflow-happy-path',
        given: ['Workflow is running'],
        when: ['User cancels workflow'],
        then: ['Instance status becomes CANCELLED'],
      },
    ],
    examples: [
      {
        key: 'cancel-mistake',
        input: { instanceId: 'inst-456', reason: 'Created by mistake' },
        output: { id: 'inst-456', status: 'cancelled' },
      },
    ],
  },
});

/**
 * List workflow instances.
 */
export const ListInstancesContract = defineQuery({
  meta: {
    key: 'workflow.instance.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'list'],
    description: 'List workflow instances with filtering.',
    goal: 'Browse and search running workflows.',
    context: 'Dashboard, monitoring.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ListInstancesInput',
      fields: {
        workflowKey: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
        status: { type: InstanceStatusEnum, isOptional: true },
        referenceType: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
        referenceId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
        triggeredBy: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
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
    }),
    output: defineSchemaModel({
      name: 'ListInstancesOutput',
      fields: {
        instances: {
          type: WorkflowInstanceModel,
          isArray: true,
          isOptional: false,
        },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-instances-happy-path',
        given: ['Workflow instances exist'],
        when: ['User lists instances'],
        then: ['List of instances is returned'],
      },
    ],
    examples: [
      {
        key: 'list-running',
        input: { status: 'running', limit: 10 },
        output: { instances: [], total: 5 },
      },
    ],
  },
});

/**
 * Get a single workflow instance.
 */
export const GetInstanceContract = defineQuery({
  meta: {
    key: 'workflow.instance.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'instance', 'get'],
    description: 'Get a workflow instance with details.',
    goal: 'View workflow instance details.',
    context: 'Instance detail view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetInstanceInput',
      fields: {
        instanceId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: WorkflowInstanceModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'get-instance-happy-path',
        given: ['Instance exists'],
        when: ['User requests instance details'],
        then: ['Instance details are returned'],
      },
    ],
    examples: [
      {
        key: 'get-details',
        input: { instanceId: 'inst-456' },
        output: { id: 'inst-456', workflowKey: 'onboarding-v1' },
      },
    ],
  },
});
