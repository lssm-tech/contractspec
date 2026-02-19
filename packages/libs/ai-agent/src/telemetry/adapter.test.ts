import { describe, expect, it } from 'bun:test';
import type { StepResult, ToolSet } from 'ai';
import { InMemoryTelemetryCollector, trackAgentStep } from './adapter';

function makeStep(
  overrides?: Partial<StepResult<ToolSet>>
): StepResult<ToolSet> {
  return {
    finishReason: 'stop',
    toolCalls: [],
    toolResults: [],
    usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
    text: 'ok',
    content: [],
    ...overrides,
  } as unknown as StepResult<ToolSet>;
}

describe('trackAgentStep', () => {
  it('parses agent version suffix from id', async () => {
    const collector = new InMemoryTelemetryCollector();
    await trackAgentStep(collector, 'support.bot.v12', makeStep(), 50);

    const samples = collector.getSamples();
    expect(samples).toHaveLength(1);
    expect(samples[0]?.operation.name).toBe('support.bot');
    expect(samples[0]?.operation.version).toBe('12');
  });

  it('creates tool spans and generation samples with trace context', async () => {
    const collector = new InMemoryTelemetryCollector();
    const step = makeStep({
      toolCalls: [
        {
          type: 'tool-call',
          toolCallId: 'tc_1',
          toolName: 'search_docs',
          input: { query: 'trace' },
        },
      ],
      toolResults: [
        {
          type: 'tool-result',
          toolCallId: 'tc_1',
          toolName: 'search_docs',
          input: { query: 'trace' },
          output: { hits: 3 },
        },
      ],
      response: {
        id: 'span_root',
        modelId: 'claude-test',
        timestamp: new Date(),
        messages: [],
      },
    });

    await trackAgentStep(collector, 'support.bot.v1', step, 1200, {
      traceId: 'trace_abc',
      sessionId: 'sess_abc',
      actorId: 'user_123',
      tenantId: 'tenant_1',
      stepIndex: 2,
      stepStartedAt: new Date(),
    });

    const samples = collector.getSamples();
    expect(samples).toHaveLength(2);

    const spanSample = samples.find(
      (sample) => sample.metadata?.['telemetryEvent'] === 'span'
    );
    expect(spanSample?.metadata?.['traceId']).toBe('trace_abc');
    expect(spanSample?.metadata?.['sessionId']).toBe('sess_abc');
    expect(spanSample?.metadata?.['parentSpanId']).toBe('span_root');

    const generationSample = samples.find(
      (sample) => sample.metadata?.['telemetryEvent'] === 'generation'
    );
    expect(generationSample?.metadata?.['responseModelId']).toBe('claude-test');
    expect(generationSample?.metadata?.['stepIndex']).toBe(2);
  });
});
