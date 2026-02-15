import type { IntegrationConnection } from '@contractspec/lib.contracts-integrations';

export const gradiumVoiceConnection: IntegrationConnection = {
  meta: {
    id: 'conn-gradium-voice-demo',
    tenantId: 'acme-inc',
    integrationKey: 'ai-voice.gradium',
    integrationVersion: '1.0.0',
    label: 'Gradium Voice',
    environment: 'production',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  ownershipMode: 'byok',
  config: {
    defaultVoiceId: 'YTpq7expH9539ERJ',
    region: 'eu',
    outputFormat: 'wav',
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-inc/conn-gradium-voice-demo',
  status: 'connected',
};

export const falVoiceConnection: IntegrationConnection = {
  meta: {
    id: 'conn-fal-voice-demo',
    tenantId: 'acme-inc',
    integrationKey: 'ai-voice.fal',
    integrationVersion: '1.0.0',
    label: 'Fal Voice',
    environment: 'production',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  ownershipMode: 'byok',
  config: {
    modelId: 'fal-ai/chatterbox/text-to-speech',
    defaultVoiceUrl:
      'https://storage.googleapis.com/chatterbox-demo-samples/prompts/male_rickmorty.mp3',
    defaultExaggeration: 0.25,
    defaultTemperature: 0.7,
    defaultCfg: 0.5,
    pollIntervalMs: 1000,
  },
  secretProvider: 'vault',
  secretRef: 'vault://integrations/acme-inc/conn-fal-voice-demo',
  status: 'connected',
};

export const voiceSampleConnections: IntegrationConnection[] = [
  gradiumVoiceConnection,
  falVoiceConnection,
];
