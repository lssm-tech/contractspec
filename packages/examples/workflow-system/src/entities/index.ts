// Workflow Definition entities
export {
  WorkflowStatusEnum,
  WorkflowTriggerTypeEnum,
  WorkflowDefinitionEntity,
} from './workflow';

// Step entities
export { StepTypeEnum, ApprovalModeEnum, WorkflowStepEntity } from './step';

// Instance entities
export {
  InstanceStatusEnum,
  StepExecutionStatusEnum,
  WorkflowInstanceEntity,
  StepExecutionEntity,
} from './instance';

// Approval entities
export {
  ApprovalStatusEnum,
  ApprovalDecisionEnum,
  ApprovalRequestEntity,
  ApprovalCommentEntity,
} from './approval';

// Schema contribution
import {
  WorkflowStatusEnum,
  WorkflowTriggerTypeEnum,
  WorkflowDefinitionEntity,
} from './workflow';
import { StepTypeEnum, ApprovalModeEnum, WorkflowStepEntity } from './step';
import {
  InstanceStatusEnum,
  StepExecutionStatusEnum,
  WorkflowInstanceEntity,
  StepExecutionEntity,
} from './instance';
import {
  ApprovalStatusEnum,
  ApprovalDecisionEnum,
  ApprovalRequestEntity,
  ApprovalCommentEntity,
} from './approval';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

export const workflowSystemEntities = [
  WorkflowDefinitionEntity,
  WorkflowStepEntity,
  WorkflowInstanceEntity,
  StepExecutionEntity,
  ApprovalRequestEntity,
  ApprovalCommentEntity,
];

export const workflowSystemSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/example.workflow-system',
  entities: workflowSystemEntities,
  enums: [
    WorkflowStatusEnum,
    WorkflowTriggerTypeEnum,
    StepTypeEnum,
    ApprovalModeEnum,
    InstanceStatusEnum,
    StepExecutionStatusEnum,
    ApprovalStatusEnum,
    ApprovalDecisionEnum,
  ],
};


