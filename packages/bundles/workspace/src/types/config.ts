/**
 * Configuration types for ContractSpec workspace.
 */

/**
 * AI provider types.
 */
export type AiProvider = 'claude' | 'openai' | 'ollama' | 'custom';

/**
 * Agent mode types.
 */
export type AgentMode =
  | 'simple'
  | 'cursor'
  | 'claude-code'
  | 'openai-codex'
  | 'opencode-sdk';

/**
 * Configuration for ContractSpec CLI and services.
 */
export interface Config {
  aiProvider: AiProvider;
  aiModel?: string;
  agentMode: AgentMode;
  customEndpoint?: string | null;
  customApiKey?: string | null;
  outputDir: string;
  conventions: {
    operations: string;
    events: string;
    presentations: string;
    forms: string;
  };
  defaultOwners: string[];
  defaultTags: string[];
}
