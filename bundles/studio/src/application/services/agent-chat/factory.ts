import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI as createGoogle } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import {
  type AgentSpec,
  ContractSpecAgent,
  defineAgent,
  type ToolHandler,
} from '@contractspec/lib.ai-agent';
import { createKnowledgeQueryTool } from '@contractspec/lib.ai-agent/tools/knowledge-tool';
import { DEFAULT_MODELS as PROVIDER_DEFAULT_MODELS } from '@contractspec/lib.ai-providers';
import { AGENT_SYSTEM_PROMPTS } from '@contractspec/lib.contracts/llm/prompts';
import type { AgentDependencies, ChatOptions } from './types';

export const MANAGED_KEYS = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  mistral: process.env.MISTRAL_API_KEY,
  gemini: process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY,
};

export function getModel(provider: string, model: string) {
  const apiKey = MANAGED_KEYS[provider as keyof typeof MANAGED_KEYS];

  if (!apiKey) {
    throw new Error(
      `No API key configured for provider: ${provider}. ` +
        `Set the appropriate environment variable.`
    );
  }

  switch (provider) {
    case 'openai': {
      const openai = createOpenAI({ apiKey });
      return openai(model);
    }
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(model);
    }
    case 'mistral': {
      const mistral = createMistral({ apiKey });
      return mistral(model);
    }
    case 'gemini': {
      const google = createGoogle({ apiKey });
      return google(model);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function createAgent(
  options: ChatOptions,
  dependencies?: AgentDependencies
) {
  const provider = options.provider ?? 'openai';
  const providerKey = provider as keyof typeof PROVIDER_DEFAULT_MODELS;
  const modelName =
    options.model ?? PROVIDER_DEFAULT_MODELS[providerKey] ?? 'gpt-4o';
  const model = getModel(provider, modelName);

  // Use professional system prompt from contracts library
  const baseInstructions = AGENT_SYSTEM_PROMPTS['generic-mcp'];
  const userInstructions = options.systemPrompt ?? '';
  const instructions = userInstructions
    ? `${baseInstructions}\n\nAdditional Instructions:\n${userInstructions}`
    : baseInstructions;

  const agentSpec: AgentSpec = defineAgent({
    meta: {
      key: 'agent-chat-service',
      version: '1.0.0',
      title: 'ContractSpec Agent',
      description:
        'Professional ContractSpec agent with knowledge capabilities',
      domain: 'assistant',
      owners: [options.organizationId ?? 'system'],
      tags: ['chat', 'api', 'contractspec'],
      stability: 'stable',
    },
    instructions,
    description: 'Specialized agent for ContractSpec interactions',
    knowledge: dependencies?.retriever
      ? [
          {
            key: 'contractspec-knowledge',
            instructions: 'General ContractSpec documentation and knowledge',
            required: false, // Allows tool usage instead of forced injection
          },
        ]
      : [],
    tools: [
      {
        name: 'get_time',
        description: 'Get the current server time',
        schema: {},
        automationSafe: true,
      },
      {
        name: 'read_project_specs',
        description:
          'Read the contents of ContractSpec specifications in the current project',
        schema: {
          specNames: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of spec names to read (e.g. ["my.spec.v1"])',
          },
        },
        automationSafe: true,
      },
    ],
    maxSteps: 10, // Increased for complex reasoning
  });

  // Dynamic tool handlers
  const toolHandlers = new Map<string, ToolHandler>([
    ['get_time', async () => new Date().toISOString()],
    [
      'read_project_specs',
      async (input: unknown) => {
        const { specNames } = input as { specNames?: string[] };
        if (!options.projectId || !dependencies?.specReader) {
          return 'Project context or spec reader not available.';
        }

        const projectSpecs = await dependencies.specReader.listSpecs(
          options.projectId
        );
        const targetSpecs = specNames?.length ? specNames : projectSpecs;

        const projectId = options.projectId;
        const specReader = dependencies.specReader;
        if (!projectId || !specReader) {
          return 'Project context or spec reader not available.';
        }

        const results = await Promise.all(
          targetSpecs.map(async (name: string) => {
            const content = await specReader.readSpec(projectId, name);
            return content
              ? `## ${name}\n\`\`\`contractspec\n${content}\n\`\`\``
              : `Spec ${name} not found.`;
          })
        );
        return results.join('\n\n');
      },
    ],
  ]);

  // Inject knowledge tool if retriever is provided
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AI SDK ExecutableTool types are complex
  const additionalTools: Record<string, any> = {};
  if (dependencies?.retriever && agentSpec.knowledge) {
    const knowledgeTool = createKnowledgeQueryTool(
      dependencies.retriever,
      agentSpec.knowledge
    );
    if (knowledgeTool) {
      additionalTools.query_knowledge = knowledgeTool;
    }
  }

  const agent = await ContractSpecAgent.create({
    spec: agentSpec,
    model: model,
    toolHandlers,
    knowledgeRetriever: dependencies?.retriever,
    additionalTools,
  });

  return { agent, provider, modelName };
}
