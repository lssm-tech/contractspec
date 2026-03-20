/**
 * Workflow domain - Workflow definition and step management.
 */

// Enums
export {
	ApprovalModeEnum,
	StepTypeEnum,
	TriggerTypeEnum,
	WorkflowStatusEnum,
} from './workflow.enum';
// Events
export {
	StepAddedEvent,
	WorkflowCreatedEvent,
	WorkflowPublishedEvent,
	WorkflowUpdatedEvent,
} from './workflow.event';

// Contracts
export {
	AddStepContract,
	CreateWorkflowContract,
	GetWorkflowContract,
	ListWorkflowsContract,
	PublishWorkflowContract,
	UpdateWorkflowContract,
} from './workflow.operations';
// Schema models
export {
	AddStepInputModel,
	CreateWorkflowInputModel,
	UpdateWorkflowInputModel,
	WorkflowDefinitionModel,
	WorkflowStepModel,
} from './workflow.schema';
