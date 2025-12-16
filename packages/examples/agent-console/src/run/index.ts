/**
 * Run domain - Agent execution and monitoring.
 */

// Enums
export { RunStatusEnum, RunStepTypeEnum, LogLevelEnum, GranularityEnum } from './run.enum';

// Schema models
export {
  RunInputModel,
  RunStepModel,
  RunLogModel,
  RunAgentRefModel,
  RunModel,
  RunSummaryModel,
  TimelineDataPointModel,
} from './run.schema';

// Contracts
export {
  ExecuteAgentCommand,
  CancelRunCommand,
  GetRunQuery,
  ListRunsQuery,
  GetRunStepsQuery,
  GetRunLogsQuery,
  GetRunMetricsQuery,
} from './run.contracts';

// Events
export {
  RunStartedEvent,
  RunCompletedEvent,
  RunFailedEvent,
  RunCancelledEvent,
  ToolInvokedEvent,
  ToolCompletedEvent,
  MessageGeneratedEvent,
} from './run.event';

// Entities
export {
  RunStatusEntityEnum,
  RunStepTypeEntityEnum,
  LogLevelEntityEnum,
  RunEntity,
  RunStepEntity,
  RunLogEntity,
} from './run.entity';

// Presentations
export { RunListPresentation, RunDetailPresentation } from './run.presentation';

// Handlers
export {
  mockListRunsHandler,
  mockGetRunHandler,
  mockExecuteAgentHandler,
  mockCancelRunHandler,
  type ListRunsInput,
  type RunSummary,
  type ListRunsOutput,
} from './run.handler';


