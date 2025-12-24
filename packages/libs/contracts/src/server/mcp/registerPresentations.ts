import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpCtxFactories } from './mcpTypes';
import {
  createDefaultTransformEngine,
  registerBasicValidation,
  registerDefaultReactRenderer,
} from '../../presentations/';

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
  /* ---------- Presentations as resources using TransformEngine ---------- */
  const __presentations = ctx.presentations;
  const __presentationsV2 = ctx.presentationsV2;

  // Create a shared engine for both presentation sources
  const engine = registerBasicValidation(
    registerDefaultReactRenderer(createDefaultTransformEngine())
  );

  // Register presentations from PresentationRegistry
  if (__presentations) {
    for (const p of __presentations.list()) {
      const baseKey = `presentation.${p.meta.key.replace(/\./g, '_')}.v${p.meta.version}`;
      const baseUri = `presentation://${p.meta.key}/v${p.meta.version}`;

      ctx.logger.info(`Registering presentation ${baseUri} for ${baseKey}`);

      server.registerResource(
        baseKey,
        baseUri,
        {
          title: `${p.meta.key} v${p.meta.version}`,
          description: p.meta.description ?? 'Presentation',
          mimeType: 'application/json',
        },
        async () => {
          const jsonText = JSON.stringify(
            { meta: p.meta, source: p.source, targets: p.targets },
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
            title: `${p.meta.key} v${p.meta.version} (${v.ext})`,
            description: `${p.meta.description ?? 'Presentation'} (${v.ext})`,
          },
          async () => {
            const out = await engine.render(v.target, p);
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

  /* ---------- V2 presentations list (presentationsV2 array) ---------- */
  if (__presentationsV2 && __presentationsV2.length) {
    for (const d of __presentationsV2) {
      const baseKey = `presentation.${d.meta.key.replace(/\./g, '_')}.v${d.meta.version}`;
      const baseUri = `presentation://${d.meta.key}/v${d.meta.version}`;

      ctx.logger.info(
        `Registering presentation descriptor ${baseUri} for ${baseKey}`
      );

      server.registerResource(
        baseKey,
        baseUri,
        {
          title: `${d.meta.key} v${d.meta.version}`,
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
            title: `${d.meta.key} v${d.meta.version} (${v.ext})`,
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
