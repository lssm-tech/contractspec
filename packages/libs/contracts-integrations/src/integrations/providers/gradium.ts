import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const gradiumIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-voice.gradium',
    version: '1.0.0',
    category: 'ai-voice',
    title: 'Gradium Text-to-Speech',
    description:
      'Gradium integration for low-latency voice synthesis and voice catalog access.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['voice', 'tts', 'realtime'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['byok'],
  capabilities: {
    provides: [{ key: 'ai.voice.synthesis', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        defaultVoiceId: {
          type: 'string',
          description: 'Optional default voice identifier used for synthesis.',
        },
        region: {
          type: 'string',
          enum: ['eu', 'us'],
          description: 'Gradium region used by the SDK (eu or us).',
        },
        baseUrl: {
          type: 'string',
          description:
            'Optional API base URL override for private routing or proxies.',
        },
        timeoutMs: {
          type: 'number',
          description: 'Optional request timeout in milliseconds.',
        },
        outputFormat: {
          type: 'string',
          enum: [
            'wav',
            'pcm',
            'opus',
            'ulaw_8000',
            'alaw_8000',
            'pcm_16000',
            'pcm_24000',
          ],
          description:
            'Optional default output format used when no format is specified.',
        },
      },
    },
    example: {
      defaultVoiceId: 'YTpq7expH9539ERJ',
      region: 'eu',
      timeoutMs: 15000,
      outputFormat: 'wav',
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Gradium API key with TTS access.',
        },
      },
    },
    example: {
      apiKey: 'gd_***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 5000,
  },
  docsUrl: 'https://gradium.ai/api_docs.html',
  byokSetup: {
    setupInstructions:
      'Create a Gradium API key, select the target region, and store credentials in your tenant secret provider.',
  },
});

export function registerGradiumIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(gradiumIntegrationSpec);
}
