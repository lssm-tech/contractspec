/**
 * Agent Console Handlers - re-exports from domain modules for backward compatibility.
 */

// Agent handlers and types
export {
  mockCreateAgentHandler,
  mockGetAgentHandler,
  mockListAgentsHandler,
  type AgentSummary,
} from '../agent/agent.handler';

// Run handlers and types
export {
  mockExecuteAgentHandler,
  mockGetRunHandler,
  mockListRunsHandler,
  type RunSummary,
} from '../run/run.handler';

// Tool handlers and types
export {
  mockCreateToolHandler,
  mockGetToolHandler,
  mockListToolsHandler,
  type ToolSummary,
} from '../tool/tool.handler';
