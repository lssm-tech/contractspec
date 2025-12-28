import { defineEvent, defineSchemaModel } from '@contractspec/lib.contracts';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

/**
 * Payload for workflow definition events.
 */
const WorkflowDefinitionPayload = defineSchemaModel({
  name: 'WorkflowDefinitionEventPayload',
  description: 'Payload for workflow definition events',
  fields: {
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when a step is added.
 */
const StepAddedPayload = defineSchemaModel({
  name: 'StepAddedEventPayload',
  description: 'Payload when a step is added',
  fields: {
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * WorkflowCreatedEvent - A new workflow definition has been created.
 */
export const WorkflowCreatedEvent = defineEvent({
  meta: {
    key: 'workflow.definition.created',
    version: '1.0.0',
    description: 'A new workflow definition has been created.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'definition', 'created'],
  },
  payload: WorkflowDefinitionPayload,
});

/**
 * WorkflowUpdatedEvent - A workflow definition has been updated.
 */
export const WorkflowUpdatedEvent = defineEvent({
  meta: {
    key: 'workflow.definition.updated',
    version: '1.0.0',
    description: 'A workflow definition has been updated.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'definition', 'updated'],
  },
  payload: WorkflowDefinitionPayload,
});

/**
 * WorkflowPublishedEvent - A workflow definition has been published.
 */
export const WorkflowPublishedEvent = defineEvent({
  meta: {
    key: 'workflow.definition.published',
    version: '1.0.0',
    description: 'A workflow definition has been published and is now active.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'definition', 'published'],
  },
  payload: WorkflowDefinitionPayload,
});

/**
 * StepAddedEvent - A step has been added to a workflow definition.
 */
export const StepAddedEvent = defineEvent({
  meta: {
    key: 'workflow.step.added',
    version: '1.0.0',
    description: 'A step has been added to a workflow definition.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'step', 'added'],
  },
  payload: StepAddedPayload,
});
