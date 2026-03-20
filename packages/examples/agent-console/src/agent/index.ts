/**
 * Agent domain - AI agent configuration and management.
 */

// Entities
export {
	AgentEntity,
	AgentStatusEntityEnum,
	AgentToolEntity,
	ModelProviderEntityEnum,
} from './agent.entity';
// Enums
export {
	AgentStatusEnum,
	ModelProviderEnum,
	ToolChoiceEnum,
} from './agent.enum';
// Events
export {
	AgentCreatedEvent,
	AgentToolAssignedEvent,
	AgentToolRemovedEvent,
	AgentUpdatedEvent,
} from './agent.event';
// Handlers
export {
	type AgentSummary,
	type AgentToolRef,
	type AgentWithTools,
	type GetAgentInput,
	type ListAgentsInput,
	type ListAgentsOutput,
	mockCreateAgentHandler,
	mockGetAgentHandler,
	mockListAgentsHandler,
	mockUpdateAgentHandler,
} from './agent.handler';
// Contracts
export {
	AssignToolToAgentCommand,
	CreateAgentCommand,
	GetAgentQuery,
	ListAgentsQuery,
	RemoveToolFromAgentCommand,
	UpdateAgentCommand,
} from './agent.operation';

// Presentations
export {
	AgentConsoleDashboardPresentation,
	AgentDetailPresentation,
	AgentListPresentation,
} from './agent.presentation';
// Schema models
export {
	AgentModel,
	AgentSummaryModel,
	AgentToolRefModel,
	AgentWithToolsModel,
	CreateAgentInputModel,
	UpdateAgentInputModel,
} from './agent.schema';
