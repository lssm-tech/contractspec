import { describe, expect, it, vi } from 'bun:test';

import { MistralSttProvider } from './mistral-stt';

describe('MistralSttProvider', () => {
  it('maps transcription payloads to STTTranscriptionResult', async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          text: 'hello world',
          language: 'en',
          segments: [
            {
              text: 'hello world',
              start: 0,
              end: 1.2,
              speaker: 'speaker-1',
              confidence: 0.98,
              words: [
                { word: 'hello', start: 0, end: 0.5, confidence: 0.97 },
                { word: 'world', start: 0.5, end: 1.2, confidence: 0.98 },
              ],
            },
          ],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    const provider = new MistralSttProvider({
      apiKey: 'test-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const result = await provider.transcribe({
      audio: {
        data: new Uint8Array([1, 2, 3]),
        format: 'wav',
        sampleRateHz: 16000,
      },
      language: 'en',
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = fetchImpl.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(requestUrl).toBe('https://api.mistral.ai/v1/audio/transcriptions');
    expect(requestInit.method).toBe('POST');
    expect((requestInit.headers as Record<string, string>).Authorization).toBe(
      'Bearer test-key'
    );

    expect(result.text).toBe('hello world');
    expect(result.language).toBe('en');
    expect(result.durationMs).toBe(1200);
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]?.speakerId).toBe('speaker-1');
    expect(result.wordTimings?.length).toBe(2);
    expect(result.speakers).toEqual([{ id: 'speaker-1', name: undefined }]);
  });

  it('throws when transcription request fails', async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response('invalid api key', {
        status: 401,
      });
    });

    const provider = new MistralSttProvider({
      apiKey: 'bad-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(
      provider.transcribe({
        audio: {
          data: new Uint8Array([1, 2, 3]),
          format: 'wav',
          sampleRateHz: 16000,
        },
      })
    ).rejects.toThrow('Mistral transcription request failed (401)');
  });
});
