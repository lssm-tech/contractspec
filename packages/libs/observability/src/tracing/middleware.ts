import { traceAsync } from './index';
import { standardMetrics } from '../metrics';

export function createTracingMiddleware() {
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

        return response;
      } catch (error) {
        standardMetrics.operationErrors.add(1, { method, path });
        throw error;
      }
    });
  };
}

