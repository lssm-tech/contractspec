import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpCtxFactories } from './mcpTypes';
import { jsonSchemaForPresentation } from '../../presentations';
import {
  createDefaultTransformEngine,
  registerBasicValidation,
  registerDefaultReactRenderer,
} from '../../presentations.v2';

function isEngineRenderOutput(
  x: unknown
): x is { mimeType?: string; body: string } {
  if (!x || typeof x !== 'object') return false;
  return 'body' in x && typeof (x as { body?: unknown }).body === 'string';
}

export function registerMcpPresentations(
  server: McpServer,
  ctx: Pick<McpCtxFactories, 'logger' | 'presentations' | 'presentationsV2'>
) {
  /* ---------- Presentations as resources (markdown/data) with content negotiation ---------- */
  const __presentations = ctx.presentations;
  const __presentationsV2 = ctx.presentationsV2;

  if (__presentations) {
    for (const p of __presentations.list()) {
      const baseKey = `presentation.${p.meta.name.replace(/\./g, '_')}.v${p.meta.version}`;
      const baseUri = `presentation://${p.meta.name}/v${p.meta.version}`;

      server.registerResource(
        baseKey,
        baseUri,
        {
          title: `${p.meta.name} v${p.meta.version}`,
          description: p.meta.description ?? 'Presentation',
        },
        async () => {
          if (p.content.kind === 'markdown') {
            const text = p.content.content
              ? p.content.content
              : `See resource: ${p.content.resourceUri ?? ''}`;
            return {
              contents: [{ uri: baseUri, mimeType: 'text/markdown', text }],
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

        ctx.logger.info(`Registering presentation resource ${uri} for ${key}`);

        server.registerResource(
          key,
          uri,
          {
            title: `${p.meta.name} v${p.meta.version} (${v.ext})`,
            description: `${p.meta.description ?? 'Presentation'} (${v.ext})`,
          },
          async () => {
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
              const xml = `<presentation name="${p.meta.name}" version="${p.meta.version}"><json>${encodeURIComponent(
                jsonText
              )}</json></presentation>`;
              return {
                contents: [{ uri, mimeType: 'application/xml', text: xml }],
              };
            }

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

  /* ---------- V2 presentations as resources (markdown/json/xml) ---------- */
  if (__presentationsV2 && __presentationsV2.length) {
    const engine = registerBasicValidation(
      registerDefaultReactRenderer(createDefaultTransformEngine())
    );

    for (const d of __presentationsV2) {
      const baseKey = `presentation.${d.meta.name.replace(/\./g, '_')}.v${d.meta.version}`;
      const baseUri = `presentation://${d.meta.name}/v${d.meta.version}`;

      ctx.logger.info(
        `Registering presentation descriptor ${baseUri} for ${baseKey}`
      );

      server.registerResource(
        baseKey,
        baseUri,
        {
          title: `${d.meta.name} v${d.meta.version}`,
          description: d.meta.description ?? 'Presentation',
          mimeType: 'application/json',
        },
        async () => {
          const jsonText = JSON.stringify(
            { meta: d.meta, source: d.source, targets: d.targets },
            null,
            2
          );
          return {
            contents: [
              {
                uri: baseUri,
                mimeType: 'application/json',
                text: jsonText,
              },
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

        server.registerResource(
          key,
          uri,
          {
            title: `${d.meta.name} v${d.meta.version} (${v.ext})`,
            description: `${d.meta.description ?? 'Presentation'} (${v.ext})`,
          },
          async () => {
            const out = await engine.render(v.target, d);
            const mimeType =
              isEngineRenderOutput(out) && out.mimeType
                ? out.mimeType
                : v.target === 'markdown'
                  ? 'text/markdown'
                  : v.target;
            const text =
              isEngineRenderOutput(out) && typeof out.body === 'string'
                ? out.body
                : String(out);
            return { contents: [{ uri, mimeType, text }] };
          }
        );
      }
    }
  }
}
