import type { Gradium } from '@confiture-ai/gradium-sdk-js';
import { describe, expect, it, vi } from 'bun:test';

import { GradiumVoiceProvider } from './gradium-voice';

describe('GradiumVoiceProvider', () => {
  it('lists available voices', async () => {
    const client = createMockClient();
    const provider = new GradiumVoiceProvider({
      apiKey: 'gd_test',
      client,
    });

    const voices = await provider.listVoices();

    expect(client.voices.list).toHaveBeenCalledWith({ include_catalog: true });
    expect(voices).toEqual([
      {
        id: 'voice-1',
        name: 'Emma',
        description: 'Default English voice',
        language: 'en',
        metadata: {
          startSeconds: '0',
          stopSeconds: '5',
          filename: 'emma.wav',
        },
      },
    ]);
  });

  it('synthesizes audio and maps ogg to opus output format', async () => {
    const client = createMockClient();
    const provider = new GradiumVoiceProvider({
      apiKey: 'gd_test',
      client,
      defaultVoiceId: 'voice-1',
    });

    const result = await provider.synthesize({
      text: 'Hello from Gradium',
      format: 'ogg',
    });

    expect(client.tts.create).toHaveBeenCalledWith({
      voice_id: 'voice-1',
      output_format: 'opus',
      text: 'Hello from Gradium',
    });
    expect(result).toEqual({
      audio: new Uint8Array([1, 2, 3, 4]),
      format: 'ogg',
      sampleRateHz: 24000,
      durationSeconds: undefined,
      url: undefined,
    });
  });
});

function createMockClient(): Gradium {
  return {
    voices: {
      list: vi.fn(async () => [
        {
          uid: 'voice-1',
          name: 'Emma',
          description: 'Default English voice',
          language: 'en',
          start_s: 0,
          stop_s: 5,
          filename: 'emma.wav',
        },
      ]),
    },
    tts: {
      create: vi.fn(async () => ({
        raw_data: new Uint8Array([1, 2, 3, 4]),
        sample_rate: 24000,
        request_id: 'req-1',
      })),
    },
  } as unknown as Gradium;
}
