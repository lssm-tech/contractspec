/**
 * Tool domain - AI tool definitions and management.
 */

// Enums
export {
  ToolCategoryEnum,
  ToolStatusEnum,
  ImplementationTypeEnum,
} from './tool.enum';

// Schema models
export {
  ToolModel,
  ToolSummaryModel,
  CreateToolInputModel,
  UpdateToolInputModel,
} from './tool.schema';

// Contracts
export {
  CreateToolCommand,
  UpdateToolCommand,
  GetToolQuery,
  ListToolsQuery,
  TestToolCommand,
} from './tool.operation';

// Events
export {
  ToolCreatedEvent,
  ToolUpdatedEvent,
  ToolStatusChangedEvent,
} from './tool.event';

// Entities
export {
  ToolCategoryEntityEnum,
  ToolStatusEntityEnum,
  ImplementationTypeEntityEnum,
  ToolEntity,
} from './tool.entity';

// Presentations
export {
  ToolListPresentation,
  ToolDetailPresentation,
} from './tool.presentation';

// Handlers
export {
  mockListToolsHandler,
  mockGetToolHandler,
  mockCreateToolHandler,
  mockUpdateToolHandler,
  mockTestToolHandler,
  type ListToolsInput,
  type ToolSummary,
  type ListToolsOutput,
} from './tool.handler';
