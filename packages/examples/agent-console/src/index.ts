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
 * } from '@lssm/example.agent-console';
 * ```
 */

// Entity exports
export * from './entities';

// Contract exports
export * from './contracts';

// Event exports
export * from './events';

// Handler exports (for sandbox/demo use)
export * from './handlers';

// Presentation exports
export * from './presentations';

// Feature spec export
export * from './feature';
export { default as example } from './example';
import './docs';
