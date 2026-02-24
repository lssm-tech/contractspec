---
targets:
  - '*'
root: false
description: 'Observability, logging, and tracing standards'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Observability, logging, and tracing standards'
  globs:
    - '**/*'
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

Tooling:

- Run `/audit-observability` to scan for missing logging, analytics gaps, console.\* anti-patterns, and empty catch blocks.
- Run `/audit-health` for a broader check that includes observability coverage alongside file sizes and layer compliance.
- Use the `create-feature` skill to scaffold new services with structured logging and analytics from day one.
- The `post-edit-checks` hook automatically flags `console.*` usage in production code after every edit.
- The `code-health-auditor` subagent provides detailed observability coverage reports with file:line references.

References:

- See `posthog-integration.md` for analytics event naming, feature flags, and PostHog SDK usage.
- See `code-quality-practices.md` for the logging policy (no console.log, structured output, correlation IDs).
- See `backend.md` for error handling taxonomy and correlation ID propagation.
