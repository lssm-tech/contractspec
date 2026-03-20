// Workflow Definition entities

// Approval entities
export {
	ApprovalCommentEntity,
	ApprovalDecisionEnum,
	ApprovalRequestEntity,
	ApprovalStatusEnum,
} from './approval';
// Instance entities
export {
	InstanceStatusEnum,
	StepExecutionEntity,
	StepExecutionStatusEnum,
	WorkflowInstanceEntity,
} from './instance';
// Step entities
export { ApprovalModeEnum, StepTypeEnum, WorkflowStepEntity } from './step';
export {
	WorkflowDefinitionEntity,
	WorkflowStatusEnum,
	WorkflowTriggerTypeEnum,
} from './workflow';

import type { ModuleSchemaContribution } from '@contractspec/lib.schema';
import {
	ApprovalCommentEntity,
	ApprovalDecisionEnum,
	ApprovalRequestEntity,
	ApprovalStatusEnum,
} from './approval';
import {
	InstanceStatusEnum,
	StepExecutionEntity,
	StepExecutionStatusEnum,
	WorkflowInstanceEntity,
} from './instance';
import { ApprovalModeEnum, StepTypeEnum, WorkflowStepEntity } from './step';
// Schema contribution
import {
	WorkflowDefinitionEntity,
	WorkflowStatusEnum,
	WorkflowTriggerTypeEnum,
} from './workflow';

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
