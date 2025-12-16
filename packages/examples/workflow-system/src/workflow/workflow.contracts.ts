import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { WorkflowStatusEnum } from './workflow.enum';
import {
  WorkflowDefinitionModel,
  WorkflowStepModel,
  CreateWorkflowInputModel,
  UpdateWorkflowInputModel,
  AddStepInputModel,
} from './workflow.schema';

const OWNERS = ['@example.workflow-system'] as const;

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
  policy: { auth: 'user' },
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
  policy: { auth: 'user' },
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
  policy: { auth: 'user' },
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
    input: defineSchemaModel({
      name: 'PublishWorkflowInput',
      fields: {
        workflowId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: WorkflowDefinitionModel,
  },
  policy: { auth: 'user' },
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
    input: defineSchemaModel({
      name: 'ListWorkflowsInput',
      fields: {
        status: { type: WorkflowStatusEnum, isOptional: true },
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
    }),
    output: defineSchemaModel({
      name: 'ListWorkflowsOutput',
      fields: {
        workflows: {
          type: WorkflowDefinitionModel,
          isArray: true,
          isOptional: false,
        },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
});

/**
 * Get a single workflow definition with steps.
 */
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
    input: defineSchemaModel({
      name: 'GetWorkflowInput',
      fields: {
        workflowId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: WorkflowDefinitionModel,
  },
  policy: { auth: 'user' },
});
