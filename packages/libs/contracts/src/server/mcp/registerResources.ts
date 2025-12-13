import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ResourceRegistry } from '../../resources';
import type { McpCtxFactories } from './mcpTypes';
import { Buffer } from 'node:buffer';

function mcpResourceMeta(resource: {
  meta: { title: string; description?: string; mimeType: string; tags?: string[] };
}) {
  return {
    title: resource.meta.title,
    description: resource.meta.description,
    mimeType: resource.meta.mimeType,
    _meta: { tags: resource.meta.tags ?? [] },
  };
}

export function registerMcpResources(
  server: McpServer,
  resources: ResourceRegistry,
  ctx: Pick<McpCtxFactories, 'logger' | 'resourceCtx'>
) {
  for (const resource of resources.listTemplates()) {
    ctx.logger.info('Registering resource: ' + resource.meta.uriTemplate);

    server.registerResource(
      // IMPORTANT: must be unique across templates; use full uriTemplate (not just scheme).
      resource.meta.uriTemplate,
      new ResourceTemplate(resource.meta.uriTemplate, { list: undefined }),
      mcpResourceMeta(resource),
      async (_uri, variables) => {
        const parsedArgs = resource.input.parse(variables);
        const out = await resource.resolve(parsedArgs, ctx.resourceCtx());

        if (typeof out.data === 'string') {
          return {
            contents: [
              {
                uri: out.uri,
                mimeType: out.mimeType ?? resource.meta.mimeType,
                text: out.data,
              },
            ],
          };
        }

        return {
          contents: [
            {
              uri: out.uri,
              mimeType: out.mimeType ?? resource.meta.mimeType,
              blob: Buffer.from(out.data).toString('base64'),
            },
          ],
        };
      }
    );

    ctx.logger.info('Registered resource: ' + resource.meta.uriTemplate);
  }
}


