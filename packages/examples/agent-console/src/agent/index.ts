/**
 * Agent domain - AI agent configuration and management.
 */

// Enums
export {
  AgentStatusEnum,
  ModelProviderEnum,
  ToolChoiceEnum,
} from './agent.enum';

// Schema models
export {
  AgentModel,
  AgentSummaryModel,
  AgentToolRefModel,
  AgentWithToolsModel,
  CreateAgentInputModel,
  UpdateAgentInputModel,
} from './agent.schema';

// Contracts
export {
  CreateAgentCommand,
  UpdateAgentCommand,
  GetAgentQuery,
  ListAgentsQuery,
  AssignToolToAgentCommand,
  RemoveToolFromAgentCommand,
} from './agent.contracts';

// Events
export {
  AgentCreatedEvent,
  AgentUpdatedEvent,
  AgentToolAssignedEvent,
  AgentToolRemovedEvent,
} from './agent.event';

// Entities
export {
  AgentStatusEntityEnum,
  ModelProviderEntityEnum,
  AgentEntity,
  AgentToolEntity,
} from './agent.entity';

// Presentations
export {
  AgentListPresentation,
  AgentDetailPresentation,
  AgentConsoleDashboardPresentation,
} from './agent.presentation';

// Handlers
export {
  mockListAgentsHandler,
  mockGetAgentHandler,
  mockCreateAgentHandler,
  mockUpdateAgentHandler,
  type ListAgentsInput,
  type AgentSummary,
  type ListAgentsOutput,
  type GetAgentInput,
  type AgentToolRef,
  type AgentWithTools,
} from './agent.handler';
