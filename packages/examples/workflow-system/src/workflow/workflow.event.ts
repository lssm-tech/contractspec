import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';

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
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
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
  name: 'workflow.definition.created',
  version: 1,
  description: 'A new workflow definition has been created.',
  payload: WorkflowDefinitionPayload,
});

/**
 * WorkflowUpdatedEvent - A workflow definition has been updated.
 */
export const WorkflowUpdatedEvent = defineEvent({
  name: 'workflow.definition.updated',
  version: 1,
  description: 'A workflow definition has been updated.',
  payload: WorkflowDefinitionPayload,
});

/**
 * WorkflowPublishedEvent - A workflow definition has been published.
 */
export const WorkflowPublishedEvent = defineEvent({
  name: 'workflow.definition.published',
  version: 1,
  description: 'A workflow definition has been published and is now active.',
  payload: WorkflowDefinitionPayload,
});

/**
 * StepAddedEvent - A step has been added to a workflow definition.
 */
export const StepAddedEvent = defineEvent({
  name: 'workflow.step.added',
  version: 1,
  description: 'A step has been added to a workflow definition.',
  payload: StepAddedPayload,
});
