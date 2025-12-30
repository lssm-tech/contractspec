/**
 * Agent Adapters
 *
 * Exports all agent-specific adapters for formatting implementation
 * plans and prompts.
 */

export { ClaudeCodeAdapter, claudeCodeAdapter } from './claude-code';
export { CursorCLIAdapter, cursorCLIAdapter } from './cursor-cli';
export { GenericMCPAdapter, genericMCPAdapter } from './generic-mcp';

import type { AgentType } from '@contractspec/lib.contracts/llm';
import type { AgentAdapter } from '../types';
import { claudeCodeAdapter } from './claude-code';
import { cursorCLIAdapter } from './cursor-cli';
import { genericMCPAdapter } from './generic-mcp';

/**
 * Registry of all available agent adapters.
 */
export const agentAdapters: Record<AgentType, AgentAdapter> = {
  'claude-code': claudeCodeAdapter,
  'cursor-cli': cursorCLIAdapter,
  'generic-mcp': genericMCPAdapter,
};

/**
 * Get an adapter for a specific agent type.
 */
export function getAgentAdapter(agent: AgentType): AgentAdapter {
  const adapter = agentAdapters[agent];
  if (!adapter) {
    throw new Error(`Unknown agent type: ${agent}`);
  }
  return adapter;
}

/**
 * List all available agent types.
 */
export function listAgentTypes(): AgentType[] {
  return Object.keys(agentAdapters) as AgentType[];
}
