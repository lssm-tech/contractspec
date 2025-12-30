/**
 * Interop layer for ContractSpec agents.
 *
 * Enables bidirectional integration between ContractSpec and external agent SDKs:
 * - Spec consumption by external agents
 * - Tool sharing via MCP servers
 * - Unified agent wrapper
 *
 * @example
 * ```typescript
 * import {
 *   createSpecConsumer,
 *   createToolConsumer,
 *   createToolServer,
 * } from '@contractspec/lib.ai-agent/interop';
 *
 * // Create a spec consumer for external agents
 * const specConsumer = createSpecConsumer({
 *   specs: [myAgentSpec],
 *   includeMetadata: true,
 * });
 *
 * // Get markdown for documentation
 * const markdown = specConsumer.getSpecMarkdown('my-agent');
 *
 * // Get prompt for LLM
 * const prompt = specConsumer.getSpecPrompt('my-agent');
 *
 * // Create a tool consumer for external agents
 * const toolConsumer = createToolConsumer({
 *   tools: [{ config: myTool, handler: myHandler }],
 * });
 *
 * // Export tools for Claude Agent SDK
 * const claudeTools = toolConsumer.exportToolsForSDK('claude-agent');
 *
 * // Create an MCP server exposing tools
 * const server = toolConsumer.createToolServer({
 *   name: 'my-tools',
 *   port: 3000,
 * });
 * await server.start();
 * ```
 */

// Types
export * from './types';

// Spec consumer
export {
  ContractSpecConsumer,
  createSpecConsumer,
  createSingleSpecConsumer,
} from './spec-consumer';

// Tool consumer
export {
  ContractSpecToolConsumer,
  createToolConsumer,
  createToolServer,
  exportToolsForExternalSDK,
} from './tool-consumer';
