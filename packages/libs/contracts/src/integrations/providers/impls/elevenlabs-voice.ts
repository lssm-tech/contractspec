import { ElevenLabsClient } from 'elevenlabs';
import type { ElevenLabs } from 'elevenlabs/api';
import type { Readable } from 'node:stream';

import type {
  Voice,
  VoiceProvider,
  VoiceSynthesisInput,
  VoiceSynthesisResult,
} from '../voice';

export interface ElevenLabsVoiceProviderOptions {
  apiKey: string;
  defaultVoiceId?: string;
  modelId?: string;
  client?: ElevenLabsClient;
}

const FORMAT_MAP: Record<string, ElevenLabs.OutputFormat> = {
  mp3: 'mp3_44100_128',
  wav: 'pcm_44100',
  ogg: 'mp3_44100_128',
  pcm: 'pcm_16000',
};

const SAMPLE_RATE: Record<ElevenLabs.OutputFormat, number> = {
  mp3_22050_32: 22050,
  mp3_44100_32: 44100,
  mp3_44100_64: 44100,
  mp3_44100_96: 44100,
  mp3_44100_128: 44100,
  mp3_44100_192: 44100,
  pcm_16000: 16000,
  pcm_22050: 22050,
  pcm_24000: 24000,
  pcm_44100: 44100,
  ulaw_8000: 8000,
};

export class ElevenLabsVoiceProvider implements VoiceProvider {
  private readonly client: ElevenLabsClient;
  private readonly defaultVoiceId?: string;
  private readonly modelId?: string;

  constructor(options: ElevenLabsVoiceProviderOptions) {
    this.client =
      options.client ??
      new ElevenLabsClient({
        apiKey: options.apiKey,
      });
    this.defaultVoiceId = options.defaultVoiceId;
    this.modelId = options.modelId;
  }

  async listVoices(): Promise<Voice[]> {
    const response = await this.client.voices.getAll();
    return (response.voices ?? []).map((voice) => ({
      id: voice.voice_id ?? '',
      name: voice.name ?? '',
      description: voice.description ?? undefined,
      language: voice.labels?.language ?? undefined,
      metadata: {
        category: voice.category,
        previewUrl: voice.preview_url,
      },
    }));
  }

  async synthesize(input: VoiceSynthesisInput): Promise<VoiceSynthesisResult> {
    const outputFormat =
      FORMAT_MAP[input.format ?? 'mp3'] ?? 'mp3_44100_128';
    const stream = await this.client.generate({
      voiceId: input.voiceId ?? this.defaultVoiceId,
      text: input.text,
      model_id: this.modelId,
      output_format: outputFormat,
    });
    const buffer = await readStream(stream);
    return {
      audio: new Uint8Array(buffer),
      format: input.format ?? 'mp3',
      sampleRateHz: input.sampleRateHz ?? SAMPLE_RATE[outputFormat],
      durationSeconds: undefined,
      url: undefined,
    };
  }
}

async function readStream(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk, 'utf-8') : Buffer.from(chunk)
    );
  }
  return Buffer.concat(chunks);
}


