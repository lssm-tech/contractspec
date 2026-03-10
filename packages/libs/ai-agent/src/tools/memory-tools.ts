/**
 * Memory tools for AI agents — Anthropic memory and custom operation-backed tools.
 *
 * @see https://ai-sdk.dev/docs/agents/memory
 * @see https://console.anthropic.com/docs/en/agents-and-tools/tool-use/memory-tool
 */

import { anthropic } from '@ai-sdk/anthropic';
import type { Tool } from 'ai';
import type { AgentMemoryStore } from './agent-memory-store';

/** Action shape from Anthropic memory_20250818 tool. */
export interface AnthropicMemoryAction {
  command: 'view' | 'create' | 'str_replace' | 'insert' | 'delete' | 'rename';
  path?: string;
  view_range?: [number, number];
  file_text?: string;
  old_str?: string;
  new_str?: string;
  insert_line?: number;
  insert_text?: string;
  old_path?: string;
  new_path?: string;
}

/**
 * Creates the Anthropic memory tool backed by an AgentMemoryStore.
 * Use when provider is Anthropic and agent needs persistent memory.
 *
 * @param store - Storage backend (e.g. InMemoryAgentMemoryStore for dev)
 * @returns AI SDK tool for use with ToolLoopAgent
 */
export function createAnthropicMemoryTool(store: AgentMemoryStore): Tool {
  const memory = anthropic.tools.memory_20250818({
    execute: async (action: AnthropicMemoryAction) => {
      switch (action.command) {
        case 'view':
          return store.view(action.path ?? '/memories', action.view_range);
        case 'create':
          return store.create(
            action.path ?? '/memories/untitled',
            action.file_text ?? ''
          );
        case 'str_replace':
          return store.strReplace(
            action.path ?? '/memories',
            action.old_str ?? '',
            action.new_str ?? ''
          );
        case 'insert':
          return store.insert(
            action.path ?? '/memories',
            action.insert_line ?? 0,
            action.insert_text ?? ''
          );
        case 'delete':
          return store.delete(action.path ?? '/memories');
        case 'rename':
          return store.rename(
            action.old_path ?? '/memories',
            action.new_path ?? '/memories'
          );
        default:
          return `Unknown command: ${(action as { command: string }).command}`;
      }
    },
  });
  return memory as Tool;
}
