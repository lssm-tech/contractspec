/**
 * Mock handlers for agent-console example
 *
 * These handlers provide mock implementations of all contracts
 * for use in demos, tests, and the sandbox environment.
 */

// Mock data
export * from './mock-data';

// Agent handlers
export {
  mockListAgentsHandler,
  mockGetAgentHandler,
  mockCreateAgentHandler,
  mockUpdateAgentHandler,
  type ListAgentsInput,
  type ListAgentsOutput,
  type AgentSummary,
  type GetAgentInput,
  type AgentWithTools,
  type AgentToolRef,
} from './agent.handlers';

// Tool handlers
export {
  mockListToolsHandler,
  mockGetToolHandler,
  mockCreateToolHandler,
  mockTestToolHandler,
  type ListToolsInput,
  type ListToolsOutput,
  type ToolSummary,
  type GetToolInput,
  type Tool,
} from './tool.handlers';

// Run handlers
export {
  mockListRunsHandler,
  mockGetRunHandler,
  mockGetRunMetricsHandler,
  mockExecuteAgentHandler,
  mockCancelRunHandler,
  type ListRunsInput,
  type ListRunsOutput,
  type RunSummary,
  type GetRunInput,
  type Run,
  type RunStep,
  type RunLog,
  type GetRunMetricsInput,
  type RunMetrics,
  type TimelineDataPoint,
} from './run.handlers';
