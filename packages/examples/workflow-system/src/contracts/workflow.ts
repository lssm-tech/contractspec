import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['example.workflow-system'] as const;

// ============ Enums ============

const WorkflowStatusSchemaEnum = defineEnum('WorkflowStatus', [
  'DRAFT',
  'ACTIVE',
  'DEPRECATED',
  'ARCHIVED',
]);
const TriggerTypeSchemaEnum = defineEnum('WorkflowTriggerType', [
  'MANUAL',
  'EVENT',
  'SCHEDULED',
  'API',
]);
const StepTypeSchemaEnum = defineEnum('StepType', [
  'START',
  'APPROVAL',
  'TASK',
  'CONDITION',
  'PARALLEL',
  'WAIT',
  'ACTION',
  'END',
]);
const ApprovalModeSchemaEnum = defineEnum('ApprovalMode', [
  'ANY',
  'ALL',
  'MAJORITY',
  'SEQUENTIAL',
]);

// ============ Schemas ============

export const WorkflowStepModel = defineSchemaModel({
  name: 'WorkflowStepModel',
  description: 'A step in a workflow definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: StepTypeSchemaEnum, isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    transitions: { type: ScalarTypeEnum.JSON(), isOptional: false },
    approvalMode: { type: ApprovalModeSchemaEnum, isOptional: true },
    approverRoles: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const WorkflowDefinitionModel = defineSchemaModel({
  name: 'WorkflowDefinitionModel',
  description: 'A workflow definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: WorkflowStatusSchemaEnum, isOptional: false },
    triggerType: { type: TriggerTypeSchemaEnum, isOptional: false },
    initialStepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    featureFlagKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    steps: { type: WorkflowStepModel, isArray: true, isOptional: true },
  },
});

export const CreateWorkflowInputModel = defineSchemaModel({
  name: 'CreateWorkflowInput',
  description: 'Input for creating a workflow definition',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    key: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    triggerType: { type: TriggerTypeSchemaEnum, isOptional: true },
    triggerConfig: { type: ScalarTypeEnum.JSON(), isOptional: true },
    featureFlagKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    settings: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const UpdateWorkflowInputModel = defineSchemaModel({
  name: 'UpdateWorkflowInput',
  description: 'Input for updating a workflow definition',
  fields: {
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    triggerType: { type: TriggerTypeSchemaEnum, isOptional: true },
    triggerConfig: { type: ScalarTypeEnum.JSON(), isOptional: true },
    featureFlagKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    settings: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const AddStepInputModel = defineSchemaModel({
  name: 'AddStepInput',
  description: 'Input for adding a step to a workflow',
  fields: {
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: StepTypeSchemaEnum, isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    transitions: { type: ScalarTypeEnum.JSON(), isOptional: false },
    approvalMode: { type: ApprovalModeSchemaEnum, isOptional: true },
    approverRoles: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    approverUserIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    timeoutSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    slaSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const PublishWorkflowInputModel = defineSchemaModel({
  name: 'PublishWorkflowInput',
  description: 'Input for publishing a workflow',
  fields: {
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ListWorkflowsInputModel = defineSchemaModel({
  name: 'ListWorkflowsInput',
  description: 'Input for listing workflows',
  fields: {
    status: { type: WorkflowStatusSchemaEnum, isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
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

export const ListWorkflowsOutputModel = defineSchemaModel({
  name: 'ListWorkflowsOutput',
  description: 'Output for listing workflows',
  fields: {
    workflows: {
      type: WorkflowDefinitionModel,
      isArray: true,
      isOptional: false,
    },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Create a new workflow definition.
 */
export const CreateWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.definition.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'definition', 'create'],
    description: 'Create a new workflow definition.',
    goal: 'Allow users to define new workflow blueprints.',
    context: 'Workflow designer, admin panel.',
  },
  io: {
    input: CreateWorkflowInputModel,
    output: WorkflowDefinitionModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.definition.created',
        version: 1,
        when: 'Workflow is created',
        payload: WorkflowDefinitionModel,
      },
    ],
    audit: ['workflow.definition.created'],
  },
});

/**
 * Update an existing workflow definition.
 */
export const UpdateWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.definition.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'definition', 'update'],
    description: 'Update an existing workflow definition.',
    goal: 'Allow users to modify workflow blueprints.',
    context: 'Workflow designer.',
  },
  io: {
    input: UpdateWorkflowInputModel,
    output: WorkflowDefinitionModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.definition.updated',
        version: 1,
        when: 'Workflow is updated',
        payload: WorkflowDefinitionModel,
      },
    ],
    audit: ['workflow.definition.updated'],
  },
});

/**
 * Add a step to a workflow definition.
 */
export const AddStepContract = defineCommand({
  meta: {
    name: 'workflow.step.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'step', 'add'],
    description: 'Add a step to a workflow definition.',
    goal: 'Build workflow structure step by step.',
    context: 'Workflow designer.',
  },
  io: {
    input: AddStepInputModel,
    output: WorkflowStepModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.step.added',
        version: 1,
        when: 'Step is added',
        payload: WorkflowStepModel,
      },
    ],
    audit: ['workflow.step.added'],
  },
});

/**
 * Publish a workflow definition (make it active).
 */
export const PublishWorkflowContract = defineCommand({
  meta: {
    name: 'workflow.definition.publish',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'definition', 'publish'],
    description: 'Publish a workflow definition to make it available for use.',
    goal: 'Activate workflow for production use.',
    context: 'Workflow designer, deployment.',
  },
  io: {
    input: PublishWorkflowInputModel,
    output: WorkflowDefinitionModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.definition.published',
        version: 1,
        when: 'Workflow is published',
        payload: WorkflowDefinitionModel,
      },
    ],
    audit: ['workflow.definition.published'],
  },
});

/**
 * List workflow definitions.
 */
export const ListWorkflowsContract = defineQuery({
  meta: {
    name: 'workflow.definition.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'definition', 'list'],
    description: 'List workflow definitions with filtering.',
    goal: 'Browse and search available workflows.',
    context: 'Workflow list, search.',
  },
  io: {
    input: ListWorkflowsInputModel,
    output: ListWorkflowsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get a single workflow definition with steps.
 */
export const GetWorkflowInputModel = defineSchemaModel({
  name: 'GetWorkflowInput',
  fields: {
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const GetWorkflowContract = defineQuery({
  meta: {
    name: 'workflow.definition.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'definition', 'get'],
    description: 'Get a workflow definition with all steps.',
    goal: 'View workflow details.',
    context: 'Workflow designer, detail view.',
  },
  io: {
    input: GetWorkflowInputModel,
    output: WorkflowDefinitionModel,
  },
  policy: {
    auth: 'user',
  },
});
