import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import {
  WorkflowStatusEnum,
  TriggerTypeEnum,
  StepTypeEnum,
  ApprovalModeEnum,
} from './workflow.enum';

/**
 * A step in a workflow definition.
 */
export const WorkflowStepModel = defineSchemaModel({
  name: 'WorkflowStepModel',
  description: 'A step in a workflow definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: StepTypeEnum, isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    transitions: { type: ScalarTypeEnum.JSON(), isOptional: false },
    approvalMode: { type: ApprovalModeEnum, isOptional: true },
    approverRoles: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

/**
 * A workflow definition.
 */
export const WorkflowDefinitionModel = defineSchemaModel({
  name: 'WorkflowDefinitionModel',
  description: 'A workflow definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: WorkflowStatusEnum, isOptional: false },
    triggerType: { type: TriggerTypeEnum, isOptional: false },
    initialStepId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
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

/**
 * Input for creating a workflow definition.
 */
export const CreateWorkflowInputModel = defineSchemaModel({
  name: 'CreateWorkflowInput',
  description: 'Input for creating a workflow definition',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    key: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    triggerType: { type: TriggerTypeEnum, isOptional: true },
    triggerConfig: { type: ScalarTypeEnum.JSON(), isOptional: true },
    featureFlagKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    settings: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

/**
 * Input for updating a workflow definition.
 */
export const UpdateWorkflowInputModel = defineSchemaModel({
  name: 'UpdateWorkflowInput',
  description: 'Input for updating a workflow definition',
  fields: {
    workflowId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    triggerType: { type: TriggerTypeEnum, isOptional: true },
    triggerConfig: { type: ScalarTypeEnum.JSON(), isOptional: true },
    featureFlagKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    settings: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

/**
 * Input for adding a step to a workflow.
 */
export const AddStepInputModel = defineSchemaModel({
  name: 'AddStepInput',
  description: 'Input for adding a step to a workflow',
  fields: {
    workflowId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    key: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: StepTypeEnum, isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    transitions: { type: ScalarTypeEnum.JSON(), isOptional: false },
    approvalMode: { type: ApprovalModeEnum, isOptional: true },
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
