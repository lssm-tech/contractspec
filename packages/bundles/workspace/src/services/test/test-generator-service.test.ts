import { describe, expect, it, mock } from 'bun:test';
import { TestGeneratorService } from './test-generator-service';
import type { OperationSpec } from '@contractspec/lib.contracts';
import type { LanguageModel } from 'ai';
import type { LoggerAdapter } from '../../ports/logger';

// Mock lib.ai-agent
const mockGenerateText = mock(async () => ({
  text: JSON.stringify({
    fixtures: [],
    scenarios: [
      {
        key: 'happy_path',
        when: { operation: { key: 'test.op' }, input: {} },
        then: [{ type: 'expectOutput', match: { success: true } }],
      },
    ],
  }),
  usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
}));

mock.module('ai', () => ({
  generateText: mockGenerateText,
}));

describe('TestGeneratorService', () => {
  const logger = {
    info: mock(),
    error: mock(),
    debug: mock(),
    warn: mock(),
  } as unknown as LoggerAdapter;

  const service = new TestGeneratorService(
    logger,
    {} as unknown as LanguageModel
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sampleOp: OperationSpec<any, any> = {
    meta: {
      kind: 'command',
      key: 'test.op',
      version: '1.0.0',
      owners: ['@team'],
      stability: 'stable',
      title: 'Test Operation',
      description: 'Test description',
      tags: [],
      goal: 'Test goal',
      context: 'Test context',
    },
    io: {
      input: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      output: {} as any,
    },
    policy: {
      auth: 'user',
    },
  };

  it('should generate a valid TestSpec from an Operation', async () => {
    const result = await service.generateTests(sampleOp);

    expect(result).toBeDefined();
    expect(result.meta.key).toBe('test.op.test');
    expect(result.target.type).toBe('operation');
    expect(result.scenarios).toHaveLength(1);
    expect(result.scenarios[0]?.key).toBe('happy_path');
    expect(mockGenerateText).toHaveBeenCalled();
  });

  it('should handle AI errors gracefully', async () => {
    mockGenerateText.mockRejectedValueOnce(new Error('AI Busy'));
    expect(service.generateTests(sampleOp)).rejects.toThrow('AI Busy');
    expect(logger.error).toHaveBeenCalled();
  });
});
