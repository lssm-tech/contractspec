import { StabilityEnum } from '../../ownership';
import type { IntegrationSpec, IntegrationSpecRegistry } from '../spec';

export const elevenLabsIntegrationSpec: IntegrationSpec = {
  meta: {
    key: 'ai-voice.elevenlabs',
    version: 1,
    category: 'ai-voice',
    displayName: 'ElevenLabs Voice',
    title: 'ElevenLabs Text-to-Speech',
    description:
      'ElevenLabs integration for neural voice synthesis and voice catalog access.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['voice', 'tts'],
    stability: StabilityEnum.Beta,
  },
  supportedModes: ['managed', 'byok'],
  capabilities: {
    provides: [{ key: 'ai.voice.synthesis', version: 1 }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        defaultVoiceId: {
          type: 'string',
          description:
            'Optional default voice identifier for synthesis requests.',
        },
      },
    },
    example: {
      defaultVoiceId: 'pNInz6obpgDQGcFmaJgB',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'ElevenLabs API key with text-to-speech permissions.',
        },
      },
    },
    example: {
      apiKey: 'eleven-***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 4000,
  },
  docsUrl: 'https://elevenlabs.io/docs/api-reference/text-to-speech',
  constraints: {
    rateLimit: {
      rpm: 120,
    },
  },
  byokSetup: {
    setupInstructions:
      'Create an ElevenLabs API key and ensure the desired voices are accessible to the key scope.',
  },
};

export function registerElevenLabsIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(elevenLabsIntegrationSpec);
}
