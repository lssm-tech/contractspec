import type { StepResult, ToolSet } from 'ai';

/**
 * Metric sample compatible with @contractspec/lib.evolution OperationMetricSample.
 */
export interface OperationMetricSample {
  operation: { name: string; version: string };
  durationMs: number;
  success: boolean;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Interface for collecting telemetry metrics.
 *
 * Implementations can send metrics to:
 * - @contractspec/lib.evolution for self-improvement
 * - PostHog for analytics
 * - Custom monitoring systems
 */
export interface TelemetryCollector {
  /**
   * Collect a metric sample.
   */
  collect(sample: OperationMetricSample): Promise<void>;
}

/**
 * Parse agent ID into name and version.
 */
function parseAgentId(agentId: string): { name: string; version: string } {
  const match = agentId.match(/^(.+)\.v(\d+)$/);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { name: match[1]!, version: match[2]! };
  }
  return { name: agentId, version: '1.0.0' };
}

interface TrackAgentStepContext {
  sessionId?: string;
  tenantId?: string;
  actorId?: string;
  traceId?: string;
  stepIndex?: number;
  stepStartedAt?: Date;
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : undefined;
}

function getStepResponse(step: StepResult<ToolSet>):
  | {
      id?: string;
      modelId?: string;
      timestamp?: Date;
      headers?: Record<string, string>;
      body?: unknown;
      messages?: unknown;
    }
  | undefined {
  const response = getRecord((step as { response?: unknown }).response);
  if (!response) return undefined;
  return {
    id: response['id'] as string | undefined,
    modelId: response['modelId'] as string | undefined,
    timestamp: response['timestamp'] as Date | undefined,
    headers: response['headers'] as Record<string, string> | undefined,
    body: response['body'],
    messages: response['messages'],
  };
}

function getRequestBodyValue(
  request: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const body = request?.['body'];
  if (!body) return undefined;
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as Record<string, unknown>;
      return typeof parsed[key] === 'string'
        ? (parsed[key] as string)
        : undefined;
    } catch {
      return undefined;
    }
  }
  const record = getRecord(body);
  return typeof record?.[key] === 'string'
    ? (record[key] as string)
    : undefined;
}

/**
 * Track an agent step for telemetry.
 *
 * Called from ContractSpecAgent.onStepFinish to feed metrics
 * to the evolution engine.
 *
 * @param collector - Telemetry collector
 * @param agentId - Agent identifier (e.g., "support.bot.v1")
 * @param step - AI SDK step result
 * @param durationMs - Optional step duration in milliseconds
 */
export async function trackAgentStep(
  collector: TelemetryCollector,
  agentId: string,
  step: StepResult<ToolSet>,
  durationMs?: number,
  context?: TrackAgentStepContext
): Promise<void> {
  const { name, version } = parseAgentId(agentId);
  const response = getStepResponse(step);
  const providerMetadata = (step as { providerMetadata?: unknown })
    .providerMetadata;
  const warnings = (step as { warnings?: unknown }).warnings;
  const rawFinishReason = (step as { rawFinishReason?: unknown })
    .rawFinishReason;
  const request = getRecord((step as { request?: unknown }).request);
  const traceId =
    context?.traceId ?? getRequestBodyValue(request, '$ai_trace_id');
  const sessionId =
    context?.sessionId ?? getRequestBodyValue(request, '$ai_session_id');
  const parentSpanId = response?.id;

  // Track tool invocations
  for (const toolCall of step.toolCalls ?? []) {
    const toolResult = step.toolResults?.find(
      (r) => r.toolCallId === toolCall.toolCallId
    );
    const toolError = getRecord(toolResult?.output)?.['error'];
    const toolSample: OperationMetricSample = {
      operation: { name: `${name}.${toolCall.toolName}`, version },
      durationMs: durationMs ?? 0,
      success:
        step.toolResults?.some(
          (r) => r.toolCallId === toolCall.toolCallId && r.output !== undefined
        ) ?? false,
      timestamp: new Date(),
      metadata: {
        telemetryEvent: 'span',
        traceId,
        sessionId,
        spanId: toolCall.toolCallId,
        parentSpanId,
        spanName: `tool.${toolCall.toolName}`,
        agentId,
        actorId: context?.actorId,
        tenantId: context?.tenantId,
        stepIndex: context?.stepIndex,
        toolName: toolCall.toolName,
        toolCallArgs: toolCall.input,
        toolResultOutput: toolResult?.output,
        errorMessage:
          typeof toolError === 'string'
            ? toolError
            : typeof toolResult?.output === 'string'
              ? toolResult.output
              : undefined,
        finishReason: step.finishReason,
        rawFinishReason,
      },
    };
    await collector.collect(toolSample);
  }

  // Track overall step
  const stepSample: OperationMetricSample = {
    operation: { name, version },
    durationMs: durationMs ?? 0,
    success: step.finishReason !== 'error',
    timestamp: new Date(),
    metadata: {
      telemetryEvent: 'generation',
      traceId,
      sessionId,
      spanId: response?.id,
      spanName: `agent.${name}.step`,
      agentId,
      actorId: context?.actorId,
      tenantId: context?.tenantId,
      stepIndex: context?.stepIndex,
      stepStartedAt: context?.stepStartedAt,
      finishReason: step.finishReason,
      rawFinishReason,
      tokenUsage: step.usage,
      totalUsage: (step as { totalUsage?: unknown }).totalUsage,
      providerMetadata,
      warnings,
      stepText: step.text,
      stepReasoningText: (step as { reasoningText?: string }).reasoningText,
      responseId: response?.id,
      responseModelId: response?.modelId,
      responseTimestamp: response?.timestamp,
      responseHeaders: response?.headers,
      responseBody: response?.body,
      responseMessages: response?.messages,
      requestBody: request?.['body'],
      requestHeaders: request?.['headers'],
      toolCallCount: step.toolCalls?.length ?? 0,
      toolCalls: step.toolCalls,
      toolResults: step.toolResults,
      errorMessage:
        step.finishReason === 'error'
          ? (step as { text?: string }).text
          : undefined,
    },
  };
  await collector.collect(stepSample);
}

/**
 * In-memory telemetry collector for testing.
 */
export class InMemoryTelemetryCollector implements TelemetryCollector {
  private readonly samples: OperationMetricSample[] = [];

  async collect(sample: OperationMetricSample): Promise<void> {
    this.samples.push(sample);
  }

  /**
   * Get all collected samples.
   */
  getSamples(): OperationMetricSample[] {
    return [...this.samples];
  }

  /**
   * Get samples for a specific operation.
   */
  getSamplesForOperation(operationName: string): OperationMetricSample[] {
    return this.samples.filter((s) => s.operation.name === operationName);
  }

  /**
   * Clear all samples.
   */
  clear(): void {
    this.samples.length = 0;
  }
}

/**
 * Create an in-memory telemetry collector.
 */
export function createInMemoryTelemetryCollector(): InMemoryTelemetryCollector {
  return new InMemoryTelemetryCollector();
}

/**
 * No-op telemetry collector that discards all metrics.
 */
export const noopTelemetryCollector: TelemetryCollector = {
  collect: async () => {
    /* noop */
  },
};
