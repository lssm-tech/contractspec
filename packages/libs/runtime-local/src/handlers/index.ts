/**
 * Runtime-local handlers
 *
 * Database-backed handlers for template examples.
 */
export {
  createCrmHandlers,
  type CrmHandlers,
  type Deal,
  type Stage,
  type CreateDealInput,
  type MoveDealInput,
  type WinDealInput,
  type LoseDealInput,
  type ListDealsInput,
  type ListDealsOutput,
} from './crm.handlers';

export {
  createSaasHandlers,
  type SaasHandlers,
  type Project,
  type Subscription,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ListProjectsInput,
  type ListProjectsOutput,
} from './saas.handlers';

export {
  createAgentHandlers,
  type AgentHandlers,
  type Agent,
  type Tool,
  type Run,
  type RunMetrics,
  type CreateAgentInput,
  type UpdateAgentInput,
  type ListAgentsInput,
  type ListAgentsOutput,
  type ListToolsInput,
  type ListToolsOutput,
  type ListRunsInput,
  type ListRunsOutput,
} from './agent.handlers';

