/**
 * Types for spec exporters.
 *
 * Exporters convert ContractSpec AgentSpec definitions into formats
 * compatible with external agent SDKs.
 */

import type { AgentSpec } from '../spec/spec';
import type { OpenCodeAgentType } from '../providers/types';
import type { McpClientConfig } from '../tools/mcp-client';

// ============================================================================
// Common Export Types
// ============================================================================

/**
 * Base export options.
 */
export interface ExportOptions {
  /** Include comments/documentation in output */
  includeComments?: boolean;
  /** Pretty-print JSON output */
  prettyPrint?: boolean;
  /** Custom metadata to include */
  metadata?: Record<string, unknown>;
  /** Target locale for exported strings (BCP 47, e.g., "en", "fr", "es") */
  locale?: string;
}

/**
 * Export target format.
 */
export type ExportFormat = 'claude-agent' | 'opencode' | 'mcp' | 'json';

// ============================================================================
// Claude Agent SDK Export Types
// ============================================================================

/**
 * Options for Claude Agent SDK export.
 */
export interface ClaudeAgentExportOptions extends ExportOptions {
  /** Model to use */
  model?: string;
  /** Generate CLAUDE.md for Claude Code CLI */
  generateClaudeMd?: boolean;
  /** Enable computer use in exported config */
  computerUse?: boolean;
  /** Enable extended thinking in exported config */
  extendedThinking?: boolean;
  /** MCP servers to include */
  mcpServers?: McpClientConfig[];
}

/**
 * Claude Agent SDK export result.
 */
export interface ClaudeAgentExportResult {
  /** SDK configuration object */
  config: ClaudeAgentConfig;
  /** Generated CLAUDE.md content (if requested) */
  claudeMd?: string;
  /** Tool definitions in SDK format */
  tools: ClaudeToolDefinition[];
  /** Export metadata */
  exportedAt: Date;
  /** Source spec key */
  sourceSpec: string;
}

/**
 * Claude Agent SDK configuration.
 */
export interface ClaudeAgentConfig {
  model: string;
  system: string;
  tools: ClaudeToolDefinition[];
  max_turns?: number;
  computer_use?: boolean;
  extended_thinking?: boolean;
  mcp_servers?: McpClientConfig[];
}

/**
 * Claude Agent SDK tool definition.
 */
export interface ClaudeToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  requires_confirmation?: boolean;
}

// ============================================================================
// OpenCode SDK Export Types
// ============================================================================

/**
 * Options for OpenCode SDK export.
 */
export interface OpenCodeExportOptions extends ExportOptions {
  /** Agent type override */
  agentType?: OpenCodeAgentType;
  /** Model to use */
  model?: string;
  /** Temperature */
  temperature?: number;
  /** Maximum steps */
  maxSteps?: number;
  /** Output format */
  format?: 'json' | 'markdown';
  /** Output path for agent file */
  outputPath?: string;
}

/**
 * OpenCode SDK export result.
 */
export interface OpenCodeExportResult {
  /** JSON agent configuration */
  jsonConfig: OpenCodeAgentJSON;
  /** Markdown agent file content */
  markdownConfig: string;
  /** Export metadata */
  exportedAt: Date;
  /** Source spec key */
  sourceSpec: string;
}

/**
 * OpenCode agent JSON configuration.
 */
export interface OpenCodeAgentJSON {
  name: string;
  version?: string;
  description?: string;
  type: OpenCodeAgentType;
  instructions: string;
  tools: OpenCodeToolJSON[];
  config: {
    max_steps?: number;
    temperature?: number;
    model?: string;
  };
}

/**
 * OpenCode tool JSON definition.
 */
export interface OpenCodeToolJSON {
  name: string;
  description: string;
  schema: Record<string, unknown>;
  requires_approval?: boolean;
}

// ============================================================================
// MCP Export Types
// ============================================================================

/**
 * Options for MCP export.
 */
export interface MCPExportOptions extends ExportOptions {
  /** Server name */
  serverName?: string;
  /** Server version */
  serverVersion?: string;
  /** Include resources */
  includeResources?: boolean;
  /** Include prompts */
  includePrompts?: boolean;
}

/**
 * MCP export result.
 */
export interface MCPExportResult {
  /** Server definition */
  server: MCPServerDefinition;
  /** Tool definitions */
  tools: MCPToolDefinition[];
  /** Resource definitions (if included) */
  resources?: MCPResourceDefinition[];
  /** Prompt definitions (if included) */
  prompts?: MCPPromptDefinition[];
  /** Export metadata */
  exportedAt: Date;
  /** Source spec key */
  sourceSpec: string;
}

/**
 * MCP server definition.
 */
export interface MCPServerDefinition {
  name: string;
  version: string;
  description?: string;
  capabilities: {
    tools?: boolean;
    resources?: boolean;
    prompts?: boolean;
  };
}

/**
 * MCP tool definition.
 */
export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * MCP resource definition.
 */
export interface MCPResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

/**
 * MCP prompt definition.
 */
export interface MCPPromptDefinition {
  name: string;
  description?: string;
  arguments?: {
    name: string;
    description?: string;
    required?: boolean;
  }[];
}

// ============================================================================
// Exporter Interface
// ============================================================================

/**
 * Generic exporter interface.
 */
export interface Exporter<TOptions extends ExportOptions, TResult> {
  /** Export format identifier */
  readonly format: ExportFormat;

  /**
   * Export an AgentSpec to the target format.
   */
  export(spec: AgentSpec, options?: TOptions): TResult;

  /**
   * Export multiple specs.
   */
  exportMany(specs: AgentSpec[], options?: TOptions): TResult[];

  /**
   * Validate that a spec can be exported.
   */
  validate(spec: AgentSpec): { valid: boolean; errors: string[] };
}
