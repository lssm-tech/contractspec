import fs from 'node:fs/promises';
import path from 'node:path';
import {
  defineCommand,
  definePrompt,
  defineResourceTemplate,
  installOp,
  OperationSpecRegistry,
  PromptRegistry,
  ResourceRegistry,
} from '@contractspec/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import z from 'zod';
import { createMcpElysiaHandler } from './common';
import { appLogger } from '../../infrastructure/elysia/logger';

const CLI_DOC_PATHS = {
  quickstart: 'packages/apps/cli-contractspec/QUICK_START.md',
  reference: 'packages/apps/cli-contractspec/QUICK_REFERENCE.md',
  readme: 'packages/apps/cli-contractspec/README.md',
};

const CLI_DOC_FALLBACK = {
  quickstart:
    '# ContractSpec CLI quickstart\n\ncontractspec create\ncontractspec build <spec>\ncontractspec validate <spec>',
  reference:
    '# ContractSpec CLI reference\n\nKey commands: create, build, validate. See README for full options.',
  readme:
    '# ContractSpec CLI\n\nStabilize AI-generated code across API, DB, UI, events. Use create/build/validate commands.',
};

const CLI_DOC_TAGS = ['cli', 'mcp'];
const CLI_OWNERS = ['@contractspec'];

const candidateRoots = (() => {
  const roots = new Set<string>([
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '../..'),
    path.resolve(process.cwd(), '../../..'),
  ]);
  if (typeof __dirname === 'string') {
    roots.add(path.resolve(__dirname, '../../../../..'));
  }
  return [...roots];
})();

const docCache = new Map<string, string>();

async function loadCliDoc(key: keyof typeof CLI_DOC_PATHS): Promise<string> {
  if (docCache.has(key)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return docCache.get(key)!;
  }

  const relative = CLI_DOC_PATHS[key];
  for (const root of candidateRoots) {
    const candidate = path.resolve(root, relative);
    try {
      const data = await fs.readFile(candidate, 'utf8');
      docCache.set(key, data);
      return data;
    } catch {
      // try next candidate
    }
  }

  const fallback = CLI_DOC_FALLBACK[key];
  docCache.set(key, fallback);
  return fallback;
}

function buildCliResources() {
  const resources = new ResourceRegistry();

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'cli://doc/{slug}',
        title: 'CLI documentation',
        description: 'Quickstart, reference, and README for the CLI.',
        mimeType: 'text/markdown',
        tags: CLI_DOC_TAGS,
      },
      input: z.object({
        slug: z.enum(['quickstart', 'reference', 'readme']),
      }),
      resolve: async ({ slug }) => {
        const data = await loadCliDoc(slug);
        return {
          uri: `cli://doc/${slug}`,
          mimeType: 'text/markdown',
          data,
        };
      },
    })
  );

  resources.register(
    defineResourceTemplate({
      meta: {
        uriTemplate: 'cli://commands',
        title: 'CLI commands summary',
        description: 'Key ContractSpec CLI commands and when to use them.',
        mimeType: 'application/json',
        tags: CLI_DOC_TAGS,
      },
      input: z.object({}),
      resolve: async () => {
        const commands = [
          {
            command: 'contractspec create',
            summary: 'Interactive wizard to author specs (with optional AI).',
            doc: 'cli://doc/quickstart',
          },
          {
            command: 'contractspec build <specPath>',
            summary:
              'Generate implementation code from a ContractSpec (agents + templates).',
            doc: 'cli://doc/reference',
          },
          {
            command: 'contractspec validate <specPath>',
            summary:
              'Validate specs and optionally check implementations against them.',
            doc: 'cli://doc/reference',
          },
        ];

        return {
          uri: 'cli://commands',
          mimeType: 'application/json',
          data: JSON.stringify(commands, null, 2),
        };
      },
    })
  );

  return resources;
}

function buildCliPrompts() {
  const prompts = new PromptRegistry();

  prompts.register(
    definePrompt({
      meta: {
        key: 'cli.usage',
        version: '1.0.0',
        title: 'Use ContractSpec CLI safely',
        description:
          'Remind agents to read CLI docs and pick commands from the canonical list.',
        tags: CLI_DOC_TAGS,
        stability: 'beta',
        owners: CLI_OWNERS,
      },
      args: [
        {
          name: 'goal',
          description: 'Task the user wants to achieve.',
          required: false,
          schema: z.string().optional(),
        },
      ],
      input: z.object({ goal: z.string().optional() }),
      render: async ({ goal }) => [
        {
          type: 'text',
          text: `Use CLI commands only from cli://commands. Prefer quickstart for newcomers and reference for options.${goal ? ` Goal: ${goal}.` : ''}`,
        },
        { type: 'resource' as const, uri: 'cli://commands', title: 'Commands' },
        {
          type: 'resource' as const,
          uri: 'cli://doc/quickstart',
          title: 'Quickstart',
        },
      ],
    })
  );

  return prompts;
}

function buildCliOps() {
  const registry = new OperationSpecRegistry();

  const CliSuggestInput = defineSchemaModel({
    name: 'CliSuggestInput',
    fields: {
      goal: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      prefersAi: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    },
  });

  const CliSuggestOutput = defineSchemaModel({
    name: 'CliSuggestOutput',
    fields: {
      command: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      docUri: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  });

  const suggestSpec = defineCommand({
    meta: {
      key: 'cli.suggestCommand',
      version: '1.0.0',
      stability: 'stable',
      owners: CLI_OWNERS,
      tags: CLI_DOC_TAGS,
      description: 'Recommend a CLI command for the requested goal.',
      goal: 'Help AI agents choose the correct CLI entrypoint quickly.',
      context: 'Used inside the CLI MCP server.',
    },
    io: {
      input: CliSuggestInput,
      output: CliSuggestOutput,
    },
    policy: {
      auth: 'anonymous',
    },
  });

  installOp(registry, suggestSpec, async ({ goal, prefersAi }) => {
    const lower = goal.toLowerCase();

    if (lower.includes('create') || lower.includes('new')) {
      return {
        command: prefersAi ? 'contractspec create --ai' : 'contractspec create',
        docUri: 'cli://doc/quickstart',
        reason:
          'Creates a new ContractSpec interactively (optionally with AI).',
      };
    }

    if (lower.includes('build') || lower.includes('generate')) {
      return {
        command: 'contractspec build <path-to-spec>',
        docUri: 'cli://doc/reference',
        reason:
          'Builds implementation code from a spec using agents + templates.',
      };
    }

    if (lower.includes('validate') || lower.includes('check')) {
      return {
        command: 'contractspec validate <path-to-spec>',
        docUri: 'cli://doc/reference',
        reason:
          'Validates a spec and optionally checks its implementation for drift.',
      };
    }

    return {
      command: 'contractspec --help',
      docUri: 'cli://doc/readme',
      reason: 'Fallback when the goal is unclear; read README for options.',
    };
  });

  return registry;
}

export function createCliMcpHandler(path = '/api/mcp/cli') {
  return createMcpElysiaHandler({
    logger: appLogger,
    path,
    serverName: 'contractspec-cli-mcp',
    ops: buildCliOps(),
    resources: buildCliResources(),
    prompts: buildCliPrompts(),
  });
}
