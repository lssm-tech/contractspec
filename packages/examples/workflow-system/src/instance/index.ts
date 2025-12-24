/**
 * Instance domain - Workflow instance execution and management.
 */

// Enums
export { InstanceStatusEnum } from './instance.enum';

// Schema models
export {
  WorkflowInstanceModel,
  StartWorkflowInputModel,
  TransitionInputModel,
  TransitionResultModel,
} from './instance.schema';

// Contracts
export {
  StartWorkflowContract,
  TransitionWorkflowContract,
  PauseWorkflowContract,
  ResumeWorkflowContract,
  CancelWorkflowContract,
  ListInstancesContract,
  GetInstanceContract,
} from './instance.operations';

// Events
export {
  InstanceStartedEvent,
  StepEnteredEvent,
  StepExitedEvent,
  InstanceCompletedEvent,
  InstanceCancelledEvent,
  InstancePausedEvent,
  InstanceResumedEvent,
  InstanceFailedEvent,
  InstanceTimedOutEvent,
} from './instance.event';
