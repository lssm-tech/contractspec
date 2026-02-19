import { describe, it, expect } from 'bun:test';
import {
  PostHogTelemetryCollector,
  createPostHogTelemetryCollector,
  createCompositeTelemetryCollector,
} from './posthog';
import type { PostHogClient } from './posthog';
import type { OperationMetricSample } from './adapter';
import { InMemoryTelemetryCollector } from './adapter';

// =============================================================================
// Test Helpers
// =============================================================================

interface CapturedEvent {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
  groups?: Record<string, string>;
}

/**
 * Assert a value is defined and narrow its type.
 * Throws a test-friendly error if the value is undefined.
 */
function assertDefined<T>(value: T | undefined, label = 'value'): T {
  if (value === undefined) {
    throw new Error(`Expected ${label} to be defined`);
  }
  return value;
}

function createMockPostHogClient(): PostHogClient & {
  captured: CapturedEvent[];
} {
  const captured: CapturedEvent[] = [];
  return {
    captured,
    capture(params: CapturedEvent) {
      captured.push(params);
    },
    async shutdown() {
      /* noop */
    },
  };
}

function createSample(
  overrides?: Partial<OperationMetricSample>
): OperationMetricSample {
  return {
    operation: { name: 'support.bot', version: '1.0.0' },
    durationMs: 1500,
    success: true,
    timestamp: new Date(),
    ...overrides,
  };
}

// =============================================================================
// PostHogTelemetryCollector Tests
// =============================================================================

describe('PostHogTelemetryCollector', () => {
  it('captures $ai_generation event from OperationMetricSample', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    const sample = createSample({
      metadata: {
        agentId: 'support.bot.v1',
        finishReason: 'stop',
        tokenUsage: { promptTokens: 100, completionTokens: 50 },
        toolCallCount: 2,
      },
    });

    await collector.collect(sample);

    expect(mockClient.captured).toHaveLength(1);
    const event = assertDefined(mockClient.captured[0], 'captured event');
    expect(event.event).toBe('$ai_generation');
    expect(event.properties?.$ai_model).toBe('support.bot');
    expect(event.properties?.$ai_provider).toBe('contractspec');
    expect(event.properties?.$ai_latency).toBe(1.5);
    expect(event.properties?.$ai_is_error).toBe(false);
    expect(event.properties?.$ai_input_tokens).toBe(100);
    expect(event.properties?.$ai_output_tokens).toBe(50);
    expect(event.properties?.contractspec_agent_id).toBe('support.bot.v1');
    expect(event.properties?.contractspec_finish_reason).toBe('stop');
    expect(event.properties?.contractspec_tool_count).toBe(2);
  });

  it('uses actorId as distinctId when no default provided', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(
      createSample({
        metadata: { actorId: 'user_456' },
      })
    );

    const captured = assertDefined(mockClient.captured[0], 'captured event');
    expect(captured.distinctId).toBe('user_456');
  });

  it('falls back to "system" distinctId when none available', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(createSample());

    const captured = assertDefined(mockClient.captured[0], 'captured event');
    expect(captured.distinctId).toBe('system');
  });

  it('marks failed operations with $ai_is_error', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(createSample({ success: false, durationMs: 500 }));

    const captured = assertDefined(mockClient.captured[0], 'captured event');
    expect(captured.properties?.$ai_is_error).toBe(true);
  });

  it('forwards default tracing properties and groups', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({
      client: mockClient,
      defaults: {
        posthogDistinctId: 'default_user',
        posthogTraceId: 'trace_abc',
        posthogProperties: { env: 'production' },
        posthogGroups: { company: 'acme' },
      },
    });

    await collector.collect(createSample());

    const event = assertDefined(mockClient.captured[0], 'captured event');
    expect(event.distinctId).toBe('default_user');
    expect(event.properties?.$ai_trace_id).toBe('trace_abc');
    expect(event.properties?.env).toBe('production');
    expect(event.groups).toEqual({ company: 'acme' });
  });

  it('prefers default distinctId over actorId metadata', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({
      client: mockClient,
      defaults: { posthogDistinctId: 'default_user' },
    });

    await collector.collect(
      createSample({ metadata: { actorId: 'user_789' } })
    );

    const captured = assertDefined(mockClient.captured[0], 'captured event');
    expect(captured.distinctId).toBe('default_user');
  });

  it('converts durationMs to seconds for $ai_latency', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(createSample({ durationMs: 2500 }));

    const captured = assertDefined(mockClient.captured[0], 'captured event');
    expect(captured.properties?.$ai_latency).toBe(2.5);
  });

  it('includes contractspec-specific context properties', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(
      createSample({
        operation: { name: 'search.agent', version: '2.1.0' },
      })
    );

    const event = assertDefined(mockClient.captured[0], 'captured event');
    expect(event.properties?.contractspec_operation).toBe('search.agent');
    expect(event.properties?.contractspec_version).toBe('2.1.0');
  });

  it('captures $ai_span when telemetryEvent is span', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(
      createSample({
        metadata: {
          telemetryEvent: 'span',
          traceId: 'trace_xyz',
          sessionId: 'sess_123',
          spanId: 'span_1',
          parentSpanId: 'span_root',
          spanName: 'tool.search',
        },
      })
    );

    const event = assertDefined(mockClient.captured[0], 'captured event');
    expect(event.event).toBe('$ai_span');
    expect(event.properties?.$ai_trace_id).toBe('trace_xyz');
    expect(event.properties?.$ai_session_id).toBe('sess_123');
    expect(event.properties?.$ai_span_id).toBe('span_1');
    expect(event.properties?.$ai_parent_id).toBe('span_root');
    expect(event.properties?.$ai_span_name).toBe('tool.search');
  });

  it('maps extended usage details when present', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(
      createSample({
        metadata: {
          tokenUsage: {
            inputTokens: 120,
            outputTokens: 80,
            inputTokenDetails: { cacheReadTokens: 30, cacheWriteTokens: 10 },
            outputTokenDetails: { reasoningTokens: 20 },
            raw: { provider: 'test' },
          },
        },
      })
    );

    const event = assertDefined(mockClient.captured[0], 'captured event');
    expect(event.properties?.$ai_input_tokens).toBe(120);
    expect(event.properties?.$ai_output_tokens).toBe(80);
    expect(event.properties?.$ai_cache_read_input_tokens).toBe(30);
    expect(event.properties?.$ai_cache_creation_input_tokens).toBe(10);
    expect(event.properties?.$ai_reasoning_tokens).toBe(20);
    expect(event.properties?.$ai_usage).toEqual({ provider: 'test' });
  });

  it('handles samples without metadata gracefully', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(
      createSample({
        metadata: undefined,
      })
    );

    expect(mockClient.captured).toHaveLength(1);
    const event = assertDefined(mockClient.captured[0], 'captured event');
    expect(event.properties?.$ai_input_tokens).toBeUndefined();
    expect(event.properties?.$ai_output_tokens).toBeUndefined();
    expect(event.properties?.contractspec_agent_id).toBeUndefined();
  });

  it('throws when neither client nor apiKey is provided', async () => {
    const collector = createPostHogTelemetryCollector({});

    await expect(collector.collect(createSample())).rejects.toThrow(
      'PostHog LLM Analytics requires either a client instance or an apiKey'
    );
  });

  it('reuses the same client across multiple collect calls', async () => {
    const mockClient = createMockPostHogClient();
    const collector = createPostHogTelemetryCollector({ client: mockClient });

    await collector.collect(createSample());
    await collector.collect(createSample({ success: false }));
    await collector.collect(createSample({ durationMs: 3000 }));

    expect(mockClient.captured).toHaveLength(3);
  });

  it('calls shutdown on the underlying client', async () => {
    let shutdownCalled = false;
    const mockClient: PostHogClient = {
      capture() {
        /* noop */
      },
      async shutdown() {
        shutdownCalled = true;
      },
    };

    const collector = new PostHogTelemetryCollector({ client: mockClient });
    await collector.shutdown();

    expect(shutdownCalled).toBe(true);
  });
});

// =============================================================================
// CompositeTelemetryCollector Tests
// =============================================================================

describe('CompositeTelemetryCollector', () => {
  it('forwards samples to all collectors', async () => {
    const mockClient = createMockPostHogClient();
    const posthogCollector = createPostHogTelemetryCollector({
      client: mockClient,
    });
    const inMemoryCollector = new InMemoryTelemetryCollector();

    const composite = createCompositeTelemetryCollector([
      posthogCollector,
      inMemoryCollector,
    ]);

    const sample = createSample();
    await composite.collect(sample);

    expect(mockClient.captured).toHaveLength(1);
    expect(inMemoryCollector.getSamples()).toHaveLength(1);
  });

  it('handles empty collector list', async () => {
    const composite = createCompositeTelemetryCollector([]);
    await composite.collect(createSample());
    // Should not throw
  });

  it('forwards to multiple PostHog collectors with different configs', async () => {
    const client1 = createMockPostHogClient();
    const client2 = createMockPostHogClient();

    const composite = createCompositeTelemetryCollector([
      createPostHogTelemetryCollector({
        client: client1,
        defaults: { posthogDistinctId: 'env_a' },
      }),
      createPostHogTelemetryCollector({
        client: client2,
        defaults: { posthogDistinctId: 'env_b' },
      }),
    ]);

    await composite.collect(createSample());

    const captured1 = assertDefined(client1.captured[0], 'client1 captured');
    expect(captured1.distinctId).toBe('env_a');
    const captured2 = assertDefined(client2.captured[0], 'client2 captured');
    expect(captured2.distinctId).toBe('env_b');
  });
});
