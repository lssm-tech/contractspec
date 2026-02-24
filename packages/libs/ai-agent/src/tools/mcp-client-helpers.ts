import type { OAuthClientProvider } from '@ai-sdk/mcp';
import {
  Experimental_StdioMCPTransport as StdioClientTransport,
  type StdioConfig,
} from '@ai-sdk/mcp/mcp-stdio';
import type {
  McpClientConfig,
  McpRemoteClientConfig,
  McpStdioClientConfig,
  McpTransportType,
} from './mcp-client';

export type ResolvedMcpTransport =
  | StdioClientTransport
  | {
      type: 'sse' | 'http';
      url: string;
      headers?: Record<string, string>;
      authProvider?: OAuthClientProvider;
    };

export function buildMcpTransport(
  config: McpClientConfig
): ResolvedMcpTransport {
  const transport = resolveTransportType(config);

  if (transport === 'stdio') {
    const stdioConfig = resolveStdioConfig(config);
    return new StdioClientTransport(stdioConfig);
  }

  const remoteConfig = config as McpRemoteClientConfig;
  const headers = resolveRemoteHeaders(remoteConfig);

  const remoteTransport: ResolvedMcpTransport = {
    type: transport,
    url: requireNonEmptyString(remoteConfig.url, 'url', config.name),
  };

  if (headers) {
    remoteTransport.headers = headers;
  }
  if (remoteConfig.authProvider) {
    remoteTransport.authProvider = remoteConfig.authProvider;
  }

  return remoteTransport;
}

export function prefixToolNames<TTool>(
  config: McpClientConfig,
  tools: Record<string, TTool>
): Record<string, TTool> {
  const prefix = config.toolPrefix?.trim();
  if (!prefix) {
    return tools;
  }

  const prefixedTools: Record<string, TTool> = {};
  for (const [toolName, tool] of Object.entries(tools)) {
    prefixedTools[`${prefix}_${toolName}`] = tool;
  }

  return prefixedTools;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function resolveTransportType(config: McpClientConfig): McpTransportType {
  return config.transport ?? 'stdio';
}

function resolveStdioConfig(config: McpClientConfig): StdioConfig {
  const stdioConfig = config as Partial<McpStdioClientConfig>;
  return {
    command: requireNonEmptyString(stdioConfig.command, 'command', config.name),
    args: stdioConfig.args,
    env: stdioConfig.env,
    cwd: stdioConfig.cwd,
  };
}

function resolveRemoteHeaders(
  config: McpRemoteClientConfig
): Record<string, string> | undefined {
  const headers: Record<string, string> = {
    ...(config.headers ?? {}),
  };

  const accessToken =
    config.accessToken ?? resolveEnvToken(config.accessTokenEnvVar);
  if (accessToken && headers.Authorization === undefined) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

function resolveEnvToken(envVarName?: string): string | undefined {
  if (!envVarName) {
    return undefined;
  }

  const value = process.env[envVarName];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function requireNonEmptyString(
  value: string | undefined,
  field: string,
  serverName: string
): string {
  if (!value) {
    throw new Error(
      `MCP server "${serverName}" is missing required "${field}".`
    );
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`MCP server "${serverName}" has an empty "${field}".`);
  }

  return trimmed;
}
