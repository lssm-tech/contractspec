/**
 * OpenCode SDK provider for ContractSpec agents.
 *
 * @example
 * ```typescript
 * import { OpenCodeSDKProvider } from '@contractspec/lib.ai-agent/providers/opencode-sdk';
 *
 * const provider = new OpenCodeSDKProvider({
 *   agentType: 'build',
 *   port: 4096,
 * });
 *
 * if (provider.isAvailable()) {
 *   const context = await provider.createContext(agentSpec);
 *   const result = await provider.execute(context, { prompt: "..." });
 * }
 * ```
 */

export { OpenCodeSDKProvider } from './adapter';
export * from './tool-bridge';
export * from './agent-bridge';
