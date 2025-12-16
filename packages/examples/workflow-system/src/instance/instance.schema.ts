import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { InstanceStatusEnum } from './instance.enum';

/**
 * A running workflow instance.
 */
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
    referenceType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    status: { type: InstanceStatusEnum, isOptional: false },
    currentStepId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
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
    errorMessage: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Input for starting a workflow.
 */
export const StartWorkflowInputModel = defineSchemaModel({
  name: 'StartWorkflowInput',
  description: 'Input for starting a workflow',
  fields: {
    workflowKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    contextData: { type: ScalarTypeEnum.JSON(), isOptional: true },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Input for transitioning a workflow.
 */
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

/**
 * Result of a workflow transition.
 */
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


