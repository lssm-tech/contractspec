import type { StepResult, ToolSet } from 'ai';

/**
 * Metric sample compatible with @contractspec/lib.evolution OperationMetricSample.
 */
export interface OperationMetricSample {
  operation: { name: string; version: number };
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
function parseAgentId(agentId: string): { name: string; version: number } {
  const match = agentId.match(/^(.+)\.v(\d+)$/);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { name: match[1]!, version: parseInt(match[2]!, 10) };
  }
  return { name: agentId, version: 1 };
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
  durationMs?: number
): Promise<void> {
  const { name, version } = parseAgentId(agentId);

  // Track tool invocations
  for (const toolCall of step.toolCalls ?? []) {
    const toolSample: OperationMetricSample = {
      operation: { name: `${name}.${toolCall.toolName}`, version },
      durationMs: durationMs ?? 0,
      success:
        step.toolResults?.some(
          (r) => r.toolCallId === toolCall.toolCallId && r.output !== undefined
        ) ?? false,
      timestamp: new Date(),
      metadata: {
        agentId,
        toolName: toolCall.toolName,
        finishReason: step.finishReason,
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
      agentId,
      finishReason: step.finishReason,
      tokenUsage: step.usage,
      toolCallCount: step.toolCalls?.length ?? 0,
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
