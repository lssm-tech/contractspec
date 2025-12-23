---
description: Performance budgets and optimization guardrails
globs:
  - '**'
alwaysApply: true
---

# Performance Budgets

Budgets (default unless domain specifies tighter):

- API: p95 latency budget per service/endpoint; set explicit targets (e.g., <300ms internal, <600ms external-backed).
- Frontend: keep route-level bundle within budget; prefer code-splitting and suspense/streaming.
- Rendering: avoid unnecessary re-renders; memoize; virtualization for large lists.
- Data: paginate by default; cap payload sizes; avoid N+1; batch when possible.

Practices:

- Measure before/after; add metrics for latency and size.
- Prefer async/background work for heavy tasks; show optimistic or staged updates when safe.
- Cache with TTL/invalidations; document cache scope and staleness.
- Defer non-critical code (lazy load), but preserve UX feedback.

Checks:

- Compare against budgets in PRs; call out regressions.
- When adding dependencies, consider bundle impact; avoid heavy libs for simple tasks.





