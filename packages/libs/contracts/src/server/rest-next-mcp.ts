import type { SpecRegistry } from '../registry';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { ContractSpec } from '../spec';
import type { HandlerCtx } from '../types';
import { createMcpHandler } from 'mcp-handler';
import type {
  ReadResourceTemplateCallback,
  ToolCallback,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { defaultMcpTool, jsonSchemaForSpec } from '../jsonschema';

export function makeNextMcpServerFromRegistry(
  reg: SpecRegistry,
  ctxFactory: () => HandlerCtx
) {
  const handler = createMcpHandler(
    (server) => {
      for (const spec of reg.listSpecs()) {
        const { input, meta } = jsonSchemaForSpec(
          spec as unknown as ContractSpec<AnySchemaModel, AnySchemaModel>
        );

        if (meta.kind === 'query') {
          const resourceName =
            spec.transport?.mcp?.toolName ??
            defaultMcpTool(spec.meta.name, spec.meta.version);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (server as any).registerResource(
            resourceName,
            new ResourceTemplate('users://{userId}/profile', {
              list: undefined,
            }),
            {
              // name: resourceName,
              description: spec.meta.description,
              inputSchema: input,
            },
            (async (uri: URL, args, _req) => {
              const result = await reg.execute(
                spec.meta.name,
                spec.meta.version,
                args ?? {},
                ctxFactory()
              );
              // return { content: [{ type: 'json', json: result }] };
              return { contents: [{ uri: uri.href, text: String(result) }] };
            }) as ReadResourceTemplateCallback
          );
        } else if (meta.kind === 'command') {
          const toolName =
            spec.transport?.mcp?.toolName ??
            defaultMcpTool(spec.meta.name, spec.meta.version);

          server.registerTool(
            toolName,
            {
              // name: toolName,
              description: spec.meta.description,
              inputSchema: input as never,
            },
            (async (args: unknown, _req: unknown) => {
              const result = await reg.execute(
                spec.meta.name,
                spec.meta.version,
                args ?? {},
                ctxFactory()
              );
              // return { content: [{ type: 'json', json: result }] };
              return { content: [{ type: 'text', text: String(result) }] };
            }) as ToolCallback
          );
        } else {
          throw new Error(`Unsupported kind: ${meta.kind}`);
        }
      }
    },
    {},
    { basePath: '/api' }
  );

  return { GET: handler, POST: handler, DELETE: handler };
}
