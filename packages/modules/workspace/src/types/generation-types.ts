/**
 * Code generation related type definitions.
 */

import type { OpKind } from '@contractspec/lib.contracts';
import type { SpecType, PresentationKind } from './spec-types';

/**
 * AI provider options for generation.
 */
export interface AIGenerationOptions {
  provider: 'claude' | 'openai' | 'ollama' | 'custom';
  model?: string;
  endpoint?: string;
  stream?: boolean;
}

/**
 * Result of code generation.
 */
export interface GenerationResult {
  code: string;
  filePath: string;
  specType: SpecType;
}

/**
 * Build target types.
 */
export type GenerationTarget = 'handler' | 'component' | 'form';

/**
 * Test target types.
 */
export type TestTarget = 'handler' | 'component';

/**
 * Spec build type detected during build.
 */
export type SpecBuildType =
  | 'operation'
  | 'presentation'
  | 'form'
  | 'event'
  | 'workflow'
  | 'data-view'
  | 'telemetry'
  | 'migration'
  | 'experiment'
  | 'app-config'
  | 'integration'
  | 'knowledge'
  | 'unknown';

/**
 * Configuration for workspace operations.
 */
export interface WorkspaceConfig {
  aiProvider: 'claude' | 'openai' | 'ollama' | 'custom';
  aiModel?: string;
  agentMode: 'simple' | 'cursor' | 'claude-code' | 'openai-codex';
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
}

/**
 * Default workspace configuration.
 */
export const DEFAULT_WORKSPACE_CONFIG: WorkspaceConfig = {
  aiProvider: 'claude',
  agentMode: 'simple',
  outputDir: './src',
  conventions: {
    operations: 'interactions/commands|queries',
    events: 'events',
    presentations: 'presentations',
    forms: 'forms',
  },
  defaultOwners: [],
  defaultTags: [],
};

/**
 * AI prompt context for spec generation.
 */
export interface SpecGenerationContext {
  description: string;
  kind?: OpKind;
  presentationKind?: PresentationKind;
}

/**
 * AI prompt context for code generation.
 */
export interface CodeGenerationContext {
  specCode: string;
  targetPath?: string;
  existingCode?: string;
}
