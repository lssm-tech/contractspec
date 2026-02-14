/**
 * Code generation related type definitions.
 */

import type { OpKind } from '@contractspec/lib.contracts-spec';
import type { PresentationKind } from './spec-types';
import type { RuleSyncConfig } from './rulesync-types';

/**
 * Test target types.
 */
export type TestTarget = 'handler' | 'component';

/**
 * Configuration for workspace operations.
 */
export interface WorkspaceConfig {
  aiProvider: 'claude' | 'openai' | 'ollama' | 'custom';
  aiModel?: string;
  agentMode:
    | 'simple'
    | 'cursor'
    | 'claude-code'
    | 'openai-codex'
    | 'opencode-sdk';
  customEndpoint?: string | null;
  customApiKey?: string | null;
  outputDir: string;
  conventions: {
    operations: string;
    events: string;
    presentations: string;
    forms: string;
    workflows?: string;
    'data-views'?: string;
    dataViews?: string;
    migrations?: string;
    telemetry?: string;
    experiments?: string;
    appConfig?: string;
    integrations?: string;
    knowledge?: string;
  };
  defaultOwners: string[];
  defaultTags: string[];
  ruleSync?: RuleSyncConfig;
}

/**
 * AI prompt context for spec generation.
 */
export interface SpecGenerationContext {
  description: string;
  kind?: OpKind;
  presentationKind?: PresentationKind;
}
