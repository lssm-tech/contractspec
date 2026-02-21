import { Gradium } from '@confiture-ai/gradium-sdk-js';
import type {
  Region,
  TTSOutputFormat,
  Voice as GradiumVoice,
} from '@confiture-ai/gradium-sdk-js';

import type {
  AudioFormat,
  Voice,
  TTSProvider,
  TTSSynthesisInput,
  TTSSynthesisResult,
} from '../voice';

type GradiumClient = Gradium;

const FORMAT_MAP: Record<AudioFormat, TTSOutputFormat> = {
  mp3: 'wav',
  wav: 'wav',
  ogg: 'opus',
  pcm: 'pcm',
  opus: 'opus',
};

export interface GradiumVoiceProviderOptions {
  apiKey: string;
  defaultVoiceId?: string;
  region?: Region;
  baseUrl?: string;
  timeoutMs?: number;
  outputFormat?: TTSOutputFormat;
  client?: GradiumClient;
}

export class GradiumVoiceProvider implements TTSProvider {
  private readonly client: GradiumClient;
  private readonly defaultVoiceId?: string;
  private readonly defaultOutputFormat?: TTSOutputFormat;

  constructor(options: GradiumVoiceProviderOptions) {
    this.client =
      options.client ??
      new Gradium({
        apiKey: options.apiKey,
        region: options.region,
        baseURL: options.baseUrl,
        timeout: options.timeoutMs,
      });
    this.defaultVoiceId = options.defaultVoiceId;
    this.defaultOutputFormat = options.outputFormat;
  }

  async listVoices(): Promise<Voice[]> {
    const voices = await this.client.voices.list({ include_catalog: true });
    return voices.map((voice) => this.fromGradiumVoice(voice));
  }

  async synthesize(input: TTSSynthesisInput): Promise<TTSSynthesisResult> {
    const voiceId = input.voiceId ?? this.defaultVoiceId;
    if (!voiceId) {
      throw new Error('Voice ID is required for Gradium synthesis.');
    }

    const outputFormat =
      (input.format ? FORMAT_MAP[input.format] : undefined) ??
      this.defaultOutputFormat ??
      'wav';

    const response = await this.client.tts.create({
      voice_id: voiceId,
      output_format: outputFormat,
      text: input.text,
    });

    const format: AudioFormat = input.format ?? toContractFormat(outputFormat);
    const sampleRate =
      input.sampleRateHz ??
      response.sample_rate ??
      inferSampleRate(outputFormat);

    return {
      audio: {
        data: response.raw_data,
        format,
        sampleRateHz: sampleRate,
      },
    };
  }

  private fromGradiumVoice(voice: GradiumVoice): Voice {
    return {
      id: voice.uid,
      name: voice.name,
      description: voice.description ?? undefined,
      language: voice.language ?? undefined,
      metadata: {
        startSeconds: String(voice.start_s),
        ...(voice.stop_s != null ? { stopSeconds: String(voice.stop_s) } : {}),
        filename: voice.filename,
      },
    };
  }
}

function toContractFormat(format: TTSOutputFormat): AudioFormat {
  switch (format) {
    case 'opus':
      return 'opus';
    case 'wav':
      return 'wav';
    case 'pcm':
    case 'pcm_16000':
    case 'pcm_24000':
      return 'pcm';
    default:
      return format as AudioFormat;
  }
}

function inferSampleRate(format: TTSOutputFormat): number {
  switch (format) {
    case 'ulaw_8000':
    case 'alaw_8000':
      return 8000;
    case 'pcm_16000':
      return 16000;
    case 'pcm_24000':
      return 24000;
    default:
      return 48000;
  }
}
