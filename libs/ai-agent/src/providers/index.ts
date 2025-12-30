/**
 * External SDK providers for ContractSpec agents.
 *
 * This module provides integration with external agent SDKs:
 * - @anthropic-ai/claude-agent-sdk
 * - @opencode-ai/sdk
 *
 * @example
 * ```typescript
 * import { ClaudeAgentSDKProvider, OpenCodeSDKProvider } from '@contractspec/lib.ai-agent/providers';
 *
 * // Use Claude Agent SDK as backend
 * const claudeProvider = new ClaudeAgentSDKProvider({
 *   extendedThinking: true,
 *   computerUse: true,
 * });
 *
 * // Use OpenCode SDK as backend
 * const openCodeProvider = new OpenCodeSDKProvider({
 *   agentType: 'build',
 * });
 * ```
 */

// Core types
export * from './types';

// Provider implementations
export { ClaudeAgentSDKProvider } from './claude-agent-sdk';
export { OpenCodeSDKProvider } from './opencode-sdk';

// Re-export utility functions
export { createProviderRegistry, defaultProviderRegistry } from './registry';
