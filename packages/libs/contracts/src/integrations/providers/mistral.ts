import { StabilityEnum } from '../../ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const mistralIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-llm.mistral',
    version: '1.0.0',
    category: 'ai-llm',
    title: 'Mistral Large Language Model',
    description:
      'Mistral integration providing chat completions and embedding generation.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['ai', 'llm', 'embeddings'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [
      { key: 'ai.chat', version: '1.0.0' },
      { key: 'ai.embeddings', version: '1.0.0' },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          description:
            'Default chat completion model (e.g., mistral-large-latest).',
        },
        embeddingModel: {
          type: 'string',
          description: 'Embedding model identifier.',
        },
      },
    },
    example: {
      model: 'mistral-large-latest',
      embeddingModel: 'mistral-embed',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description:
            'Mistral API key with access to chat and embeddings endpoints.',
        },
      },
    },
    example: {
      apiKey: 'mistral-***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 5000,
  },
  docsUrl: 'https://docs.mistral.ai/platform/endpoints',
  constraints: {
    rateLimit: {
      rpm: 600,
    },
  },
  byokSetup: {
    setupInstructions:
      'Generate an API key within the Mistral console and ensure the selected models are enabled for the account.',
  },
});

export function registerMistralIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(mistralIntegrationSpec);
}
