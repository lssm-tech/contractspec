import {
  defaultDocRegistry,
  definePrompt,
  defineResourceTemplate,
  installOp,
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
} from '@contractspec/lib.contracts';
import z from 'zod';
import type { DocPresentationRoute } from '@contractspec/lib.contracts/docs';
import { createMcpElysiaHandler } from './common';
import { appLogger } from '../../infrastructure/elysia/logger';
import { docsSearchSpec } from '../../features/docs';

const DOC_OWNERS = ['@contractspec'];
const DOC_TAGS = ['docs', 'mcp'];

function buildDocResources(routes: DocPresentationRoute[]) {
  const resources = new ResourceRegistry();

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'docs://list',
        title: 'DocBlocks index',
        description:
          'All registered DocBlocks with route, visibility, tags, and summary.',
        mimeType: 'application/json',
        tags: DOC_TAGS,
      },
      input: z.object({}),
      resolve: async () => {
        const docs = routes.map(({ block, route }) => ({
          id: block.id,
          title: block.title,
          summary: block.summary ?? '',
          tags: block.tags ?? [],
          visibility: block.visibility ?? 'public',
          route,
        }));

        return {
          uri: 'docs://list',
          mimeType: 'application/json',
          data: JSON.stringify(docs, null, 2),
        };
      },
    })
  );

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'docs://doc/{id}',
        title: 'DocBlock markdown',
        description: 'Fetch DocBlock body by id as markdown.',
        mimeType: 'text/markdown',
        tags: DOC_TAGS,
      },
      input: z.object({ id: z.string() }),
      resolve: async ({ id }) => {
        const found = defaultDocRegistry.get(id);
        if (!found) {
          return {
            uri: `docs://doc/${encodeURIComponent(id)}`,
            mimeType: 'text/plain',
            data: `DocBlock not found: ${id}`,
          };
        }

        return {
          uri: `docs://doc/${encodeURIComponent(id)}`,
          mimeType: 'text/markdown',
          data: String(found.block.body ?? ''),
        };
      },
    })
  );

  return resources;
}

function buildDocPrompts() {
  const prompts = new PromptRegistry();

  prompts.register(
    definePrompt({
      meta: {
        key: 'docs.navigator',
        version: '1.0.0',
        title: 'Find relevant ContractSpec docs',
        description: 'Guide agents to pick the right DocBlock by topic or tag.',
        tags: DOC_TAGS,
        stability: 'beta',
        owners: DOC_OWNERS,
      },
      args: [
        {
          name: 'topic',
          description: 'Goal or subject to search for.',
          required: false,
          schema: z.string().optional(),
        },
        {
          name: 'tag',
          description: 'Optional tag filter.',
          required: false,
          schema: z.string().optional(),
        },
      ],
      input: z.object({
        topic: z.string().optional(),
        tag: z.string().optional(),
      }),
      render: async ({ topic, tag }) => {
        const parts = [
          {
            type: 'text' as const,
            text: `Use the docs index to choose DocBlocks. If a specific topic is provided, prefer docs whose id/title/summary match it.${topic ? ` Topic: ${topic}.` : ''}${tag ? ` Tag: ${tag}.` : ''}`,
          },
          {
            type: 'resource' as const,
            uri: 'docs://list',
            title: 'DocBlocks index',
          },
        ];
        return parts;
      },
    })
  );

  return prompts;
}

function buildDocOps(routes: DocPresentationRoute[]) {
  const registry = new OperationSpecRegistry();

  // Use the module-level spec from docs.contracts.ts
  installOp(registry, docsSearchSpec, async (args) => {
    const query = args.query?.toLowerCase().trim();
    const tagsFilter = args.tag?.map((t) => t.toLowerCase().trim()) ?? [];
    const visibility = args.visibility?.toLowerCase().trim();

    const docs = routes
      .map(({ block, route }) => ({
        id: block.id,
        title: block.title,
        summary: block.summary ?? '',
        tags: block.tags ?? [],
        visibility: (block.visibility ?? 'public').toLowerCase(),
        route,
      }))
      .filter((doc) => {
        const matchesQuery = query
          ? doc.id.toLowerCase().includes(query) ||
            doc.title.toLowerCase().includes(query) ||
            doc.summary.toLowerCase().includes(query)
          : true;
        const matchesTags = tagsFilter.length
          ? tagsFilter.every((t) =>
              doc.tags.some((tag) => tag.toLowerCase().includes(t))
            )
          : true;
        const matchesVisibility = visibility
          ? doc.visibility === visibility
          : true;
        return matchesQuery && matchesTags && matchesVisibility;
      });

    return { docs };
  });

  return registry;
}

export function createDocsMcpHandler(path = '/api/mcp/docs') {
  const routes = defaultDocRegistry.list();

  return createMcpElysiaHandler({
    logger: appLogger,
    path,
    serverName: 'contractspec-docs-mcp',
    ops: buildDocOps(routes),
    resources: buildDocResources(routes),
    prompts: buildDocPrompts(),
    presentations: routes.map(({ descriptor }) => descriptor),
  });
}
