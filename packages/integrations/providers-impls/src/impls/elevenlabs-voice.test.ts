import { describe, expect, it, vi } from 'bun:test';

import { ElevenLabsVoiceProvider } from './elevenlabs-voice';

describe('ElevenLabsVoiceProvider', () => {
  it('lists available voices', async () => {
    const client = createMockClient();
    const provider = new ElevenLabsVoiceProvider({
      apiKey: 'test',
      client,
    });

    const voices = await provider.listVoices();
    expect(client.voices.getAll).toHaveBeenCalled();
    expect(voices).toEqual([
      {
        id: 'voice-1',
        name: 'Sample Voice',
        description: 'Friendly voice',
        language: 'en',
        metadata: {
          category: 'professional',
          previewUrl: 'https://example.com/preview.mp3',
        },
      },
    ]);
  });

  it('synthesizes audio into a buffer', async () => {
    const client = createMockClient();
    const provider = new ElevenLabsVoiceProvider({
      apiKey: 'test',
      client,
      defaultVoiceId: 'voice-1',
    });

    const result = await provider.synthesize({
      text: 'Hello world',
    });

    expect(client.textToSpeech.convert).toHaveBeenCalled();
    expect(result.audio.data).toBeInstanceOf(Uint8Array);
    expect(result.audio.data.length).toBeGreaterThan(0);
  });
});

function createMockClient() {
  const stream = buildWebReadableStream(Buffer.from('audio-bytes'));
  return {
    voices: {
      getAll: vi.fn(async () => ({
        voices: [
          {
            voiceId: 'voice-1',
            name: 'Sample Voice',
            description: 'Friendly voice',
            labels: { language: 'en' },
            category: 'professional',
            previewUrl: 'https://example.com/preview.mp3',
          },
        ],
      })),
    },
    textToSpeech: {
      convert: vi.fn(async () => stream),
    },
    generate: vi.fn(async () => stream),
  } as Record<string, unknown>;
}

function buildWebReadableStream(buffer: Buffer): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });
}
