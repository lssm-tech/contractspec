import { describe, expect, it } from 'bun:test';
import { MockLanguageModelV3 } from 'ai/test';
import { createAgentJsonRunner } from './json-runner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGenerateResult = (text: string): any => ({
  finishReason: 'stop',
  usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
  content: [{ type: 'text', text }],
  warnings: [],
  rawCall: { rawPrompt: null, rawSettings: {} },
});

describe('createAgentJsonRunner', () => {
  it('returns raw JSON text from the model', async () => {
    const runner = await createAgentJsonRunner({
      model: new MockLanguageModelV3({
        doGenerate: async () => mockGenerateResult('{"ok":true}'),
      }),
    });

    const result = await runner.generateJson('Return JSON');
    expect(result).toBe('{"ok":true}');
  });
});
