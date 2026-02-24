import { randomUUID } from 'node:crypto';
import {
  createMcpToolsets,
  type McpClientConfig,
} from '@contractspec/lib.ai-agent/tools/mcp-client';

type IntegrationHubMcpMode = 'list' | 'call';

interface IntegrationHubMcpOutput {
  mode: IntegrationHubMcpMode;
  server: {
    name: string;
    transport: 'stdio' | 'http' | 'sse';
  };
  tools: string[];
  toolCall?: {
    name: string;
    args: Record<string, unknown>;
    output: unknown;
  };
}

const DEFAULT_STDIO_ARGS = [
  '-y',
  '@modelcontextprotocol/server-filesystem',
  '.',
];

export async function runIntegrationHubMcpExampleFromEnv(): Promise<IntegrationHubMcpOutput> {
  const mode = resolveMode();
  const config = buildMcpConfigFromEnv();

  const toolset = await createMcpToolsets([config], {
    onNameCollision: 'error',
  });

  try {
    const toolNames = Object.keys(toolset.tools).sort();
    const output: IntegrationHubMcpOutput = {
      mode,
      server: {
        name: config.name,
        transport: config.transport ?? 'stdio',
      },
      tools: toolNames,
    };

    if (mode === 'call') {
      const toolName = requireEnv('CONTRACTSPEC_INTEGRATION_HUB_MCP_TOOL_NAME');
      const toolArgs = parseRecordEnvOrDefault(
        'CONTRACTSPEC_INTEGRATION_HUB_MCP_TOOL_ARGS_JSON',
        {}
      );

      const tool = toolset.tools[toolName];
      if (!tool?.execute) {
        throw new Error(
          `Tool "${toolName}" was not found. Available tools: ${toolNames.join(', ')}`
        );
      }

      const toolOutput = await tool.execute(toolArgs, {
        toolCallId: `integration-hub-${randomUUID()}`,
        messages: [],
      });

      output.toolCall = {
        name: toolName,
        args: toolArgs,
        output: toolOutput,
      };
    }

    return output;
  } finally {
    await toolset.cleanup().catch(() => undefined);
  }
}

function buildMcpConfigFromEnv(): McpClientConfig {
  const name =
    process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_NAME ?? 'filesystem';
  const transport = resolveTransport();
  const toolPrefix = process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_TOOL_PREFIX;

  if (transport === 'stdio') {
    return {
      name,
      transport,
      command: process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_COMMAND ?? 'npx',
      args: parseStringArrayEnv(
        'CONTRACTSPEC_INTEGRATION_HUB_MCP_ARGS_JSON',
        DEFAULT_STDIO_ARGS
      ),
      toolPrefix,
    };
  }

  const accessToken = process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_ACCESS_TOKEN;
  const accessTokenEnvVar =
    process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_ACCESS_TOKEN_ENV;

  return {
    name,
    transport,
    url: requireEnv('CONTRACTSPEC_INTEGRATION_HUB_MCP_URL'),
    headers: parseStringRecordEnv(
      'CONTRACTSPEC_INTEGRATION_HUB_MCP_HEADERS_JSON'
    ),
    accessToken,
    accessTokenEnvVar,
    toolPrefix,
  };
}

function resolveMode(): IntegrationHubMcpMode {
  const rawMode =
    process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_MODE?.toLowerCase() ?? 'list';
  if (rawMode === 'list' || rawMode === 'call') {
    return rawMode;
  }

  throw new Error(
    `Unsupported CONTRACTSPEC_INTEGRATION_HUB_MCP_MODE: ${rawMode}. Use "list" or "call".`
  );
}

function resolveTransport(): 'stdio' | 'http' | 'sse' {
  const rawTransport =
    process.env.CONTRACTSPEC_INTEGRATION_HUB_MCP_TRANSPORT?.toLowerCase() ??
    'stdio';

  if (
    rawTransport === 'stdio' ||
    rawTransport === 'http' ||
    rawTransport === 'sse'
  ) {
    return rawTransport;
  }

  throw new Error(
    `Unsupported CONTRACTSPEC_INTEGRATION_HUB_MCP_TRANSPORT: ${rawTransport}. Use "stdio", "http", or "sse".`
  );
}

function parseStringArrayEnv(key: string, fallback: string[]): string[] {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  const parsed = parseJsonEnv(key);
  if (
    !Array.isArray(parsed) ||
    parsed.some((value) => typeof value !== 'string')
  ) {
    throw new Error(`${key} must be a JSON string array.`);
  }

  return parsed;
}

function parseRecordEnv(key: string): Record<string, unknown> | undefined {
  const raw = process.env[key];
  if (!raw) {
    return undefined;
  }

  const parsed = parseJsonEnv(key);
  if (!isRecord(parsed)) {
    throw new Error(`${key} must be a JSON object.`);
  }

  return parsed;
}

function parseRecordEnvOrDefault(
  key: string,
  fallback: Record<string, unknown>
): Record<string, unknown> {
  return parseRecordEnv(key) ?? fallback;
}

function parseStringRecordEnv(key: string): Record<string, string> | undefined {
  const parsed = parseRecordEnv(key);
  if (!parsed) {
    return undefined;
  }

  const entries = Object.entries(parsed);
  const invalidEntry = entries.find(([, value]) => typeof value !== 'string');
  if (invalidEntry) {
    throw new Error(`${key} must contain only string values.`);
  }

  return Object.fromEntries(entries) as Record<string, string>;
}

function parseJsonEnv(key: string): unknown {
  const raw = process.env[key];
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`${key} contains invalid JSON.`);
  }
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
