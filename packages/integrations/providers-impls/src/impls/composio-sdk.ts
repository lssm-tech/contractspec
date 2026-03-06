import type {
  ComposioConfig,
  ComposioToolProxy,
  ComposioToolResult,
  ComposioToolDescriptor,
} from './composio-types';

/**
 * Composio Native SDK provider.
 *
 * Uses @composio/core directly for advanced scenarios:
 * tool search, auth management, and direct tool execution.
 */
export class ComposioSdkProvider implements ComposioToolProxy {
  private readonly config: ComposioConfig;
  private client: ComposioSdkClient | undefined;

  constructor(config: ComposioConfig) {
    this.config = config;
  }

  async executeTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<ComposioToolResult> {
    const client = await this.getClient();
    const userId = (args._userId as string) ?? 'default';

    try {
      const entity = await client.getEntity(userId);
      const result = await entity.execute(toolName, args);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async searchTools(query: string): Promise<ComposioToolDescriptor[]> {
    const client = await this.getClient();

    try {
      const tools = await client.actions.list({ query, limit: 20 });

      return tools.map((t: ComposioAction) => ({
        name: t.name,
        description: t.description ?? '',
        toolkit: t.appName ?? '',
        parameters: t.parameters ?? {},
      }));
    } catch {
      return [];
    }
  }

  async getConnectedAccounts(
    userId: string
  ): Promise<ComposioConnectedAccount[]> {
    const client = await this.getClient();

    try {
      const entity = await client.getEntity(userId);
      const connections = await entity.getConnections();
      return connections.map((c: RawConnection) => ({
        id: c.id,
        appName: c.appName,
        status: c.status,
      }));
    } catch {
      return [];
    }
  }

  async getMcpConfig(
    userId: string
  ): Promise<{ url: string; headers: Record<string, string> } | undefined> {
    const client = await this.getClient();

    try {
      const entity = await client.getEntity(userId);
      return {
        url: entity.getMcpUrl(),
        headers: entity.getMcpHeaders(),
      };
    } catch {
      return undefined;
    }
  }

  private async getClient(): Promise<ComposioSdkClient> {
    if (this.client) return this.client;

    const { Composio } = await import('@composio/core');
    this.client = new Composio({
      apiKey: this.config.apiKey,
      ...(this.config.baseUrl ? { baseUrl: this.config.baseUrl } : {}),
    }) as ComposioSdkClient;

    return this.client;
  }
}

export interface ComposioConnectedAccount {
  id: string;
  appName: string;
  status: string;
}

interface ComposioSdkClient {
  getEntity(userId: string): Promise<ComposioSdkEntity>;
  actions: {
    list(params: { query: string; limit: number }): Promise<ComposioAction[]>;
  };
}

interface ComposioSdkEntity {
  execute(toolName: string, args: Record<string, unknown>): Promise<unknown>;
  getConnections(): Promise<RawConnection[]>;
  getMcpUrl(): string;
  getMcpHeaders(): Record<string, string>;
}

interface ComposioAction {
  name: string;
  description?: string;
  appName?: string;
  parameters?: Record<string, unknown>;
}

interface RawConnection {
  id: string;
  appName: string;
  status: string;
}
