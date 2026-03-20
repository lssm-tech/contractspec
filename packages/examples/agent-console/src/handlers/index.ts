/**
 * Agent Console Handlers - re-exports from domain modules for backward compatibility.
 */
import {
	CreateAgentCommand,
	ListAgentsQuery,
	UpdateAgentCommand,
} from '../agent/agent.operation';
import { ExecuteAgentCommand, ListRunsQuery } from '../run/run.operation';
import { ListToolsQuery } from '../tool/tool.operation';

const HANDLER_BARREL_CONTRACTS = [
	CreateAgentCommand,
	ListAgentsQuery,
	UpdateAgentCommand,
	ExecuteAgentCommand,
	ListRunsQuery,
	ListToolsQuery,
] as const;
void HANDLER_BARREL_CONTRACTS;

// Agent handlers and types
export {
	type AgentSummary,
	mockCreateAgentHandler,
	mockGetAgentHandler,
	mockListAgentsHandler,
} from '../agent/agent.handler';

// Run handlers and types
export {
	mockExecuteAgentHandler,
	mockGetRunHandler,
	mockListRunsHandler,
	type RunSummary,
} from '../run/run.handler';
export { createAgentConsoleDemoHandlers } from '../shared/demo-runtime';
// Tool handlers and types
export {
	mockCreateToolHandler,
	mockGetToolHandler,
	mockListToolsHandler,
	type ToolSummary,
} from '../tool/tool.handler';
// Runtime handlers (PGLite)
export * from './agent.handlers';
