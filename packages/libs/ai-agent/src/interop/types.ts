/**
 * Types for the interop layer.
 *
 * The interop layer enables bidirectional integration between
 * ContractSpec and external agent SDKs.
 */

import type { AgentSpec, AgentToolConfig } from '../spec/spec';
import type { ToolHandler } from '../types';

// ============================================================================
// Spec Consumer Types
// ============================================================================

/**
 * Configuration for a spec consumer.
 */
export interface SpecConsumerConfig {
  /** Specs to consume */
  specs: AgentSpec[];
  /** Whether to include metadata in outputs */
  includeMetadata?: boolean;
  /** Base URL for linking */
  baseUrl?: string;
  /** Locale for i18n (BCP 47). Falls back to 'en'. */
  locale?: string;
}

/**
 * Options for markdown generation.
 */
export interface SpecMarkdownOptions {
  /** Include table of contents */
  includeToc?: boolean;
  /** Include examples */
  includeExamples?: boolean;
  /** Include tools section */
  includeTools?: boolean;
  /** Include constraints section */
  includeConstraints?: boolean;
  /** Custom header */
  customHeader?: string;
  /** Locale override for this call (BCP 47). */
  locale?: string;
}

/**
 * Options for prompt generation.
 */
export interface SpecPromptOptions {
  /** Include tools in prompt */
  includeTools?: boolean;
  /** Include examples in prompt */
  includeExamples?: boolean;
  /** Include constraints in prompt */
  includeConstraints?: boolean;
  /** Output format */
  format?: 'structured' | 'natural';
  /** Custom context to append */
  customContext?: string;
  /** Locale override for this call (BCP 47). */
  locale?: string;
}

/**
 * Result from querying a spec.
 */
export interface SpecQueryResult {
  /** Spec key */
  key: string;
  /** The spec itself */
  spec: AgentSpec;
  /** Markdown representation */
  markdown: string;
  /** Prompt representation */
  prompt: string;
}

/**
 * Options for listing specs.
 */
export interface SpecListOptions {
  /** Filter by stability */
  stability?: string;
  /** Filter by tags */
  tags?: string[];
}

/**
 * Result from listing specs.
 */
export interface SpecListResult {
  /** Spec key */
  key: string;
  /** Spec name (from meta.name or meta.key) */
  name: string;
  /** Spec version */
  version: string;
  /** Description */
  description?: string;
  /** Stability */
  stability?: string;
  /** Tags */
  tags?: string[];
  /** Number of tools */
  toolCount: number;
}

/**
 * Interface for spec consumers.
 */
export interface SpecConsumer {
  getSpecMarkdown(specKey: string, options?: SpecMarkdownOptions): string;
  getSpecPrompt(specKey: string, options?: SpecPromptOptions): string;
  listSpecs(options?: SpecListOptions): SpecListResult[];
  querySpec(specKey: string): SpecQueryResult | undefined;
  hasSpec(specKey: string): boolean;
  getSpec(specKey: string): AgentSpec | undefined;
  getAllSpecs(): AgentSpec[];
  getSpecCount(): number;
  addSpec(spec: AgentSpec): void;
  removeSpec(specKey: string): boolean;
}

// ============================================================================
// Tool Consumer Types
// ============================================================================

/**
 * Configuration for a tool consumer.
 */
export interface ToolConsumerConfig {
  /** Tools with optional handlers */
  tools: {
    config: AgentToolConfig;
    handler?: ToolHandler;
  }[];
  /** Locale for i18n (BCP 47). Falls back to 'en'. */
  locale?: string;
}

/**
 * Configuration for a tool server.
 */
export interface ToolServerConfig {
  /** Tools with optional handlers */
  tools: {
    config: AgentToolConfig;
    handler?: ToolHandler;
  }[];
  /** Server name */
  name?: string;
  /** Server version */
  version?: string;
  /** Port to run on */
  port?: number;
  /** Locale for i18n (BCP 47). Falls back to 'en'. */
  locale?: string;
}

/**
 * Interface for tool servers.
 */
export interface ToolServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
  getTools(): AgentToolConfig[];
}

/**
 * Format for tool export.
 */
export type ToolExportFormat = 'claude-agent' | 'opencode' | 'mcp' | 'openai';

/**
 * Interface for tool consumers.
 */
export interface ToolConsumer {
  createToolServer(config?: Partial<ToolServerConfig>): ToolServer;
  exportToolsForSDK(format: ToolExportFormat): unknown[];
  getTools(): AgentToolConfig[];
  getTool(name: string): AgentToolConfig | undefined;
  hasTool(name: string): boolean;
  addTool(config: AgentToolConfig, handler?: ToolHandler): void;
  removeTool(name: string): boolean;
  getToolCount(): number;
}

// ============================================================================
// Legacy Exports (for backward compatibility)
// ============================================================================

/**
 * Spec list entry for discovery.
 */
export interface SpecListEntry {
  /** Spec key */
  key: string;
  /** Spec version */
  version: string;
  /** Spec type */
  type: 'agent' | 'operation' | 'event' | 'presentation';
  /** Brief description */
  description?: string;
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Task type for implementation prompts.
 */
export type ImplementationTaskType =
  | 'implement'
  | 'test'
  | 'review'
  | 'refactor'
  | 'document';

/**
 * Options for generating implementation prompts.
 */
export interface ImplementationPromptOptions {
  /** Task type */
  taskType?: ImplementationTaskType;
  /** Target language/framework */
  targetLanguage?: string;
  /** Include examples in prompt */
  includeExamples?: boolean;
  /** Include test scenarios */
  includeTestScenarios?: boolean;
  /** Custom context to append */
  customContext?: string;
}

/**
 * Format options for spec export.
 */
export type SpecExportFormat = 'markdown' | 'json' | 'prompt' | 'context';

/**
 * Tool configuration for external consumption.
 */
export interface ExternalToolConfig {
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Input schema */
  inputSchema: Record<string, unknown>;
  /** Whether approval is required */
  requiresApproval: boolean;
  /** Tool category */
  category?: string;
}

/**
 * Tool handler with metadata.
 */
export interface ToolWithHandler {
  /** Tool configuration */
  config: AgentToolConfig;
  /** Tool handler function */
  handler: ToolHandler;
}

/**
 * Target SDK for tool export.
 */
export type ToolExportTarget = 'claude-agent' | 'opencode' | 'mcp';

/**
 * MCP server configuration.
 */
export interface McpServerConfig {
  /** Server name */
  name: string;
  /** Server description */
  description?: string;
  /** Server version */
  version?: string;
  /** Tools to expose */
  tools: AgentToolConfig[];
  /** Tool handlers */
  handlers: Map<string, ToolHandler>;
}

/**
 * MCP tool definition for server.
 */
export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Provider type for UnifiedAgent.
 */
export type UnifiedAgentProvider =
  | 'ai-sdk'
  | 'claude-agent-sdk'
  | 'opencode-sdk';

/**
 * Unified agent status.
 */
export type UnifiedAgentStatus =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'running'
  | 'completed'
  | 'failed';

/**
 * Unified agent execution mode.
 */
export type ExecutionMode = 'generate' | 'stream';
