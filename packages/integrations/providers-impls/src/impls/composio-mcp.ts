import type {
  ComposioConfig,
  ComposioSessionInfo,
  ComposioToolProxy,
  ComposioToolResult,
  ComposioToolDescriptor,
} from './composio-types';
import { isSessionExpired, resolveToolkit } from './composio-types';

/**
 * Composio MCP transport provider.
 *
 * Creates Composio sessions and exposes tools via the MCP protocol,
 * leveraging the existing MCP client infrastructure in lib.ai-agent.
 * Sessions are cached per userId with a 30-minute TTL.
 */
export class ComposioMcpProvider implements ComposioToolProxy {
  private readonly sessions = new Map<string, ComposioSessionInfo>();
  private readonly config: ComposioConfig;
  private composioInstance: ComposioClient | undefined;

  constructor(config: ComposioConfig) {
    this.config = config;
  }

  async executeTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<ComposioToolResult> {
    const userId = (args._userId as string) ?? 'default';
    const session = await this.getOrCreateSession(userId);

    try {
      const response = await fetch(session.mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...session.mcpHeaders,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: crypto.randomUUID(),
          method: 'tools/call',
          params: { name: toolName, arguments: args },
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Composio MCP call failed: ${response.status} ${response.statusText}`,
        };
      }

      const result = (await response.json()) as JsonRpcResponse;
      if (result.error) {
        return {
          success: false,
          error: result.error.message ?? 'Unknown MCP error',
        };
      }

      return { success: true, data: result.result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async searchTools(query: string): Promise<ComposioToolDescriptor[]> {
    const session = await this.getOrCreateSession('default');

    try {
      const response = await fetch(session.mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...session.mcpHeaders,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: crypto.randomUUID(),
          method: 'tools/list',
          params: {},
        }),
      });

      if (!response.ok) return [];

      const result = (await response.json()) as JsonRpcToolsListResponse;
      const tools = result.result?.tools ?? [];

      return tools
        .filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            (t.description ?? '').toLowerCase().includes(query.toLowerCase())
        )
        .map((t) => ({
          name: t.name,
          description: t.description ?? '',
          toolkit: resolveToolkit(t.name.split('_')[0]?.toLowerCase() ?? ''),
          parameters: t.inputSchema ?? {},
        }));
    } catch {
      return [];
    }
  }

  getMcpConfig(
    userId: string
  ): { url: string; headers: Record<string, string> } | undefined {
    const session = this.sessions.get(userId);
    if (!session || isSessionExpired(session)) return undefined;
    return { url: session.mcpUrl, headers: session.mcpHeaders };
  }

  private async getOrCreateSession(
    userId: string
  ): Promise<ComposioSessionInfo> {
    const existing = this.sessions.get(userId);
    if (existing && !isSessionExpired(existing)) {
      return existing;
    }

    const client = await this.getClient();
    const entity = await client.getEntity(userId);
    const mcpUrl = entity.getMcpUrl();
    const mcpHeaders = entity.getMcpHeaders();

    const session: ComposioSessionInfo = {
      userId,
      mcpUrl,
      mcpHeaders,
      createdAt: Date.now(),
    };

    this.sessions.set(userId, session);
    return session;
  }

  private async getClient(): Promise<ComposioClient> {
    if (this.composioInstance) return this.composioInstance;

    const { Composio } = await import('@composio/core');
    this.composioInstance = new Composio({
      apiKey: this.config.apiKey,
      ...(this.config.baseUrl ? { baseUrl: this.config.baseUrl } : {}),
    }) as unknown as ComposioClient;

    return this.composioInstance;
  }
}

interface ComposioClient {
  getEntity(userId: string): Promise<ComposioEntity>;
}

interface ComposioEntity {
  getMcpUrl(): string;
  getMcpHeaders(): Record<string, string>;
}

interface JsonRpcResponse {
  result?: unknown;
  error?: { code?: number; message?: string };
}

interface JsonRpcToolsListResponse {
  result?: {
    tools?: {
      name: string;
      description?: string;
      inputSchema?: Record<string, unknown>;
    }[];
  };
}
