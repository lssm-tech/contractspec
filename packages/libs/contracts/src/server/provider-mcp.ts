import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SpecRegistry } from '../registry';
import type { ResourceRegistry } from '../resources';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { ContractSpec } from '../spec';
import type { PresentationRegistry } from '../presentations';
import { jsonSchemaForPresentation } from '../presentations';
import {
  createDefaultTransformEngine,
  type PresentationDescriptorV2,
  registerBasicValidation,
  registerDefaultReactRenderer,
} from '../presentations.v2';
import type { PromptRegistry } from '../promptRegistry';
import type { HandlerCtx } from '../types';
import { defaultMcpTool, jsonSchemaForSpec } from '../jsonschema';
import type {
  CallToolResult,
  GetPromptResult,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import z from 'zod';

/**
 * Creates a unified Model Context Protocol (MCP) server exposing operations, resources, and prompts.
 *
 * This function takes registries for operations, resources, and prompts, and exposes them as
 * MCP Tools, Resources, and Prompts respectively. It enables AI agents to discover and interact
 * with the application's capabilities.
 *
 * Features:
 * - **Tools**: Exposes `command` operations as executable tools.
 * - **Resources**: Exposes `ResourceRegistry` entries and `PresentationSpec`s (Markdown/JSON) as read-only resources.
 * - **Prompts**: Exposes `PromptRegistry` entries as templated prompts.
 *
 * @param server - The `McpServer` instance to populate.
 * @param ops - Registry containing operations (tools).
 * @param resources - Registry containing data resources.
 * @param prompts - Registry containing prompt templates.
 * @param ctxFactories - Factories to create context for tools, resources, and prompts execution.
 * @returns The populated `McpServer` instance.
 */
export function createMcpServer(
  server: McpServer,
  ops: SpecRegistry,
  resources: ResourceRegistry,
  prompts: PromptRegistry,
  ctxFactories: {
    /** Factory for tool execution context (e.g., system actor) */
    toolCtx: () => HandlerCtx;
    /** Factory for prompt rendering context */
    promptCtx: () => {
      userId?: string | null;
      orgId?: string | null;
      locale?: string;
    };
    /** Factory for resource resolution context */
    resourceCtx: () => {
      userId?: string | null;
      orgId?: string | null;
      locale?: string;
    };
    /** Optional registry for V1 presentations */
    presentations?: PresentationRegistry;
    /** Optional list of V2 presentation descriptors */
    presentationsV2?: PresentationDescriptorV2[];
  }
) {
  /* ---------- Tools (commands) ---------- */
  for (const spec of ops.listSpecs()) {
    if (spec.meta.kind !== 'command') continue; // expose only commands as tools
    const { input } = jsonSchemaForSpec(
      spec as unknown as ContractSpec<AnySchemaModel, AnySchemaModel>
    );
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
      async (args: any, _req: any): Promise<CallToolResult> => {
        const result = await ops.execute(
          spec.meta.name,
          spec.meta.version,
          args ?? {},
          ctxFactories.toolCtx()
        );
        // return { content: [{ type: 'json', json: result }] };
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 4) }],
        };
      }
    );
  }

  /* ---------- Resources (queries/views) ---------- */
  for (const resource of resources.listTemplates()) {
    // server.registerPrompt(
    //   'review-code',
    //   {
    //     title: 'Code Review',
    //     description: 'Review code for best practices and potential issues',
    //     argsSchema: { code: z.string() as any },
    //   },
    //   ({ code }: { code?: string }) => ({
    //     messages: [
    //       {
    //         role: 'user',
    //         content: {
    //           type: 'text',
    //           text: `Please review this code:\n\n${code}`,
    //         },
    //       },
    //     ],
    //   })
    // );

    (server as any).registerResource(
      resource.meta.uriTemplate.split(':')[0]!,
      new ResourceTemplate(resource.meta.uriTemplate, {} as any),
      {
        // name: resource.meta.title,
        description: resource.meta.description,
        inputSchema: zodToJsonSchema(resource.input, {
          // metadata: `${op.meta.name}.input.v${op.meta.version}`,
        }),
      },
      async (_uri: any, args: any, _req: any) => {
        const ctx = ctxFactories.resourceCtx();
        const out = await resource.resolve(args, ctx);
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
              blob: out.data.toString(),
            },
          ],
        };
      }
    );
  }

  /* ---------- Presentations as resources (markdown/data) with content negotiation ---------- */
  const __presentations = ctxFactories.presentations;
  const __presentationsV2 = ctxFactories.presentationsV2;
  if (__presentations) {
    const engine = registerBasicValidation(
      registerDefaultReactRenderer(createDefaultTransformEngine())
    );
    for (const p of __presentations.list()) {
      const baseKey = `presentation.${p.meta.name.replace(/\./g, '_')}.v${p.meta.version}`;
      const baseUri = `presentation://${p.meta.name}/v${p.meta.version}`;

      // Generic metadata
      (server as any).registerResource(
        baseKey,
        new ResourceTemplate(baseUri, {} as any),
        {
          description: p.meta.description ?? 'Presentation',
          inputSchema: z.toJSONSchema(z.object({})),
        },
        async (_uri: any, _args: any, _req: any) => {
          if (p.content.kind === 'markdown') {
            const text = p.content.content
              ? p.content.content
              : `See resource: ${p.content.resourceUri ?? ''}`;
            return {
              contents: [
                {
                  uri: baseUri,
                  mimeType: 'text/markdown',
                  text,
                },
              ],
            };
          }
          if (p.content.kind === 'data') {
            const schema = jsonSchemaForPresentation(p);
            return {
              contents: [
                {
                  uri: baseUri,
                  mimeType: 'application/json',
                  text: JSON.stringify(schema, null, 2),
                },
              ],
            };
          }
          // web_component: metadata only for now
          const metaOnly = {
            name: p.meta.name,
            version: p.meta.version,
            kind: p.content.kind,
            description: p.meta.description ?? '',
          };
          return {
            contents: [
              {
                uri: baseUri,
                mimeType: 'application/json',
                text: JSON.stringify(metaOnly, null, 2),
              },
            ],
          };
        }
      );

      // Negotiated variants
      const variants: {
        ext: string;
        target: 'markdown' | 'application/json' | 'application/xml';
      }[] = [
        { ext: '.md', target: 'markdown' },
        { ext: '.json', target: 'application/json' },
        { ext: '.xml', target: 'application/xml' },
      ];
      for (const v of variants) {
        const key = `${baseKey}${v.ext}`;
        const uri = `${baseUri}${v.ext}`;
        (server as any).registerResource(
          key,
          new ResourceTemplate(uri, {} as any),
          {
            description: `${p.meta.description ?? 'Presentation'} (${v.ext})`,
            inputSchema: z.toJSONSchema(z.object({})),
          },
          async () => {
            // Use V2 engine to render a normalized JSON snapshot; if p is V1, fallback to jsonSchemaForPresentation
            if (p.content.kind === 'markdown' && v.target === 'markdown') {
              const text =
                p.content.content ??
                `See resource: ${p.content.resourceUri ?? ''}`;
              return { contents: [{ uri, mimeType: 'text/markdown', text }] };
            }
            if (p.content.kind === 'data' && v.target === 'application/json') {
              return {
                contents: [
                  {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(jsonSchemaForPresentation(p), null, 2),
                  },
                ],
              };
            }
            // Default: represent as JSON snapshot
            const jsonText = JSON.stringify(
              { meta: p.meta, content: p.content },
              null,
              2
            );
            if (v.target === 'application/json') {
              return {
                contents: [
                  { uri, mimeType: 'application/json', text: jsonText },
                ],
              };
            }
            if (v.target === 'application/xml') {
              const xml = `<presentation name="${p.meta.name}" version="${p.meta.version}"><json>${encodeURIComponent(jsonText)}</json></presentation>`;
              return {
                contents: [{ uri, mimeType: 'application/xml', text: xml }],
              };
            }
            // markdown fallback
            return {
              contents: [
                {
                  uri,
                  mimeType: 'text/markdown',
                  text: 'Unsupported presentation for markdown',
                },
              ],
            };
          }
        );
      }
    }
  }

  // V2: register descriptors using transform engine (same scheme/negotiation)
  if (__presentationsV2 && __presentationsV2.length) {
    const engine = registerBasicValidation(
      registerDefaultReactRenderer(createDefaultTransformEngine())
    );
    for (const d of __presentationsV2) {
      const baseKey = `presentation.${d.meta.name.replace(/\./g, '_')}.v${d.meta.version}`;
      const baseUri = `presentation://${d.meta.name}/v${d.meta.version}`;

      (server as any).registerResource(
        baseKey,
        new ResourceTemplate(baseUri, {} as any),
        {
          description: d.meta.description ?? 'Presentation',
          inputSchema: z.toJSONSchema(z.object({})),
        },
        async () => {
          const jsonText = JSON.stringify(
            { meta: d.meta, source: d.source, targets: d.targets },
            null,
            2
          );
          return {
            contents: [
              { uri: baseUri, mimeType: 'application/json', text: jsonText },
            ],
          };
        }
      );

      const variants: {
        ext: string;
        target: 'markdown' | 'application/json' | 'application/xml';
      }[] = [
        { ext: '.md', target: 'markdown' },
        { ext: '.json', target: 'application/json' },
        { ext: '.xml', target: 'application/xml' },
      ];
      for (const v of variants) {
        const key = `${baseKey}${v.ext}`;
        const uri = `${baseUri}${v.ext}`;
        (server as any).registerResource(
          key,
          new ResourceTemplate(uri, {} as any),
          {
            description: `${d.meta.description ?? 'Presentation'} (${v.ext})`,
            inputSchema: z.toJSONSchema(z.object({})),
          },
          async () => {
            const out = await engine.render(v.target, d);
            return {
              contents: [
                {
                  uri,
                  mimeType:
                    (out as any).mimeType ??
                    (v.target === 'markdown' ? 'text/markdown' : v.target),
                  text: (out as any).body ?? String(out),
                },
              ],
            };
          }
        );
      }
    }
  }

  /* ---------- Prompts ---------- */
  // for (const prompt of prompts.list()) {
  for (const prompt of prompts.list()) {
    server.registerPrompt(
      prompt.meta.name,
      {
        title: prompt.meta.title,
        description: prompt.meta.title,
        argsSchema: zodToJsonSchema(prompt.input) as any,
      },
      async (args: any, _extra: any): Promise<GetPromptResult> => {
        const link = (tpl: string, vars: Record<string, string | number>) => {
          let out = tpl;
          for (const [k, v] of Object.entries(vars))
            out = out.replace(
              new RegExp(`\\{${k}\\}`, 'g'),
              encodeURIComponent(String(v))
            );
          return out;
        };

        const parts = await prompt.render(prompt.input.parse(args), {
          ...ctxFactories.promptCtx(),
          link,
        });

        // MCP prompt shape: messages[{role, content[]}]; we return a single "system" text chunk + referenced resources
        const contents: GetPromptResult['messages'][number]['content'][] =
          parts.map(
            (p) =>
              p.type === 'text'
                ? { type: 'text', text: p.text }
                : {
                    type: 'text',
                    text: `See resource: ${p.title ?? p.uri}\nURI: ${p.uri}`,
                  } // simple way to reference; clients may fetch resources directly
          );

        return {
          messages: [{ role: 'assistant', content: contents[0]! }],
          description: prompt.meta.description,
        };
      }
    );
  }

  return server;
}
