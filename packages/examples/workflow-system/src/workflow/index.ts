/**
 * Workflow domain - Workflow definition and step management.
 */

// Enums
export {
  WorkflowStatusEnum,
  TriggerTypeEnum,
  StepTypeEnum,
  ApprovalModeEnum,
} from './workflow.enum';

// Schema models
export {
  WorkflowStepModel,
  WorkflowDefinitionModel,
  CreateWorkflowInputModel,
  UpdateWorkflowInputModel,
  AddStepInputModel,
} from './workflow.schema';

// Contracts
export {
  CreateWorkflowContract,
  UpdateWorkflowContract,
  AddStepContract,
  PublishWorkflowContract,
  ListWorkflowsContract,
  GetWorkflowContract,
} from './workflow.contracts';

// Events
export {
  WorkflowCreatedEvent,
  WorkflowUpdatedEvent,
  WorkflowPublishedEvent,
  StepAddedEvent,
} from './workflow.event';
