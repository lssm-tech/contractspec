/**
 * PostHog LLM Analytics type definitions.
 *
 * Shared types for PostHog integration. Separated from implementation
 * to allow importing types without pulling in dynamic imports.
 */

// =============================================================================
// Tracing Options
// =============================================================================

/**
 * PostHog tracing options passed to @posthog/ai withTracing wrapper.
 * These enrich captured $ai_generation events with contextual data.
 *
 * @see https://posthog.com/docs/llm-analytics/installation/vercel-ai
 */
export interface PostHogTracingOptions {
  /** Distinct user ID for attribution */
  posthogDistinctId?: string;
  /** Trace ID for grouping related generations */
  posthogTraceId?: string;
  /** Optional model id override */
  posthogModelOverride?: string;
  /** Optional provider override */
  posthogProviderOverride?: string;
  /** Optional explicit token pricing override */
  posthogCostOverride?: PostHogCostOverride;
  /** Custom properties attached to every generation event */
  posthogProperties?: Record<string, unknown>;
  /** When true, input/output content is redacted */
  posthogPrivacyMode?: boolean;
  /** Group analytics (e.g., { company: "companyId" }) */
  posthogGroups?: Record<string, string>;
  /** Sends events immediately (useful for short-lived/serverless contexts) */
  posthogCaptureImmediate?: boolean;
}

export interface PostHogCostOverride {
  inputCost: number;
  outputCost: number;
}

// =============================================================================
// Client Interface
// =============================================================================

/**
 * Minimal interface for posthog-node PostHog client.
 * Avoids hard dependency on posthog-node types.
 */
export interface PostHogClient {
  capture(params: {
    distinctId: string;
    event: string;
    properties?: Record<string, unknown>;
    groups?: Record<string, string>;
  }): void;
  shutdown?(): Promise<void>;
}

// =============================================================================
// Configuration
// =============================================================================

/**
 * Configuration for PostHog LLM Analytics integration.
 *
 * Provide either an existing PostHog client instance or
 * apiKey + host to create one internally.
 *
 * PostHog Evaluations (Relevance, Helpfulness, Hallucination, Toxicity,
 * Jailbreak, and custom prompts) run server-side on captured $ai_generation
 * events. Configure them in PostHog UI under LLM Analytics > Evaluations.
 *
 * @see https://posthog.com/docs/llm-analytics/evaluations
 */
export interface PostHogLLMConfig {
  /** Existing posthog-node client instance */
  client?: PostHogClient;
  /** PostHog project API key (used when client is not provided) */
  apiKey?: string;
  /** PostHog ingestion host (defaults to https://us.i.posthog.com) */
  host?: string;
  /** Default tracing options applied to all wrapped models */
  defaults?: PostHogTracingOptions;
}
