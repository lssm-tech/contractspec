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

export {
  createWorkflowHandlers,
  type WorkflowHandlers,
  type WorkflowDefinition,
  type WorkflowStep,
  type WorkflowInstance,
  type WorkflowApproval,
  type CreateWorkflowDefinitionInput,
  type AddWorkflowStepInput,
  type StartWorkflowInput,
  type ApproveStepInput,
  type RejectStepInput,
  type ListWorkflowDefinitionsInput,
  type ListWorkflowDefinitionsOutput,
  type ListWorkflowInstancesInput,
  type ListWorkflowInstancesOutput,
} from './workflow.handlers';

export {
  createMarketplaceHandlers,
  type MarketplaceHandlers,
  type Store,
  type Product,
  type Order,
  type OrderItem,
  type Payout,
  type Review,
  type CreateStoreInput,
  type AddProductInput,
  type PlaceOrderInput,
  type ListStoresInput,
  type ListStoresOutput,
  type ListProductsInput,
  type ListProductsOutput,
  type ListOrdersInput,
  type ListOrdersOutput,
} from './marketplace.handlers';

export {
  createIntegrationHandlers,
  type IntegrationHandlers,
  type Integration,
  type Connection,
  type SyncConfig,
  type FieldMapping,
  type CreateIntegrationInput,
  type ConnectServiceInput,
  type ConfigureSyncInput,
  type MapFieldsInput,
  type ListIntegrationsInput,
  type ListIntegrationsOutput,
  type ListConnectionsInput,
  type ListConnectionsOutput,
  type ListSyncConfigsInput,
  type ListSyncConfigsOutput,
} from './integration.handlers';

export {
  createAnalyticsHandlers,
  type AnalyticsHandlers,
  type Dashboard,
  type Widget,
  type Query,
  type CreateDashboardInput,
  type AddWidgetInput,
  type CreateQueryInput,
  type ListDashboardsInput,
  type ListDashboardsOutput,
  type ListQueriesInput,
  type ListQueriesOutput,
} from './analytics.handlers';

export {
  createPolicySafeKnowledgeAssistantHandlers,
} from './policy-safe-knowledge-assistant.handlers';
