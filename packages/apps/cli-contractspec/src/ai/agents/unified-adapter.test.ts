import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { UnifiedAgentAdapter } from './unified-adapter';
import type { AgentTask } from './types';

// Mock lib.ai-agent unified-agent module
const mockRun = mock((_prompt: string) =>
  Promise.resolve({
    text: 'generated code',
    finishReason: 'stop',
    usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
  })
);

mock.module('@contractspec/lib.ai-agent/agent/unified-agent', () => ({
  createUnifiedAgent: () => ({
    run: mockRun,
  }),
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  UnifiedAgent: class {},
}));

describe('UnifiedAgentAdapter', () => {
  let adapter: UnifiedAgentAdapter;

  beforeEach(() => {
    mockRun.mockClear();
    adapter = new UnifiedAgentAdapter('claude-agent-sdk', {
      backend: 'claude-agent-sdk',
    });
  });

  it('should initialize with correct name', () => {
    expect(adapter.name).toBe('claude-agent-sdk');
  });

  it('should handle generate tasks', async () => {
    const task: AgentTask = {
      type: 'generate',
      specCode: 'spec',
      existingCode: 'code',
    };

    const result = await adapter.generate(task);

    expect(result.success).toBe(true);
    expect(result.code).toBe('generated code');
    expect(mockRun).toHaveBeenCalled();
    // check prompt content roughly
    const calls = mockRun.mock.calls;
    if (
      calls.length > 0 &&
      calls[0] &&
      Array.isArray(calls[0]) &&
      calls[0].length > 0
    ) {
      const callArg = String(calls[0][0]);
      expect(callArg).toContain('Specification:\nspec');
      expect(callArg).toContain('Existing Code:\ncode');
    }
  });

  it('should handle validation tasks', async () => {
    const task: AgentTask = {
      type: 'validate',
      specCode: 'spec',
      existingCode: 'code',
    };

    const result = await adapter.validate(task);

    expect(result.success).toBe(true);
    expect(result.code).toBe('generated code'); // Validation returns code/text too
    expect(mockRun).toHaveBeenCalled();
    const calls = mockRun.mock.calls;
    if (
      calls.length > 0 &&
      calls[0] &&
      Array.isArray(calls[0]) &&
      calls[0].length > 0
    ) {
      const callArg = String(calls[0][0]);
      expect(callArg).toContain('Validate if the existing code');
    }
  });
});
