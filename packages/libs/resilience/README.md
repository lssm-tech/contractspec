# @lssm/lib.resilience

Resilience patterns for building robust, self-healing applications.

## Features

- **Circuit Breaker**: Prevent cascading failures
- **Retry**: Automatic retry with exponential backoff
- **Timeout**: Hard limits on execution time
- **Fallback**: Graceful degradation

## Installation

```bash
npm install @lssm/lib.resilience
```

## Quick Start

### Circuit Breaker

```typescript
import { CircuitBreaker } from '@lssm/lib.resilience/circuit-breaker';

const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeoutMs: 30000,
});

const result = await breaker.execute(async () => {
  return await fetch('https://api.stripe.com/v1/charges');
});
```

### Retry

```typescript
import { retry } from '@lssm/lib.resilience/retry';

const result = await retry(
  async () => fetchUser(id),
  3, // retries
  1000, // initial delay
  true // backoff
);
```

### Timeout & Fallback

```typescript
import { timeout, fallback } from '@lssm/lib.resilience';

const result = await fallback(() => timeout(slowOperation, 5000), defaultValue);
```

## Documentation

Full docs: https://contractspec.chaman.ventures/docs/libraries/resilience























