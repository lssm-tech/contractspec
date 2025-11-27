import type { Mistral } from '@mistralai/mistralai';
import type * as components from '@mistralai/mistralai/models/components/index.js';
import { describe, expect, it, vi } from 'bun:test';

import { MistralLLMProvider } from './mistral-llm';

const usage: components.UsageInfo = {
  promptTokens: 5,
  completionTokens: 7,
  totalTokens: 12,
};

describe('MistralLLMProvider', () => {
  it('maps chat responses into LLMResponse', async () => {
    const client = createMockClient();
    const provider = new MistralLLMProvider({
      apiKey: 'test-key',
      client,
      defaultModel: 'mistral-small-latest',
    });

    const response = await provider.chat([
      { role: 'user', content: [{ type: 'text', text: 'Hello' }] },
    ]);

    expect(client.chat.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
      })
    );
    expect(response.message.content).toEqual([
      { type: 'text', text: 'Hello from Mistral' },
    ]);
    expect(response.usage).toEqual({
      promptTokens: 5,
      completionTokens: 7,
      totalTokens: 12,
    });
  });

  it('streams deltas and aggregates final response', async () => {
    const client = createMockClient();
    const provider = new MistralLLMProvider({
      apiKey: 'test-key',
      client,
      defaultModel: 'mistral-small-latest',
    });

    const events = provider.stream([
      { role: 'user', content: [{ type: 'text', text: 'Hello' }] },
    ]);

    const chunks = [];
    for await (const chunk of events) {
      chunks.push(chunk);
    }

    expect(chunks[0]).toMatchObject({
      type: 'message_delta',
      delta: { type: 'text', text: 'Partial' },
    });
    expect(chunks[1]).toMatchObject({
      type: 'usage',
      usage: {
        promptTokens: 5,
        completionTokens: 7,
        totalTokens: 12,
      },
    });
    expect(chunks[2]).toMatchObject({
      type: 'end',
      response: {
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: 'Partial' }],
        },
      },
    });
  });

  it('throws for unsupported token counting', async () => {
    const client = createMockClient();
    const provider = new MistralLLMProvider({
      apiKey: 'test-key',
      client,
    });
    await expect(
      provider.countTokens([
        { role: 'user', content: [{ type: 'text', text: 'Hello' }] },
      ])
    ).rejects.toThrow();
  });
});

function createMockClient() {
  const completeResponse: components.ChatCompletionResponse = {
    id: 'chat',
    object: 'chat.completion',
    model: 'mistral-small-latest',
    created: Date.now(),
    usage,
    choices: [
      {
        index: 0,
        finishReason: 'stop',
        message: {
          role: 'assistant',
          content: 'Hello from Mistral',
          toolCalls: null,
          prefix: false,
        },
      },
    ],
  };

  const streamEvents: components.CompletionEvent[] = [
    {
      data: {
        id: 'event-1',
        model: 'mistral-small-latest',
        choices: [
          {
            index: 0,
            delta: { content: 'Partial' },
            finishReason: null,
          },
        ],
      },
    },
    {
      data: {
        id: 'event-2',
        model: 'mistral-small-latest',
        usage,
        choices: [
          {
            index: 0,
            delta: { content: '' },
            finishReason: 'stop',
          },
        ],
      },
    },
  ];

  return {
    chat: {
      complete: vi.fn(async () => completeResponse),
      stream: vi.fn(async () => asyncIterable(streamEvents)),
    },
  } as unknown as Mistral;
}

function asyncIterable<T>(items: T[]): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const item of items) {
        yield item;
      }
    },
  };
}
