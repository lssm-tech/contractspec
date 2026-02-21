import { FalVoiceProvider } from '@contractspec/integration.providers-impls/impls/fal-voice';
import { GradiumVoiceProvider } from '@contractspec/integration.providers-impls/impls/gradium-voice';
import type { TTSProvider } from '@contractspec/lib.contracts-integrations';

export type VoiceIntegrationKey = 'ai-voice.gradium' | 'ai-voice.fal';

export interface VoiceProviderSecrets {
  apiKey: string;
}

export interface VoiceProviderConfig {
  defaultVoiceId?: string;
  region?: 'eu' | 'us';
  baseUrl?: string;
  timeoutMs?: number;
  outputFormat?:
    | 'wav'
    | 'pcm'
    | 'opus'
    | 'ulaw_8000'
    | 'alaw_8000'
    | 'pcm_16000'
    | 'pcm_24000';
  modelId?: string;
  defaultVoiceUrl?: string;
  defaultExaggeration?: number;
  defaultTemperature?: number;
  defaultCfg?: number;
  pollIntervalMs?: number;
}

export interface VoiceProviderFactoryInput {
  integrationKey: VoiceIntegrationKey;
  secrets: VoiceProviderSecrets;
  config?: VoiceProviderConfig;
}

export function createVoiceProvider(
  input: VoiceProviderFactoryInput
): TTSProvider {
  const { integrationKey, secrets, config } = input;

  if (!secrets.apiKey) {
    throw new Error('Voice provider apiKey is required.');
  }

  switch (integrationKey) {
    case 'ai-voice.gradium':
      return new GradiumVoiceProvider({
        apiKey: secrets.apiKey,
        defaultVoiceId: config?.defaultVoiceId,
        region: config?.region,
        baseUrl: config?.baseUrl,
        timeoutMs: config?.timeoutMs,
        outputFormat: config?.outputFormat,
      });
    case 'ai-voice.fal':
      return new FalVoiceProvider({
        apiKey: secrets.apiKey,
        modelId: config?.modelId,
        defaultVoiceUrl: config?.defaultVoiceUrl,
        defaultExaggeration: config?.defaultExaggeration,
        defaultTemperature: config?.defaultTemperature,
        defaultCfg: config?.defaultCfg,
        pollIntervalMs: config?.pollIntervalMs,
      });
    default:
      throw new Error(`Unsupported voice provider: ${integrationKey}`);
  }
}
