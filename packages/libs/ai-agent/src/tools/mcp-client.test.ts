import { afterEach, describe, expect, it } from 'bun:test';
import type { Tool } from 'ai';
import { buildMcpTransport, prefixToolNames } from './mcp-client-helpers';
import { createMcpToolsets, type McpClientConfig } from './mcp-client';

const MCP_TOKEN_ENV = 'MCP_CLIENT_TEST_TOKEN';

describe('mcp-client helpers', () => {
  afterEach(() => {
    process.env[MCP_TOKEN_ENV] = '';
  });

  it('builds stdio transport from command config', () => {
    const transport = buildMcpTransport({
      name: 'filesystem',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
    });

    expect('type' in transport).toBe(false);
  });

  it('builds remote transport with bearer token from env var', () => {
    process.env[MCP_TOKEN_ENV] = 'test-token';

    const transport = buildMcpTransport({
      name: 'analytics',
      transport: 'http',
      url: 'https://mcp.example.com',
      accessTokenEnvVar: MCP_TOKEN_ENV,
    });

    expect('type' in transport).toBe(true);
    if ('type' in transport) {
      expect(transport.type).toBe('http');
      expect(transport.headers?.Authorization).toBe('Bearer test-token');
    }
  });

  it('prefixes MCP tool names when toolPrefix is configured', () => {
    const tool = {
      execute: async () => 'ok',
    } as unknown as Tool<unknown, unknown>;

    const prefixed = prefixToolNames(
      {
        name: 'remote',
        transport: 'sse',
        url: 'https://example.com/sse',
        toolPrefix: 'remote',
      },
      {
        query: tool,
      }
    );

    expect(Object.keys(prefixed)).toEqual(['remote_query']);
  });

  it('throws on missing remote URL', () => {
    const invalid = {
      name: 'invalid-remote',
      transport: 'http',
      url: '   ',
    } as unknown as McpClientConfig;

    expect(() => buildMcpTransport(invalid)).toThrow();
  });

  it('returns an empty toolset when no MCP servers are configured', async () => {
    const result = await createMcpToolsets([]);

    expect(result.tools).toEqual({});
    expect(result.serverToolNames).toEqual({});
    await result.cleanup();
  });
});
