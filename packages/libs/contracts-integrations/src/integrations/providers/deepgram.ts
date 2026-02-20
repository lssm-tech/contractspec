import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const deepgramIntegrationSpec = defineIntegration({
  meta: {
    key: 'ai-voice-stt.deepgram',
    version: '1.0.0',
    category: 'ai-voice-stt',
    title: 'Deepgram Speech-to-Text',
    description:
      'Deepgram integration for real-time and batch speech-to-text transcription with speaker diarization.',
    domain: 'ai',
    owners: ['platform.ai'],
    tags: ['voice', 'stt', 'transcription', 'diarization'],
    stability: StabilityEnum.Experimental,
  },
  supportedModes: ['byok'],
  capabilities: {
    provides: [
      { key: 'ai.voice.stt', version: '1.0.0' },
      { key: 'ai.voice.conversational', version: '1.0.0' },
    ],
  },
  configSchema: {
    schema: {
      type: 'object',
      properties: {
        model: {
          type: 'string',
          description: 'Deepgram model to use (e.g. nova-3, nova-2, enhanced).',
        },
        language: {
          type: 'string',
          description: 'Default language code for transcription (e.g. en-US).',
        },
        enableDiarization: {
          type: 'boolean',
          description: 'Enable speaker diarization by default.',
        },
        enableSmartFormat: {
          type: 'boolean',
          description: 'Enable smart formatting (punctuation, capitalization).',
        },
      },
    },
    example: {
      model: 'nova-3',
      language: 'en-US',
      enableDiarization: true,
      enableSmartFormat: true,
    },
  },
  secretSchema: {
    schema: {
      type: 'object',
      required: ['apiKey'],
      properties: {
        apiKey: {
          type: 'string',
          description: 'Deepgram API key with transcription permissions.',
        },
      },
    },
    example: {
      apiKey: 'dg_***',
    },
  },
  healthCheck: {
    method: 'custom',
    timeoutMs: 5000,
  },
  docsUrl: 'https://developers.deepgram.com/docs',
  byokSetup: {
    setupInstructions:
      'Create a Deepgram API key with speech-to-text permissions and store it in your secret provider.',
  },
});

export function registerDeepgramIntegration(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(deepgramIntegrationSpec);
}
