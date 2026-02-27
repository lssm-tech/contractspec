import { describe, expect, it, vi } from 'bun:test';

import { MistralConversationalProvider } from './mistral-conversational';

describe('MistralConversationalProvider', () => {
  it('creates conversational sessions and emits transcript events', async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                role: 'assistant',
                content: 'Hi! How can I help?',
              },
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

    const provider = new MistralConversationalProvider({
      apiKey: 'test-key',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const session = await provider.startSession({
      voiceId: 'default',
      llmModel: 'mistral-small-latest',
      systemPrompt: 'You are helpful.',
    });

    const iterator = session.events[Symbol.asyncIterator]();

    const started = await iterator.next();
    expect(started.value).toMatchObject({
      type: 'session_started',
    });

    session.sendText('Hello');

    const emittedTypes: string[] = [];
    while (true) {
      const event = await iterator.next();
      const type = event.value?.type;
      if (!type) {
        break;
      }
      emittedTypes.push(type);
      if (type === 'agent_speech_ended') {
        break;
      }
    }

    expect(emittedTypes).toEqual([
      'user_speech_started',
      'user_speech_ended',
      'transcript',
      'agent_speech_started',
      'transcript',
      'agent_speech_ended',
    ]);

    const summary = await session.close();
    expect(summary.turns).toHaveLength(2);
    expect(summary.transcript).toContain('user: Hello');
    expect(summary.transcript).toContain('assistant: Hi! How can I help?');

    const ended = await iterator.next();
    expect(ended.value).toMatchObject({
      type: 'session_ended',
      reason: 'closed_by_client',
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = fetchImpl.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(requestUrl).toBe('https://api.mistral.ai/v1/chat/completions');
    expect(requestInit.method).toBe('POST');
    expect((requestInit.headers as Record<string, string>).Authorization).toBe(
      'Bearer test-key'
    );
  });
});
