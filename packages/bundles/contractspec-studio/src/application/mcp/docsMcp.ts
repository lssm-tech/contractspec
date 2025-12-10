import {
  defaultDocRegistry,
  defineCommand,
  definePrompt,
  defineResourceTemplate,
  PromptRegistry,
  ResourceRegistry,
  SpecRegistry,
  installOp,
} from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import z from 'zod';
import type { DocPresentationRoute } from '@lssm/lib.contracts/docs';
import { createMcpHttpHandler } from './common';

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
        name: 'docs.navigator',
        version: 1,
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
            type: 'text',
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
  const registry = new SpecRegistry();

  const DocSummaryModel = defineSchemaModel({
    name: 'DocSummary',
    fields: {
      id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      route: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      visibility: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
      },
      tags: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
        isArray: true,
      },
    },
  });

  const DocSearchInput = defineSchemaModel({
    name: 'DocSearchInput',
    fields: {
      query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      tag: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
        isArray: true,
      },
      visibility: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
      },
    },
  });

  const DocSearchOutput = defineSchemaModel({
    name: 'DocSearchOutput',
    fields: {
      docs: { type: DocSummaryModel, isOptional: false, isArray: true },
    },
  });

  const searchSpec = defineCommand({
    meta: {
      name: 'docs.search',
      version: 1,
      stability: 'stable',
      owners: DOC_OWNERS,
      tags: DOC_TAGS,
      description:
        'Filter DocBlocks by query, tag, or visibility for MCP discovery.',
      goal: 'Expose ContractSpec documentation to AI agents safely.',
      context:
        'Used by the docs MCP to keep AI agents on the canonical DocBlocks.',
    },
    io: {
      input: DocSearchInput,
      output: DocSearchOutput,
    },
    policy: {
      auth: 'anonymous',
      idempotent: true,
    },
  });

  installOp(registry, searchSpec, async (args) => {
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

  return createMcpHttpHandler({
    path,
    serverName: 'contractspec-docs-mcp',
    ops: buildDocOps(routes),
    resources: buildDocResources(routes),
    prompts: buildDocPrompts(),
    presentationsV2: routes.map(({ descriptor }) => descriptor),
  });
}

