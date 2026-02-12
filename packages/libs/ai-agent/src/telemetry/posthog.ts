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
    const distinctId =
      this.config.defaults?.posthogDistinctId ??
      (sample.metadata?.['actorId'] as string | undefined) ??
      'system';

    client.capture({
      distinctId,
      event: '$ai_generation',
      properties: {
        $ai_model: sample.operation.name,
        $ai_provider: 'contractspec',
        $ai_latency: sample.durationMs / 1000,
        $ai_is_error: !sample.success,
        $ai_trace_id: this.config.defaults?.posthogTraceId,
        ...(sample.metadata?.['tokenUsage']
          ? mapTokenUsage(
              sample.metadata['tokenUsage'] as Record<string, number>
            )
          : {}),
        ...this.config.defaults?.posthogProperties,
        contractspec_operation: sample.operation.name,
        contractspec_version: sample.operation.version,
        contractspec_agent_id: sample.metadata?.['agentId'] as
          | string
          | undefined,
        contractspec_finish_reason: sample.metadata?.['finishReason'] as
          | string
          | undefined,
        contractspec_tool_count: sample.metadata?.['toolCallCount'] as
          | number
          | undefined,
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
  usage: Record<string, number>
): Record<string, number | undefined> {
  return {
    $ai_input_tokens: usage['promptTokens'],
    $ai_output_tokens: usage['completionTokens'],
  };
}
