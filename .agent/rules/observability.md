---
description: Observability, logging, and tracing standards
globs:
  - '**'
alwaysApply: true
---

# Observability & Logging

Principles:

- Instrument first: logs/metrics/traces are part of the feature, not an afterthought.
- Structured, queryable output; no freeform console logs.
- Correlate everything (trace/request ids); avoid PII/secrets.

Logging:

- Use shared logging utility; forbid `console.*` in production.
- Levels: info (state changes), warn (recoverable), error (action needed). No debug in prod unless sampled.
- Include correlation id, user/tenant (when permitted), feature flag state, and latency; scrub payloads by default.

Metrics:

- Emit latency (p50/p95), error rate, throughput; tag by service/route/tenant (if allowed).
- Add counters for retries, timeouts, and circuit-breaker trips.

Tracing:

- Propagate trace/span ids across services; wrap external calls with spans and timeouts.
- Record retries/backoff and response codes on spans.

Checks:

- Before merging, verify no secrets/PII in logs; ensure sampling for high-volume paths.
- Add health/readiness endpoints for services; wire them to probes/monitors.





