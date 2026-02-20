import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const openaiRealtimeIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-voice-conv.openai',
    version: '1.0.0',
    category: 'ai-voice-conversational',
    title: 'OpenAI Realtime Voice',
    description:
      'OpenAI Realtime API integration for bidirectional conversational voice with GPT models.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['voice', 'conversational', 'realtime', 'openai'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['byok'],
  capabilities: {
    provides: [{ key: 'ai.voice.conversational', version: '1.0.0' }],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          description:
            'OpenAI model for realtime conversations (e.g. gpt-4o-realtime-preview).',
        },
        defaultVoice: {
          type: 'string',
          description:
            'Default voice for agent responses (e.g. alloy, echo, shimmer).',
        },
        turnDetection: {
          type: 'string',
          enum: ['server_vad', 'push_to_talk'],
          description: 'Turn detection strategy.',
        },
        maxSessionDurationSeconds: {
          type: 'number',
          description: 'Maximum session duration in seconds.',
        },
      },
    },
    example: {
      model: 'gpt-4o-realtime-preview',
      defaultVoice: 'alloy',
      turnDetection: 'server_vad',
      maxSessionDurationSeconds: 600,
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'OpenAI API key with realtime API access.',
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
  docsUrl: 'https://platform.openai.com/docs/guides/realtime',
  byokSetup: {
    setupInstructions:
      'Create an OpenAI API key with Realtime API access enabled and store it in your secret provider.',
  },
});

export function registerOpenaiRealtimeIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(openaiRealtimeIntegrationSpec);
}
