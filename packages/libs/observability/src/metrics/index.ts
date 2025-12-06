import {
  metrics,
  type Meter,
  type Counter,
  type Histogram,
  type UpDownCounter,
} from '@opentelemetry/api';

const DEFAULT_METER_NAME = '@contractspec/lib.observability';

export function getMeter(name: string = DEFAULT_METER_NAME): Meter {
  return metrics.getMeter(name);
}

export function createCounter(
  name: string,
  description?: string,
  meterName?: string
): Counter {
  return getMeter(meterName).createCounter(name, { description });
}

export function createUpDownCounter(
  name: string,
  description?: string,
  meterName?: string
): UpDownCounter {
  return getMeter(meterName).createUpDownCounter(name, { description });
}

export function createHistogram(
  name: string,
  description?: string,
  meterName?: string
): Histogram {
  return getMeter(meterName).createHistogram(name, { description });
}

export const standardMetrics = {
  httpRequests: createCounter('http_requests_total', 'Total HTTP requests'),
  httpDuration: createHistogram(
    'http_request_duration_seconds',
    'HTTP request duration'
  ),
  operationErrors: createCounter(
    'operation_errors_total',
    'Total operation errors'
  ),
  workflowDuration: createHistogram(
    'workflow_duration_seconds',
    'Workflow execution duration'
  ),
};
