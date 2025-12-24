# @lssm/lib.observability

OpenTelemetry integration for tracing, metrics, and structured logging.

## Features

- **Distributed Tracing**: Automatic span creation and propagation
- **Metrics**: Counters, histograms, and gauges
- **Structured Logging**: JSON logs with trace correlation

## Installation

```bash
npm install @lssm/lib.observability @opentelemetry/api
```

## Quick Start

### Tracing

```typescript
import { traceAsync } from '@lssm/lib.observability/tracing';

await traceAsync('process_order', async (span) => {
  span.setAttribute('order_id', order.id);
  await db.save(order);
});
```

### Metrics

```typescript
import { createCounter } from '@lssm/lib.observability/metrics';

const ordersCounter = createCounter('orders_total');
ordersCounter.add(1, { status: 'success' });
```

### Middleware

```typescript
import { createTracingMiddleware } from '@lssm/lib.observability/tracing/middleware';

app.use(createTracingMiddleware());
```

## Documentation

Full docs: https://contractspec.lssm.tech/docs/libraries/observability
































