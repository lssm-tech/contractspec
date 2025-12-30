/**
 * Claude Agent SDK provider for ContractSpec agents.
 *
 * @example
 * ```typescript
 * import { ClaudeAgentSDKProvider } from '@contractspec/lib.ai-agent/providers/claude-agent-sdk';
 *
 * const provider = new ClaudeAgentSDKProvider({
 *   extendedThinking: true,
 *   computerUse: true,
 * });
 *
 * if (provider.isAvailable()) {
 *   const context = await provider.createContext(agentSpec);
 *   const result = await provider.execute(context, { prompt: "..." });
 * }
 * ```
 */

export { ClaudeAgentSDKProvider } from './adapter';
export * from './tool-bridge';
export * from './session-bridge';
