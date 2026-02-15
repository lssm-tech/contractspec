import {
  defineCommand,
  definePrompt,
  defineResourceTemplate,
  installOp,
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
} from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import z from 'zod';
import { createMcpElysiaHandler } from './common';
import { appLogger } from '../../infrastructure/elysia/logger';
import {
  getExample,
  listExamples,
  searchExamples,
} from '@contractspec/module.examples';

const INTERNAL_TAGS = ['internal', 'mcp'];
const INTERNAL_OWNERS = ['@contractspec'];

const ENDPOINTS = {
  docs: '/api/mcp/docs',
  cli: '/api/mcp/cli',
  internal: '/api/mcp/internal',
  graphql: '/graphql',
  health: '/health',
};

function buildInternalResources() {
  const resources = new ResourceRegistry();

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'examples://list{?q}',
        title: 'ContractSpec examples registry',
        description:
          'List available examples (templates, integrations, knowledge, scripts). Optional query `q` filters results.',
        mimeType: 'application/json',
        tags: ['examples', ...INTERNAL_TAGS],
      },
      input: z.object({ q: z.string().optional() }),
      resolve: async ({ q }) => {
        const items = q ? searchExamples(q) : [...listExamples()];
        return {
          uri: q
            ? `examples://list?q=${encodeURIComponent(q)}`
            : 'examples://list',
          mimeType: 'application/json',
          data: JSON.stringify(items, null, 2),
        };
      },
    })
  );

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'examples://example/{id}',
        title: 'ContractSpec example (by id)',
        description: 'Fetch a single example manifest by id.',
        mimeType: 'application/json',
        tags: ['examples', ...INTERNAL_TAGS],
      },
      input: z.object({ id: z.string().min(1) }),
      resolve: async ({ id }) => {
        const example = getExample(id);
        if (!example) {
          return {
            uri: `examples://example/${encodeURIComponent(id)}`,
            mimeType: 'application/json',
            data: JSON.stringify(
              { error: 'not_found', id, message: `Unknown example id: ${id}` },
              null,
              2
            ),
          };
        }
        return {
          uri: `examples://example/${encodeURIComponent(id)}`,
          mimeType: 'application/json',
          data: JSON.stringify(example, null, 2),
        };
      },
    })
  );

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'internal://endpoints',
        title: 'ContractSpec MCP endpoints',
        description: 'Endpoints for docs, CLI, internal MCP servers.',
        mimeType: 'application/json',
        tags: INTERNAL_TAGS,
      },
      input: z.object({}),
      resolve: async () => ({
        uri: 'internal://endpoints',
        mimeType: 'application/json',
        data: JSON.stringify(ENDPOINTS, null, 2),
      }),
    })
  );

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'internal://playbook',
        title: 'Internal MCP usage playbook',
        description:
          'How internal agents should discover docs, CLI usage, and endpoints.',
        mimeType: 'text/markdown',
        tags: INTERNAL_TAGS,
      },
      input: z.object({}),
      resolve: async () => ({
        uri: 'internal://playbook',
        mimeType: 'text/markdown',
        data: [
          '# Internal MCP playbook',
          '- Connect to docs MCP first for canonical specs.',
          '- Use CLI MCP to surface quickstart/reference before running commands.',
          '- Keep calls read-only unless explicitly approved.',
          `- Endpoints: ${ENDPOINTS.docs}, ${ENDPOINTS.cli}, ${ENDPOINTS.internal}.`,
          '- For API work, GraphQL at /graphql; health at /health.',
        ].join('\n'),
      }),
    })
  );

  return resources;
}

function buildInternalPrompts() {
  const prompts = new PromptRegistry();

  prompts.register(
    definePrompt({
      meta: {
        key: 'internal.bootstrap',
        version: '1.0.0',
        title: 'Bootstrap internal ContractSpec agent',
        description:
          'Points agents to the correct MCP endpoints and guardrails.',
        tags: INTERNAL_TAGS,
        owners: INTERNAL_OWNERS,
        stability: 'beta',
      },
      args: [],
      input: z.object({}),
      render: async () => [
        {
          type: 'text',
          text: 'Start with internal://endpoints to pick the right MCP. Use docs MCP for specifications and CLI MCP for commands. Keep actions read-only unless explicitly approved.',
        },
        {
          type: 'resource' as const,
          uri: 'internal://endpoints',
          title: 'Endpoints',
        },
      ],
    })
  );

  return prompts;
}

function buildInternalOps() {
  const registry = new OperationSpecRegistry();

  const InternalDescribeOutput = defineSchemaModel({
    name: 'InternalDescribeOutput',
    fields: {
      endpoints: {
        type: ScalarTypeEnum.JSONObject(),
        isOptional: false,
      },
      notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  });

  const describeSpec = defineCommand({
    meta: {
      key: 'internal.describe',
      version: '1.0.0',
      stability: 'stable',
      owners: INTERNAL_OWNERS,
      tags: INTERNAL_TAGS,
      description:
        'Return MCP endpoints and guidance for internal ContractSpec agents.',
      goal: 'Speed up internal development with the correct MCP entrypoints.',
      context: 'Used by internal MCP surface; read-only.',
    },
    io: {
      input: defineSchemaModel({
        name: 'InternalDescribeInput',
        fields: {},
      }),
      output: InternalDescribeOutput,
    },
    policy: {
      auth: 'anonymous',
    },
  });

  installOp(registry, describeSpec, async () => ({
    endpoints: ENDPOINTS,
    notes:
      'Use docs MCP for canonical specs, CLI MCP for contractspec commands, and keep side-effecting actions gated behind human review.',
  }));

  return registry;
}

export function createInternalMcpHandler(path = '/api/mcp/internal') {
  return createMcpElysiaHandler({
    logger: appLogger,
    path,
    serverName: 'contractspec-internal-mcp',
    ops: buildInternalOps(),
    resources: buildInternalResources(),
    prompts: buildInternalPrompts(),
  });
}
