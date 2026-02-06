import type { FalClient } from '@fal-ai/client';
import { describe, expect, it, vi } from 'bun:test';

import { FalVoiceProvider } from './fal-voice';

describe('FalVoiceProvider', () => {
  it('lists default and configured voices', async () => {
    const provider = new FalVoiceProvider({
      apiKey: 'fal_test',
      defaultVoiceUrl: 'https://example.com/reference.mp3',
      client: createMockClient({ audio_url: 'https://example.com/audio.wav' }),
    });

    const voices = await provider.listVoices();

    expect(voices).toEqual([
      {
        id: 'default',
        name: 'Default Chatterbox Voice',
        description:
          'Uses the default model voice (or configured default reference audio URL).',
        metadata: {
          modelId: 'fal-ai/chatterbox/text-to-speech',
        },
      },
      {
        id: 'https://example.com/reference.mp3',
        name: 'Configured Reference Voice',
        description:
          'Reference voice configured at provider setup and used when voiceId is default.',
        previewUrl: 'https://example.com/reference.mp3',
        metadata: {
          modelId: 'fal-ai/chatterbox/text-to-speech',
          source: 'config.defaultVoiceUrl',
        },
      },
    ]);
  });

  it('synthesizes audio from Fal queue output URL', async () => {
    const client = createMockClient({
      audio_url: 'https://example.com/output.wav',
    });
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(new Uint8Array([10, 11, 12])));

    try {
      const provider = new FalVoiceProvider({
        apiKey: 'fal_test',
        client,
        defaultVoiceUrl: 'https://example.com/reference.mp3',
        pollIntervalMs: 250,
      });

      const result = await provider.synthesize({
        text: 'Hello from Fal',
        voiceId: 'default',
      });

      expect(client.subscribe).toHaveBeenCalledWith(
        'fal-ai/chatterbox/text-to-speech',
        {
          input: {
            text: 'Hello from Fal',
            audio_url: 'https://example.com/reference.mp3',
          },
          pollInterval: 250,
        }
      );
      expect(fetchSpy).toHaveBeenCalledWith('https://example.com/output.wav');
      expect(result).toEqual({
        audio: new Uint8Array([10, 11, 12]),
        format: 'wav',
        sampleRateHz: 24000,
        durationSeconds: undefined,
        url: 'https://example.com/output.wav',
      });
    } finally {
      fetchSpy.mockRestore();
    }
  });
});

function createMockClient(data: Record<string, unknown>): FalClient {
  return {
    subscribe: vi.fn(async () => ({
      data,
      requestId: 'req_123',
    })),
  } as unknown as FalClient;
}
