import {
  type Span,
  SpanStatusCode,
  trace,
  type Tracer,
} from '@opentelemetry/api';

const DEFAULT_TRACER_NAME = '@lssm/lib.observability';

export function getTracer(name: string = DEFAULT_TRACER_NAME): Tracer {
  return trace.getTracer(name);
}

export async function traceAsync<T>(
  name: string,
  fn: (span: Span) => Promise<T>,
  tracerName?: string
): Promise<T> {
  const tracer = getTracer(tracerName);
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

export function traceSync<T>(
  name: string,
  fn: (span: Span) => T,
  tracerName?: string
): T {
  const tracer = getTracer(tracerName);
  return tracer.startActiveSpan(name, (span) => {
    try {
      const result = fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}


