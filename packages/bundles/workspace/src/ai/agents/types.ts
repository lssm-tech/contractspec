/**
 * Agent types and interfaces for code generation and validation
 */

export type AgentMode =
  | 'simple'
  | 'cursor'
  | 'claude-code'
  | 'openai-codex'
  | 'opencode-sdk';

export interface AgentTask {
  type: 'generate' | 'validate' | 'refactor' | 'test';
  specCode: string;
  existingCode?: string;
  targetPath?: string;
  options?: Record<string, unknown>;
}

export interface AgentResult {
  success: boolean;
  code?: string;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
  metadata?: Record<string, unknown>;
}

export interface AgentProvider {
  name: AgentMode;
  generate(task: AgentTask): Promise<AgentResult>;
  validate(task: AgentTask): Promise<AgentResult>;
  canHandle(task: AgentTask): boolean;
}

export interface AgentConfig {
  mode: AgentMode;
  fallbackMode?: AgentMode;
  timeout?: number;
  retries?: number;
  options?: Record<string, unknown>;
}
