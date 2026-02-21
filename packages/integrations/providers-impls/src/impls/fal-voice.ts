import { createFalClient } from '@fal-ai/client';
import type { FalClient } from '@fal-ai/client';

import type {
  AudioFormat,
  Voice,
  TTSProvider,
  TTSSynthesisInput,
  TTSSynthesisResult,
} from '../voice';

const DEFAULT_MODEL_ID = 'fal-ai/chatterbox/text-to-speech';

interface FalSynthesisOutput {
  audio?: { url?: string } | null;
  audio_url?: string;
  url?: string;
}

export interface FalVoiceProviderOptions {
  apiKey: string;
  modelId?: string;
  defaultVoiceUrl?: string;
  defaultExaggeration?: number;
  defaultTemperature?: number;
  defaultCfg?: number;
  pollIntervalMs?: number;
  client?: FalClient;
}

export class FalVoiceProvider implements TTSProvider {
  private readonly client: FalClient;
  private readonly modelId: string;
  private readonly defaultVoiceUrl?: string;
  private readonly defaultExaggeration?: number;
  private readonly defaultTemperature?: number;
  private readonly defaultCfg?: number;
  private readonly pollIntervalMs?: number;

  constructor(options: FalVoiceProviderOptions) {
    this.client =
      options.client ??
      createFalClient({
        credentials: options.apiKey,
      });
    this.modelId = options.modelId ?? DEFAULT_MODEL_ID;
    this.defaultVoiceUrl = options.defaultVoiceUrl;
    this.defaultExaggeration = options.defaultExaggeration;
    this.defaultTemperature = options.defaultTemperature;
    this.defaultCfg = options.defaultCfg;
    this.pollIntervalMs = options.pollIntervalMs;
  }

  async listVoices(): Promise<Voice[]> {
    const voices: Voice[] = [
      {
        id: 'default',
        name: 'Default Chatterbox Voice',
        description:
          'Uses the default model voice (or configured default reference audio URL).',
        metadata: {
          modelId: this.modelId,
        },
      },
    ];

    if (this.defaultVoiceUrl) {
      voices.push({
        id: this.defaultVoiceUrl,
        name: 'Configured Reference Voice',
        description:
          'Reference voice configured at provider setup and used when voiceId is default.',
        previewUrl: this.defaultVoiceUrl,
        metadata: {
          modelId: this.modelId,
          source: 'config.defaultVoiceUrl',
        },
      });
    }

    return voices;
  }

  async synthesize(input: TTSSynthesisInput): Promise<TTSSynthesisResult> {
    const referenceVoiceUrl = resolveVoiceUrl(
      input.voiceId,
      this.defaultVoiceUrl
    );
    const result = await this.client.subscribe(this.modelId, {
      input: {
        text: input.text,
        ...(referenceVoiceUrl ? { audio_url: referenceVoiceUrl } : {}),
        ...(this.defaultExaggeration != null
          ? { exaggeration: this.defaultExaggeration }
          : {}),
        ...(this.defaultTemperature != null
          ? { temperature: this.defaultTemperature }
          : {}),
        ...(this.defaultCfg != null ? { cfg: this.defaultCfg } : {}),
      },
      pollInterval: this.pollIntervalMs,
    });

    const audioUrl = extractAudioUrl(result.data as FalSynthesisOutput);
    if (!audioUrl) {
      throw new Error(
        'Fal synthesis completed without an audio URL in response.'
      );
    }

    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`Fal audio download failed (${response.status}).`);
    }

    const rawAudio = new Uint8Array(await response.arrayBuffer());
    const format: AudioFormat =
      input.format ?? inferFormatFromUrl(audioUrl) ?? 'wav';

    return {
      audio: {
        data: rawAudio,
        format,
        sampleRateHz: input.sampleRateHz ?? 24000,
      },
    };
  }
}

function resolveVoiceUrl(
  voiceId: string | undefined,
  defaultVoiceUrl: string | undefined
): string | undefined {
  if (!voiceId || voiceId === 'default') return defaultVoiceUrl;
  if (isHttpUrl(voiceId)) return voiceId;
  throw new Error(
    'Fal voiceId must be "default" or a public reference audio URL.'
  );
}

function extractAudioUrl(output: FalSynthesisOutput): string | undefined {
  if (output.audio?.url) return output.audio.url;
  if (typeof output.audio_url === 'string') return output.audio_url;
  if (typeof output.url === 'string') return output.url;
  return undefined;
}

function inferFormatFromUrl(url: string): AudioFormat | undefined {
  const normalized = url.toLowerCase();
  if (normalized.endsWith('.wav')) return 'wav';
  if (normalized.endsWith('.mp3')) return 'mp3';
  if (normalized.endsWith('.ogg')) return 'ogg';
  if (normalized.endsWith('.opus')) return 'opus';
  if (normalized.endsWith('.pcm')) return 'pcm';
  return undefined;
}

function isHttpUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://');
}
