/**
 * Tool consumer for external agents.
 *
 * Enables external agent SDKs to consume ContractSpec tools:
 * - Create MCP servers exposing tools
 * - Export tools for specific SDK formats
 * - Bridge tool execution
 */
import type { AgentToolConfig } from '../spec/spec';
import type { ToolHandler, ToolExecutionContext } from '../types';
import type {
  ToolConsumer,
  ToolConsumerConfig,
  ToolServerConfig,
  ToolServer,
  ToolExportFormat,
} from './types';
import { specToolToClaudeAgentTool } from '../providers/claude-agent-sdk/tool-bridge';
import { specToolToOpenCodeTool } from '../providers/opencode-sdk/tool-bridge';

// =============================================================================
// Tool Server Implementation
// =============================================================================

/**
 * Simple MCP-compatible tool server.
 */
class MCPToolServer implements ToolServer {
  private readonly tools: Map<
    string,
    { config: AgentToolConfig; handler?: ToolHandler }
  >;
  private readonly name: string;
  private readonly version: string;
  private running = false;

  constructor(config: ToolServerConfig) {
    this.tools = new Map();
    this.name = config.name ?? 'contractspec-tools';
    this.version = config.version ?? '1.0.0';

    // Register tools
    for (const tool of config.tools) {
      this.tools.set(tool.config.name, tool);
    }
  }

  async start(): Promise<void> {
    if (this.running) {
      return;
    }

    // In a real implementation, this would start an HTTP/stdio server
    // For now, we just mark as running
    this.running = true;

    console.log(
      `[MCPToolServer] Started ${this.name}@${this.version} with ${this.tools.size} tools`
    );
  }

  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    this.running = false;
    console.log(`[MCPToolServer] Stopped ${this.name}`);
  }

  isRunning(): boolean {
    return this.running;
  }

  getTools(): AgentToolConfig[] {
    return Array.from(this.tools.values()).map((t) => t.config);
  }

  async executeTool(
    toolName: string,
    args: Record<string, unknown>,
    context?: ToolExecutionContext
  ): Promise<string> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    if (!tool.handler) {
      throw new Error(`No handler registered for tool: ${toolName}`);
    }

    const fullContext: ToolExecutionContext = {
      agentId: context?.agentId ?? 'mcp-server',
      sessionId: context?.sessionId ?? 'mcp-session',
      tenantId: context?.tenantId,
      actorId: context?.actorId,
      metadata: context?.metadata,
      signal: context?.signal,
    };

    return await tool.handler(args, fullContext);
  }

  /**
   * Get MCP-compatible tool definitions.
   */
  getMCPToolDefinitions(): {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
  }[] {
    const definitions: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
    }[] = [];

    for (const [name, tool] of this.tools) {
      definitions.push({
        name,
        description: tool.config.description ?? '',
        inputSchema: tool.config.schema ?? { type: 'object', properties: {} },
      });
    }

    return definitions;
  }

  /**
   * Get server info for MCP.
   */
  getServerInfo(): {
    name: string;
    version: string;
    tools: number;
    running: boolean;
  } {
    return {
      name: this.name,
      version: this.version,
      tools: this.tools.size,
      running: this.running,
    };
  }
}

// =============================================================================
// Tool Consumer Implementation
// =============================================================================

/**
 * ContractSpec tool consumer for external agents.
 */
export class ContractSpecToolConsumer implements ToolConsumer {
  private readonly tools: Map<
    string,
    { config: AgentToolConfig; handler?: ToolHandler }
  >;

  constructor(config: ToolConsumerConfig) {
    this.tools = new Map();

    // Register tools
    for (const tool of config.tools) {
      this.tools.set(tool.config.name, tool);
    }
  }

  /**
   * Create an MCP server exposing the tools.
   */
  createToolServer(config?: Partial<ToolServerConfig>): ToolServer {
    return new MCPToolServer({
      tools: Array.from(this.tools.values()),
      ...config,
    });
  }

  /**
   * Export tools for a specific SDK format.
   */
  exportToolsForSDK(format: ToolExportFormat): unknown[] {
    const tools = Array.from(this.tools.values());
    const defaultContext: Partial<ToolExecutionContext> = {
      agentId: 'export',
      sessionId: 'export',
    };

    switch (format) {
      case 'claude-agent':
        return tools
          .filter(
            (
              tool
            ): tool is typeof tool & {
              handler: NonNullable<typeof tool.handler>;
            } => !!tool.handler
          )
          .map((tool) =>
            specToolToClaudeAgentTool(tool.config, tool.handler, defaultContext)
          );

      case 'opencode':
        return tools.map((tool) => specToolToOpenCodeTool(tool.config));

      case 'mcp':
        return tools.map((tool) => ({
          name: tool.config.name,
          description: tool.config.description ?? '',
          inputSchema: tool.config.schema ?? { type: 'object', properties: {} },
        }));

      case 'openai':
        return tools.map((tool) => ({
          type: 'function',
          function: {
            name: tool.config.name,
            description: tool.config.description ?? '',
            parameters: tool.config.schema ?? {
              type: 'object',
              properties: {},
            },
          },
        }));

      default:
        throw new Error(`Unknown export format: ${format}`);
    }
  }

  /**
   * Create a bridged handler for a specific SDK.
   */
  createBridgedHandler(
    toolName: string,
    _format: ToolExportFormat
  ): ((args: Record<string, unknown>) => Promise<unknown>) | undefined {
    const tool = this.tools.get(toolName);
    if (!tool || !tool.handler) {
      return undefined;
    }

    const handler = tool.handler;

    // Return a simple wrapper that works for any format
    return async (args: Record<string, unknown>) => {
      const context: ToolExecutionContext = {
        agentId: 'bridge',
        sessionId: 'bridge',
      };
      // ToolHandler returns Promise<string>, but bridge expects Promise<unknown>
      // The types are compatible in this direction
      return handler(args, context);
    };
  }

  /**
   * Get all tools.
   */
  getTools(): AgentToolConfig[] {
    return Array.from(this.tools.values()).map((t) => t.config);
  }

  /**
   * Get a specific tool.
   */
  getTool(name: string): AgentToolConfig | undefined {
    return this.tools.get(name)?.config;
  }

  /**
   * Check if a tool exists.
   */
  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Execute a tool.
   */
  async executeTool(
    name: string,
    args: Record<string, unknown>,
    context?: ToolExecutionContext
  ): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    if (!tool.handler) {
      throw new Error(`No handler for tool: ${name}`);
    }

    const fullContext: ToolExecutionContext = {
      agentId: context?.agentId ?? 'consumer',
      sessionId: context?.sessionId ?? 'consumer-session',
      tenantId: context?.tenantId,
      actorId: context?.actorId,
      metadata: context?.metadata,
      signal: context?.signal,
    };

    return await tool.handler(args, fullContext);
  }

  /**
   * Add a tool.
   */
  addTool(config: AgentToolConfig, handler?: ToolHandler): void {
    this.tools.set(config.name, { config, handler });
  }

  /**
   * Remove a tool.
   */
  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }

  /**
   * Get tool count.
   */
  getToolCount(): number {
    return this.tools.size;
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create a new tool consumer.
 */
export function createToolConsumer(config: ToolConsumerConfig): ToolConsumer {
  return new ContractSpecToolConsumer(config);
}

/**
 * Create an MCP tool server from tools.
 */
export function createToolServer(config: ToolServerConfig): ToolServer {
  return new MCPToolServer(config);
}

/**
 * Export tools to a specific SDK format.
 */
export function exportToolsForExternalSDK(
  tools: AgentToolConfig[],
  format: ToolExportFormat
): unknown[] {
  const consumer = new ContractSpecToolConsumer({
    tools: tools.map((config) => ({ config })),
  });
  return consumer.exportToolsForSDK(format);
}
