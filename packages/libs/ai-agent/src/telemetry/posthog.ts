import type { LanguageModel } from 'ai';
import type { TelemetryCollector, OperationMetricSample } from './adapter';
import type {
  PostHogClient,
  PostHogLLMConfig,
  PostHogTracingOptions,
} from './posthog-types';

// Re-export types for consumer convenience
export type {
  PostHogClient,
  PostHogLLMConfig,
  PostHogTracingOptions,
} from './posthog-types';

// =============================================================================
// Model Wrapping (LLM Analytics via @posthog/ai)
// =============================================================================

/**
 * Wrap a Vercel AI SDK LanguageModel with PostHog LLM tracing.
 *
 * Requires `@posthog/ai` and `posthog-node` to be installed as peer deps.
 * Automatically captures `$ai_generation` events for every LLM call,
 * including token usage, latency, cost, input/output, and tool metadata.
 *
 * These events power PostHog's LLM Analytics dashboard (Traces, Generations)
 * and are the basis for server-side Evaluations.
 *
 * @param model - AI SDK LanguageModel to wrap
 * @param config - PostHog configuration
 * @param overrides - Per-call tracing option overrides
 * @returns Wrapped LanguageModel that auto-reports to PostHog
 *
 * @example
 * ```typescript
 * import { createPostHogTracedModel } from '@contractspec/lib.ai-agent/telemetry/posthog';
 *
 * const model = await createPostHogTracedModel(
 *   anthropic('claude-sonnet-4-20250514'),
 *   { apiKey: process.env.POSTHOG_API_KEY },
 *   { posthogDistinctId: 'user_123' },
 * );
 * ```
 */
export async function createPostHogTracedModel(
  model: LanguageModel,
  config: PostHogLLMConfig,
  overrides?: PostHogTracingOptions
): Promise<LanguageModel> {
  const { withTracing } = await importPostHogAI();
  const phClient = await resolvePostHogClient(config);

  const tracingOptions: PostHogTracingOptions = {
    ...config.defaults,
    ...overrides,
  };

  return withTracing(model, phClient, tracingOptions) as LanguageModel;
}

// =============================================================================
// TelemetryCollector Implementation
// =============================================================================

/**
 * PostHog-backed telemetry collector.
 *
 * Implements the existing TelemetryCollector interface so it integrates
 * seamlessly with trackAgentStep(). Each OperationMetricSample is captured
 * as a PostHog $ai_generation event, bridging ContractSpec's evolution
 * engine with PostHog's LLM Analytics dashboard.
 *
 * @example
 * ```typescript
 * const collector = createPostHogTelemetryCollector({
 *   apiKey: process.env.POSTHOG_API_KEY,
 *   defaults: { posthogDistinctId: 'system' },
 * });
 * ```
 */
export class PostHogTelemetryCollector implements TelemetryCollector {
  private phClient: PostHogClient | undefined;
  private readonly config: PostHogLLMConfig;
  private initPromise: Promise<PostHogClient> | undefined;

  constructor(config: PostHogLLMConfig) {
    this.config = config;
    this.phClient = config.client;
  }

  async collect(sample: OperationMetricSample): Promise<void> {
    const client = await this.getClient();
    const metadata = asRecord(sample.metadata);
    const distinctId =
      this.config.defaults?.posthogDistinctId ??
      asString(metadata['actorId']) ??
      'system';
    const traceId =
      asString(metadata['traceId']) ?? this.config.defaults?.posthogTraceId;
    const sessionId = asString(metadata['sessionId']);
    const telemetryEvent = asString(metadata['telemetryEvent']);
    const event = telemetryEvent === 'span' ? '$ai_span' : '$ai_generation';
    const tokenUsage = metadata['tokenUsage'];
    const totalUsage = metadata['totalUsage'];
    const errorMessage = asString(metadata['errorMessage']);

    client.capture({
      distinctId,
      event,
      properties: {
        $ai_model:
          asString(metadata['responseModelId']) ?? sample.operation.name,
        $ai_provider: asString(metadata['provider']) ?? 'contractspec',
        $ai_latency: sample.durationMs / 1000,
        $ai_is_error: !sample.success,
        $ai_error: !sample.success ? errorMessage : undefined,
        $ai_trace_id: traceId,
        $ai_session_id: sessionId,
        $ai_span_id: asString(metadata['spanId']),
        $ai_parent_id: asString(metadata['parentSpanId']),
        $ai_span_name: asString(metadata['spanName']) ?? sample.operation.name,
        ...(tokenUsage ? mapTokenUsage(tokenUsage) : {}),
        ...(totalUsage ? mapTotalUsage(totalUsage) : {}),
        $ai_http_status: asNumber(metadata['httpStatus']),
        $ai_request_url: asString(metadata['requestUrl']),
        $ai_base_url: asString(metadata['baseUrl']),
        ...this.config.defaults?.posthogProperties,
        contractspec_operation: sample.operation.name,
        contractspec_version: sample.operation.version,
        contractspec_agent_id: asString(metadata['agentId']),
        contractspec_tenant_id: asString(metadata['tenantId']),
        contractspec_actor_id: asString(metadata['actorId']),
        contractspec_step_index: asNumber(metadata['stepIndex']),
        contractspec_step_started_at: asDateIso(metadata['stepStartedAt']),
        contractspec_finish_reason: asString(metadata['finishReason']),
        contractspec_finish_reason_raw: asString(metadata['rawFinishReason']),
        contractspec_tool_count: asNumber(metadata['toolCallCount']),
        contractspec_tool_name: asString(metadata['toolName']),
        contractspec_tool_call_args: metadata['toolCallArgs'],
        contractspec_tool_result_output: metadata['toolResultOutput'],
        contractspec_provider_metadata: metadata['providerMetadata'],
        contractspec_step_warnings: metadata['warnings'],
        contractspec_response_id: asString(metadata['responseId']),
        contractspec_response_model_id: asString(metadata['responseModelId']),
        contractspec_response_timestamp: asDateIso(
          metadata['responseTimestamp']
        ),
        contractspec_response_headers: metadata['responseHeaders'],
        contractspec_response_body: this.config.defaults?.posthogPrivacyMode
          ? undefined
          : metadata['responseBody'],
        contractspec_response_messages: this.config.defaults?.posthogPrivacyMode
          ? undefined
          : metadata['responseMessages'],
        contractspec_request_headers: metadata['requestHeaders'],
        contractspec_request_body: this.config.defaults?.posthogPrivacyMode
          ? undefined
          : metadata['requestBody'],
        contractspec_step_text: this.config.defaults?.posthogPrivacyMode
          ? undefined
          : metadata['stepText'],
        contractspec_step_reasoning_text: this.config.defaults
          ?.posthogPrivacyMode
          ? undefined
          : metadata['stepReasoningText'],
      },
      groups: this.config.defaults?.posthogGroups,
    });
  }

  /** Shut down the PostHog client (flushes pending events). */
  async shutdown(): Promise<void> {
    if (this.phClient?.shutdown) {
      await this.phClient.shutdown();
    }
  }

  private async getClient(): Promise<PostHogClient> {
    if (this.phClient) return this.phClient;
    if (!this.initPromise) {
      this.initPromise = resolvePostHogClient(this.config).then((client) => {
        this.phClient = client;
        return client;
      });
    }
    return this.initPromise;
  }
}

/** Create a PostHog-backed telemetry collector. */
export function createPostHogTelemetryCollector(
  config: PostHogLLMConfig
): PostHogTelemetryCollector {
  return new PostHogTelemetryCollector(config);
}

// =============================================================================
// Composite Collector
// =============================================================================

/**
 * Composite telemetry collector that forwards samples to multiple collectors.
 *
 * Useful when you want both PostHog LLM Analytics and the existing
 * evolution engine to receive the same telemetry data.
 *
 * @example
 * ```typescript
 * const composite = createCompositeTelemetryCollector([
 *   evolutionCollector,
 *   createPostHogTelemetryCollector({ apiKey: '...' }),
 * ]);
 * ```
 */
export class CompositeTelemetryCollector implements TelemetryCollector {
  private readonly collectors: TelemetryCollector[];

  constructor(collectors: TelemetryCollector[]) {
    this.collectors = collectors;
  }

  async collect(sample: OperationMetricSample): Promise<void> {
    await Promise.all(this.collectors.map((c) => c.collect(sample)));
  }
}

/** Create a composite telemetry collector. */
export function createCompositeTelemetryCollector(
  collectors: TelemetryCollector[]
): CompositeTelemetryCollector {
  return new CompositeTelemetryCollector(collectors);
}

// =============================================================================
// Helpers
// =============================================================================

async function importPostHogAI(): Promise<{
  withTracing: (...args: unknown[]) => unknown;
}> {
  try {
    return await (import('@posthog/ai') as Promise<{
      withTracing: (...args: unknown[]) => unknown;
    }>);
  } catch {
    throw new Error(
      'PostHog LLM Analytics requires @posthog/ai to be installed. ' +
        'Run: npm install @posthog/ai posthog-node'
    );
  }
}

async function resolvePostHogClient(
  config: PostHogLLMConfig
): Promise<PostHogClient> {
  if (config.client) return config.client;
  if (!config.apiKey) {
    throw new Error(
      'PostHog LLM Analytics requires either a client instance or an apiKey.'
    );
  }

  try {
    const { PostHog } = await import('posthog-node');
    return new PostHog(config.apiKey, {
      host: config.host ?? 'https://us.i.posthog.com',
    }) as unknown as PostHogClient;
  } catch {
    throw new Error(
      'PostHog LLM Analytics requires posthog-node to be installed. ' +
        'Run: npm install posthog-node'
    );
  }
}

function mapTokenUsage(
  usage: unknown
): Record<string, number | Record<string, unknown> | undefined> {
  const usageRecord = asRecord(usage);
  const inputTokenDetails = asRecord(usageRecord['inputTokenDetails']);
  const outputTokenDetails = asRecord(usageRecord['outputTokenDetails']);

  return {
    $ai_input_tokens:
      asNumber(usageRecord['inputTokens']) ??
      asNumber(usageRecord['promptTokens']),
    $ai_output_tokens:
      asNumber(usageRecord['outputTokens']) ??
      asNumber(usageRecord['completionTokens']),
    $ai_reasoning_tokens:
      asNumber(outputTokenDetails['reasoningTokens']) ??
      asNumber(usageRecord['reasoningTokens']),
    $ai_cache_read_input_tokens:
      asNumber(inputTokenDetails['cacheReadTokens']) ??
      asNumber(usageRecord['cachedInputTokens']),
    $ai_cache_creation_input_tokens: asNumber(
      inputTokenDetails['cacheWriteTokens']
    ),
    $ai_usage: maybeRecord(usageRecord['raw']) ?? usageRecord,
  };
}

function mapTotalUsage(
  usage: unknown
): Record<string, number | Record<string, unknown> | undefined> {
  const usageRecord = asRecord(usage);
  return {
    contractspec_total_input_tokens: asNumber(usageRecord['inputTokens']),
    contractspec_total_output_tokens: asNumber(usageRecord['outputTokens']),
    contractspec_total_tokens: asNumber(usageRecord['totalTokens']),
    contractspec_total_usage_raw:
      maybeRecord(usageRecord['raw']) ?? usageRecord,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function maybeRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function asDateIso(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString();
  return undefined;
}
