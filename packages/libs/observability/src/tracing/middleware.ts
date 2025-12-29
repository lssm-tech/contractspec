import type { Span } from '@opentelemetry/api';
import { traceAsync } from './index';
import { standardMetrics } from '../metrics';
import type { TelemetrySample } from '../intent/aggregator';

export interface TracingMiddlewareOptions {
  resolveOperation?: (input: {
    req: Request;
    res?: Response;
  }) => { name: string; version: string } | undefined;
  onSample?: (sample: TelemetrySample) => void;
  tenantResolver?: (req: Request) => string | undefined;
  actorResolver?: (req: Request) => string | undefined;
}

export function createTracingMiddleware(
  options: TracingMiddlewareOptions = {}
) {
  return async (req: Request, next: () => Promise<Response>) => {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;

    standardMetrics.httpRequests.add(1, { method, path });
    const startTime = performance.now();

    return traceAsync(`HTTP ${method} ${path}`, async (span) => {
      span.setAttribute('http.method', method);
      span.setAttribute('http.url', req.url);

      try {
        const response = await next();
        span.setAttribute('http.status_code', response.status);

        const duration = (performance.now() - startTime) / 1000;
        standardMetrics.httpDuration.record(duration, {
          method,
          path,
          status: response.status.toString(),
        });

        emitTelemetrySample({
          req,
          res: response,
          span,
          success: true,
          durationMs: duration * 1000,
          options,
        });

        return response;
      } catch (error) {
        standardMetrics.operationErrors.add(1, { method, path });
        emitTelemetrySample({
          req,
          span,
          success: false,
          durationMs: performance.now() - startTime,
          error,
          options,
        });
        throw error;
      }
    });
  };
}

interface EmitTelemetryArgs {
  req: Request;
  res?: Response;
  span: Span;
  success: boolean;
  durationMs: number;
  error?: unknown;
  options: TracingMiddlewareOptions;
}

function emitTelemetrySample({
  req,
  res,
  span,
  success,
  durationMs,
  error,
  options,
}: EmitTelemetryArgs) {
  if (!options.onSample || !options.resolveOperation) return;
  const operation = options.resolveOperation({ req, res });
  if (!operation) return;
  const sample: TelemetrySample = {
    operation,
    durationMs,
    success,
    timestamp: new Date(),
    errorCode:
      !success && error instanceof Error
        ? error.name
        : success
          ? undefined
          : 'unknown',
    tenantId: options.tenantResolver?.(req),
    actorId: options.actorResolver?.(req),
    traceId: span.spanContext().traceId,
    metadata: {
      method: req.method,
      path: new URL(req.url).pathname,
      status: res?.status,
    },
  };
  options.onSample(sample);
}