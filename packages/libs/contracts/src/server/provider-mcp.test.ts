import { describe, expect, it } from 'bun:test';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';
import { Logger } from '@lssm/lib.logger';
import { defineResourceTemplate, ResourceRegistry } from '../resources';
import { OperationSpecRegistry } from '../registry';
import { PromptRegistry } from '../promptRegistry';
import { createMcpServer } from './provider-mcp';

describe('createMcpServer (MCP resources)', () => {
  it('does not collide when multiple templates share the same scheme (docs://*)', () => {
    const server = new McpServer({ name: 'test-mcp', version: '1.0.0' });
    const ops = new OperationSpecRegistry();
    const prompts = new PromptRegistry();
    const resources = new ResourceRegistry();

    resources.register(
      defineResourceTemplate({
        meta: {
          uriTemplate: 'docs://list',
          title: 'Docs list',
          description: 'List docs',
          mimeType: 'application/json',
          tags: ['docs'],
        },
        input: z.object({}),
        resolve: async () => ({
          uri: 'docs://list',
          mimeType: 'application/json',
          data: JSON.stringify([{ id: 'a' }]),
        }),
      })
    );

    resources.register(
      defineResourceTemplate({
        meta: {
          uriTemplate: 'docs://doc/{id}',
          title: 'Doc by id',
          description: 'Get doc content',
          mimeType: 'text/markdown',
          tags: ['docs'],
        },
        input: z.object({ id: z.string() }),
        resolve: async ({ id }) => ({
          uri: `docs://doc/${encodeURIComponent(id)}`,
          mimeType: 'text/markdown',
          data: `# ${id}`,
        }),
      })
    );

    const logger = new Logger({
      enableColors: false,
      enableTracing: false,
      enableTiming: false,
      enableContext: false,
    });

    expect(() =>
      createMcpServer(server, ops, resources, prompts, {
        logger,
        toolCtx: () => ({
          actor: 'anonymous',
          decide: async () => ({ effect: 'allow' as const }),
        }),
        promptCtx: () => ({ locale: 'en' }),
        resourceCtx: () => ({ locale: 'en' }),
      })
    ).not.toThrow();
  });
});
