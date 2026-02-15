import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { TelemetrySpec } from '@contractspec/lib.contracts-spec/telemetry/spec';

/**
 * PostHog LLM Analytics telemetry spec.
 *
 * Defines the telemetry events captured by the @posthog/ai integration
 * for LLM observability. Events are captured via withTracing() model wrapping
 * or the PostHogTelemetryCollector bridge.
 *
 * PostHog Evaluations (Relevance, Helpfulness, Hallucination, Toxicity,
 * Jailbreak, and custom prompts) run server-side on these events.
 * No client-side code is needed beyond capturing $ai_generation events.
 */
export const posthogLLMTelemetrySpec: TelemetrySpec = {
  meta: {
    key: 'analytics.posthog.llm',
    version: '1.0.0',
    title: 'PostHog LLM Analytics Telemetry',
    description:
      'Telemetry events for PostHog LLM Analytics: generation tracing, token usage, and evaluation-ready metadata.',
    domain: 'analytics',
    owners: ['@platform.integrations'],
    tags: ['analytics', 'posthog', 'llm', 'ai', 'telemetry'],
    stability: StabilityEnum.Beta,
  },
  events: [
    {
      key: 'posthog.llm.generation',
      version: '1.0.0',
      semantics: {
        who: 'AI agent or LLM consumer',
        what: 'Captures an LLM generation call with full observability metadata',
        why: 'Enable LLM performance monitoring, cost tracking, and automated quality evaluations via PostHog',
      },
      properties: {
        $ai_model: {
          type: 'string',
          required: true,
          description:
            'The LLM model identifier (e.g., gpt-4o, claude-sonnet-4-20250514)',
        },
        $ai_provider: {
          type: 'string',
          required: true,
          description:
            'The LLM provider (e.g., openai, anthropic, contractspec)',
        },
        $ai_latency: {
          type: 'number',
          required: false,
          description: 'LLM call latency in seconds',
        },
        $ai_input_tokens: {
          type: 'number',
          required: false,
          description: 'Number of input/prompt tokens consumed',
        },
        $ai_output_tokens: {
          type: 'number',
          required: false,
          description: 'Number of output/completion tokens generated',
        },
        $ai_total_cost_usd: {
          type: 'number',
          required: false,
          description: 'Total cost in USD (input + output)',
        },
        $ai_is_error: {
          type: 'boolean',
          required: false,
          description: 'Whether the generation resulted in an error',
        },
        $ai_trace_id: {
          type: 'string',
          required: false,
          description: 'Trace ID for grouping related generations',
        },
        $ai_stream: {
          type: 'boolean',
          required: false,
          description: 'Whether the response was streamed',
        },
        $ai_time_to_first_token: {
          type: 'number',
          required: false,
          description: 'Time to first token in seconds (streaming only)',
        },
        $ai_tools: {
          type: 'json',
          required: false,
          description: 'Tools/functions available to the LLM',
        },
        $ai_input: {
          type: 'json',
          required: false,
          pii: true,
          redact: true,
          description: 'Messages sent to the LLM (may contain PII)',
        },
        $ai_output_choices: {
          type: 'json',
          required: false,
          pii: true,
          redact: true,
          description: 'Response choices from the LLM (may contain PII)',
        },
        contractspec_operation: {
          type: 'string',
          required: false,
          description: 'ContractSpec operation name',
        },
        contractspec_version: {
          type: 'string',
          required: false,
          description: 'ContractSpec operation version',
        },
        contractspec_agent_id: {
          type: 'string',
          required: false,
          description: 'ContractSpec agent identifier',
        },
        contractspec_finish_reason: {
          type: 'string',
          required: false,
          description: 'AI SDK finish reason (stop, tool-calls, error, etc.)',
        },
        contractspec_tool_count: {
          type: 'number',
          required: false,
          description: 'Number of tool calls made in this step',
        },
      },
      privacy: 'internal',
      tags: ['llm', 'generation', 'posthog'],
    },
  ],
  config: {
    defaultRetentionDays: 90,
    defaultSamplingRate: 1.0,
    providers: [
      {
        type: 'posthog',
        config: {
          eventName: '$ai_generation',
          enableEvaluations: true,
          evaluationTemplates: [
            'relevance',
            'helpfulness',
            'jailbreak',
            'hallucination',
            'toxicity',
          ],
        },
      },
    ],
  },
};

/**
 * PostHog LLM Analytics PII fields that may appear in generation events.
 * These should be redacted when privacyMode is enabled.
 */
export const POSTHOG_LLM_PII_FIELDS = [
  '$ai_input',
  '$ai_output_choices',
] as const;

/**
 * PostHog LLM Analytics telemetry event name constants.
 */
export const POSTHOG_LLM_TELEMETRY_EVENTS = {
  /** Captured for every LLM generation call */
  generation: '$ai_generation',
  /** Captured for LLM trace spans */
  span: '$ai_span',
  /** Captured for LLM evaluation results (server-side) */
  evaluation: '$ai_evaluation',
} as const;

export type PostHogLLMTelemetryEvent =
  (typeof POSTHOG_LLM_TELEMETRY_EVENTS)[keyof typeof POSTHOG_LLM_TELEMETRY_EVENTS];

/**
 * Built-in PostHog evaluation templates.
 * These are configured in PostHog UI under LLM Analytics > Evaluations.
 */
export const POSTHOG_EVALUATION_TEMPLATES = {
  /** Whether the output addresses the user's input */
  relevance: 'relevance',
  /** Whether the response is useful and actionable */
  helpfulness: 'helpfulness',
  /** Attempts to bypass safety guardrails */
  jailbreak: 'jailbreak',
  /** Made-up facts or unsupported claims */
  hallucination: 'hallucination',
  /** Harmful, offensive, or inappropriate content */
  toxicity: 'toxicity',
} as const;

export type PostHogEvaluationTemplate =
  (typeof POSTHOG_EVALUATION_TEMPLATES)[keyof typeof POSTHOG_EVALUATION_TEMPLATES];

/**
 * Redact PII fields from PostHog LLM telemetry payload.
 */
export function redactPostHogLLMTelemetryPayload<
  T extends Record<string, unknown>,
>(payload: T): T {
  const redacted: Record<string, unknown> = { ...payload };
  for (const field of POSTHOG_LLM_PII_FIELDS) {
    if (field in redacted) {
      redacted[field] = '[REDACTED]';
    }
  }
  return redacted as T;
}
