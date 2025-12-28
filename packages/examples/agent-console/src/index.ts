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
export * from './run';
export * from './tool';
export * from './shared';

// Feature spec export
export * from './agent.feature';
export { default as example } from './example';
import './docs';
