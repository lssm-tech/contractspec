import type { ElevenLabs } from '@elevenlabs/elevenlabs-js';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

import type {
  AudioFormat,
  Voice,
  TTSProvider,
  TTSSynthesisInput,
  TTSSynthesisResult,
} from '../voice';

export interface ElevenLabsVoiceProviderOptions {
  apiKey: string;
  defaultVoiceId?: string;
  modelId?: string;
  client?: ElevenLabsClient;
}

const FORMAT_MAP: Record<
  AudioFormat,
  ElevenLabs.TextToSpeechConvertRequestOutputFormat
> = {
  mp3: 'mp3_44100_128',
  wav: 'pcm_44100',
  ogg: 'mp3_44100_128',
  pcm: 'pcm_16000',
  opus: 'mp3_44100_128',
};

const SAMPLE_RATE: Partial<
  Record<ElevenLabs.TextToSpeechConvertRequestOutputFormat, number>
> = {
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

export class ElevenLabsVoiceProvider implements TTSProvider {
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
      id: voice.voiceId ?? '',
      name: voice.name ?? '',
      description: voice.description ?? undefined,
      language: voice.labels?.language ?? undefined,
      metadata: {
        category: voice.category ?? '',
        ...(voice.previewUrl ? { previewUrl: voice.previewUrl } : {}),
        ...(() => {
          const { language, ...rest } = voice.labels ?? {};
          return rest;
        })(),
      },
    }));
  }

  async synthesize(input: TTSSynthesisInput): Promise<TTSSynthesisResult> {
    const voiceId = input.voiceId ?? this.defaultVoiceId;
    if (!voiceId) {
      throw new Error('Voice ID is required for ElevenLabs synthesis.');
    }

    const formatKey: AudioFormat = input.format ?? 'mp3';
    const outputFormat = FORMAT_MAP[formatKey] ?? FORMAT_MAP.mp3;
    const sampleRate =
      input.sampleRateHz ??
      SAMPLE_RATE[outputFormat] ??
      SAMPLE_RATE.mp3_44100_128 ??
      44100;

    const voiceSettings =
      input.stability != null || input.style != null
        ? {
            ...(input.stability != null ? { stability: input.stability } : {}),
            ...(input.style != null ? { style: input.style } : {}),
          }
        : undefined;

    const stream = await this.client.textToSpeech.convert(voiceId, {
      text: input.text,
      modelId: this.modelId,
      outputFormat,
      voiceSettings,
    });

    const rawAudio = await readWebStream(stream);

    return {
      audio: {
        data: rawAudio,
        format: formatKey,
        sampleRateHz: sampleRate,
      },
    };
  }
}

async function readWebStream(
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
    }
  }

  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
