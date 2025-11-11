import type { SpecRegistry } from '../registry';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { ContractSpec } from '../spec';
import type { ResourceRefDescriptor } from '../resources';
import type { HandlerCtx } from '../types';
import { createMcpHandler } from 'mcp-handler';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { defaultMcpTool, jsonSchemaForSpec } from '../jsonschema';
import type {
  CallToolResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';

export function makeNextMcpServerFromRegistry(
  reg: SpecRegistry,
  ctxFactory: () => HandlerCtx
) {
  const handler = createMcpHandler(
    (server) => {
      for (const spec of reg.listSpecs()) {
        const { input, output, meta } = jsonSchemaForSpec(
          spec as unknown as ContractSpec<AnySchemaModel, AnySchemaModel>
        );

        if (meta.kind === 'query') {
          const resourceName =
            spec.transport?.mcp?.toolName ??
            defaultMcpTool(spec.meta.name, spec.meta.version);

          server.registerResource(
            resourceName,
            new ResourceTemplate('users://{userId}/profile', {
              list: undefined,
            }),

            {
              // name: resourceName,
              description: spec.meta.description,
              inputSchema: input,
            },
            async (uri: URL, args, _req): Promise<ReadResourceResult> => {
              const result = await reg.execute(
                spec.meta.name,
                spec.meta.version,
                args ?? {},
                ctxFactory()
              );
              // return { content: [{ type: 'json', json: result }] };
              return { contents: [{ uri: uri.href, text: String(result) }] };
            }
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
              inputSchema: input as any,
            },
            async (args, _req): Promise<CallToolResult> => {
              const result = await reg.execute(
                spec.meta.name,
                spec.meta.version,
                args ?? {},
                ctxFactory()
              );
              // return { content: [{ type: 'json', json: result }] };
              return { content: [{ type: 'text', text: String(result) }] };
            }
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
