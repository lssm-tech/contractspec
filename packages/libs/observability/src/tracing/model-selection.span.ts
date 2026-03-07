import type { Span } from '@opentelemetry/api';
import { traceAsync } from './index';

export interface ModelSelectionSpanAttributes {
  'model.selected': string;
  'model.provider': string;
  'model.score': number;
  'model.dimension'?: string;
  'model.alternatives_count': number;
  'model.constraints'?: string;
  'model.selection_duration_ms': number;
  'model.reason': string;
}

export interface ModelSelectionSpanInput {
  modelId: string;
  providerKey: string;
  score: number;
  dimension?: string;
  alternativesCount: number;
  constraints?: Record<string, unknown>;
  reason: string;
}

/**
 * Trace a model selection decision as an OpenTelemetry span.
 *
 * Wraps an async operation (typically the selector call) and records
 * the selection result as span attributes for distributed tracing.
 */
export async function traceModelSelection<T>(
  fn: () => Promise<T>,
  input: ModelSelectionSpanInput
): Promise<T> {
  const startMs = performance.now();

  return traceAsync('model.selection', async (span: Span) => {
    const result = await fn();
    const durationMs = performance.now() - startMs;

    span.setAttribute('model.selected', input.modelId);
    span.setAttribute('model.provider', input.providerKey);
    span.setAttribute('model.score', input.score);
    span.setAttribute('model.alternatives_count', input.alternativesCount);
    span.setAttribute('model.selection_duration_ms', durationMs);
    span.setAttribute('model.reason', input.reason);

    if (input.dimension) {
      span.setAttribute('model.dimension', input.dimension);
    }
    if (input.constraints) {
      span.setAttribute('model.constraints', JSON.stringify(input.constraints));
    }

    return result;
  });
}
