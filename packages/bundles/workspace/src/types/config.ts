/**
 * Configuration types for ContractSpec workspace.
 */

import type { AgentMode } from '@contractspec/lib.contracts-spec';
import type { AiProvider } from '../ports';

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
