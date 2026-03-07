import { defineFeature } from '@contractspec/lib.contracts-spec';

export const VoiceProvidersFeature = defineFeature({
  meta: {
    key: 'voice-providers',
    version: '1.0.0',
    title: 'Voice Providers',
    description:
      'Voice provider integration for TTS synthesis with multiple providers',
    domain: 'integration',
    owners: ['@examples'],
    tags: ['voice', 'tts', 'providers', 'synthesis'],
    stability: 'experimental',
  },

  integrations: [{ key: 'voice-providers.integration.tts', version: '1.0.0' }],

  docs: [
    'docs.examples.voice-providers',
    'docs.examples.voice-providers.usage',
  ],
});
