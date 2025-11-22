import { Readable } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';

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

    expect(client.generate).toHaveBeenCalled();
    expect(result.audio).toBeInstanceOf(Uint8Array);
    expect(result.audio.length).toBeGreaterThan(0);
  });
});

function createMockClient() {
  const stream = buildReadable(Buffer.from('audio-bytes'));
  return {
    voices: {
      getAll: vi.fn(async () => ({
        voices: [
          {
            voice_id: 'voice-1',
            name: 'Sample Voice',
            description: 'Friendly voice',
            labels: { language: 'en' },
            category: 'professional',
            preview_url: 'https://example.com/preview.mp3',
          },
        ],
      })),
    },
    generate: vi.fn(async () => stream),
  } as unknown as any;
}

function buildReadable(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}
