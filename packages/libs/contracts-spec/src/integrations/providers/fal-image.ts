import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const falImageIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-image.fal',
    version: '1.0.0',
    category: 'ai-image',
    title: 'Fal Image Generation',
    description:
      'Fal integration for AI image generation using Flux and Stable Diffusion models.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['image', 'generation', 'flux', 'stable-diffusion'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['byok'],
  capabilities: {
    provides: [{ key: 'ai.image.generation', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        modelId: {
          type: 'string',
          description: 'Fal model endpoint (e.g. fal-ai/flux/dev).',
        },
        defaultFormat: {
          type: 'string',
          enum: ['png', 'jpg', 'webp'],
        },
        defaultGuidanceScale: {
          type: 'number',
          minimum: 1,
          maximum: 20,
        },
      },
    },
    example: {
      modelId: 'fal-ai/flux/dev',
      defaultFormat: 'png',
      defaultGuidanceScale: 7.5,
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Fal API key (FAL_KEY).',
        },
      },
    },
    example: {
      apiKey: 'key-id:key-secret',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 7000,
  },
  docsUrl: 'https://fal.ai/models',
  byokSetup: {
    setupInstructions:
      'Create a Fal API key and ensure image generation model access is enabled.',
  },
});

export function registerFalImageIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(falImageIntegrationSpec);
}
