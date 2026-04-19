/**
 * Agent Console Example
 *
 * A ContractSpec example demonstrating AI agent orchestration with tools, runs, and logs.
 *
 * @example
 * ```typescript
 * import {
 *   ToolEntity,
 *   AgentEntity,
 *   RunEntity,
 *   CreateToolCommand,
 *   ExecuteAgentCommand
 * } from '@contractspec/example.agent-console';
 * ```
 */

// Domain exports
export * from './agent';
// Feature spec export
export * from './agent.feature';
export { default as example } from './example';
export {
	type AgentHandlers,
	createAgentHandlers,
} from './handlers/agent.handlers';
export * from './proof';
export * from './run';
export * from './shared';
export * from './tool';
export * from './ui';
export * from './visualizations';
import './docs';

export * from './example';
