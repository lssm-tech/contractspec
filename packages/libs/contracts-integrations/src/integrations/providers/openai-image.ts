import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const openaiImageIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-image.openai',
    version: '1.0.0',
    category: 'ai-image',
    title: 'OpenAI Image Generation',
    description:
      'OpenAI integration for AI image generation using DALL-E and gpt-image models.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['image', 'generation', 'dall-e', 'gpt-image'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'ai.image.generation', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          description:
            'OpenAI image model identifier (e.g. dall-e-3, gpt-image-1).',
        },
        defaultSize: {
          type: 'string',
          enum: ['1024x1024', '1024x1792', '1792x1024'],
        },
        defaultQuality: {
          type: 'string',
          enum: ['standard', 'hd'],
        },
      },
    },
    example: {
      model: 'dall-e-3',
      defaultSize: '1024x1024',
      defaultQuality: 'standard',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'OpenAI API key with image generation permissions.',
        },
      },
    },
    example: {
      apiKey: 'sk-***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 5000,
  },
  docsUrl: 'https://platform.openai.com/docs/guides/images',
  constraints: {
    rateLimit: {
      rpm: 50,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create an OpenAI API key with image generation access enabled.',
  },
});

export function registerOpenaiImageIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(openaiImageIntegrationSpec);
}
