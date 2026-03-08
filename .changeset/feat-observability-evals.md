---
'@contractspec/lib.surface-runtime': patch
---

Add observability, evals, and metrics for surface runtime

- Integrate with lib.observability: tracing (traceAsync), metrics (resolution_duration_ms, patch_acceptance_rate, policy_denial_count, surface_fallback, missing_renderer), structured logging
- Add golden-context harness for resolver evals with snapshot tests
- Add performance budget check (resolver p95 <100ms)
- Add missing renderer counter when slot has no renderer for node kind
- Document eval runbook in docs/evals-runbook.md
