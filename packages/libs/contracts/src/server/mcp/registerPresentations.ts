import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpCtxFactories } from './mcpTypes';
import {
  createDefaultTransformEngine,
  registerBasicValidation,
  registerDefaultReactRenderer,
} from '../../presentations/';
import { sanitizeMcpName } from '../../jsonschema';

function isEngineRenderOutput(
  x: unknown
): x is { mimeType?: string; body: string } {
  if (!x || typeof x !== 'object') return false;
  return 'body' in x && typeof (x as { body?: unknown }).body === 'string';
}

export function registerMcpPresentations(
  server: McpServer,
  ctx: Pick<McpCtxFactories, 'logger' | 'presentations'>
) {
  if (!ctx.presentations?.count()) {
    return;
  }

  // Create a shared engine for both presentation sources
  const engine = registerBasicValidation(
    registerDefaultReactRenderer(createDefaultTransformEngine())
  );

  // Register presentations from PresentationRegistry
  for (const presentationSpec of ctx.presentations.list()) {
    const baseKey = sanitizeMcpName(
      `presentation_${presentationSpec.meta.key}_v${presentationSpec.meta.version}`
    );
    const baseUri = `presentation://${presentationSpec.meta.key}/v${presentationSpec.meta.version}`;

    ctx.logger.debug(`Registering presentation ${baseUri} for ${baseKey}`);

    server.registerResource(
      baseKey,
      baseUri,
      {
        title: `${presentationSpec.meta.key} v${presentationSpec.meta.version}`,
        description: presentationSpec.meta.description ?? 'Presentation',
        mimeType: 'application/json',
      },
      async () => {
        const jsonText = JSON.stringify(
          {
            meta: presentationSpec.meta,
            source: presentationSpec.source,
            targets: presentationSpec.targets,
          },
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
      // { ext: '.json', target: 'application/json' },
      // { ext: '.xml', target: 'application/xml' },
    ];

    for (const v of variants) {
      const key = `${baseKey}${v.ext}`;
      const uri = `${baseUri}${v.ext}`;

      server.registerResource(
        key,
        uri,
        {
          title: `${presentationSpec.meta.key} v${presentationSpec.meta.version} (${v.ext})`,
          description: `${presentationSpec.meta.description ?? 'Presentation'} (${v.ext})`,
        },
        async () => {
          const out = await engine.render(v.target, presentationSpec);
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
