# Implementation Plan: Observability, Evals, and Metrics

- **Spec:** 11_observability_evals_and_metrics.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Adds telemetry, metrics, and evaluation harnesses for surface resolution, AI patch acceptance, policy friction, and performance. Enables golden-context evals and regression testing.

## Objectives

1. Integrate with lib.observability (tracing, metrics, logger).
2. Emit metrics: time to first action, surface switch rate, layout churn, AI patch acceptance, policy friction.
3. Implement golden-context harness for resolver.
4. Implement snapshot tests for key routes and preferences.
5. Add performance budgets: resolver <100ms p95 server, <30ms client.

## Non-goals (v1)

- Full assistant evals (defer).
- Dashboards and alerting (manual inspection first).
- A/B testing infrastructure.

## Codebase alignment

- lib.observability: traceAsync, createCounter, createHistogram, logger.
- Export paths: @contractspec/lib.observability/tracing, /metrics.

## Workstreams

### WS1 — Telemetry integration

- [x] Add tracing to resolveBundle (span per step).
- [x] Add metrics: resolution_duration_ms, patch_acceptance_rate, policy_denial_count.
- [x] Add structured logging for resolution, patch, overlay events.
- [x] Ensure no PII in logs.

### WS2 — Golden-context harness

- [x] Define golden context format (route, params, preferences, capabilities).
- [x] Implement harness: run resolver, snapshot ResolvedSurfacePlan.
- [x] Add golden files for pilot route and key preference combinations.
- [x] Add regression test script.

### WS3 — Performance and evals

- [x] Add performance budget checks (resolver latency).
- [x] Implement snapshot tests for verification matrix surfaces.
- [x] Document eval runbook.
- [x] Add missing renderer alerts (when slot has no renderer).

## Dependencies

- 01_core_bundle (types).
- 02_resolution_runtime (resolver).
- 05_ai_chat (patch acceptance).
- 08_policy_safety (policy events).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Golden files brittle | Version format; allow intentional updates. |
| Metrics overhead | Sample; use histograms not raw logs. |

## Implementation notes (2026-03-08)

### Delivered

- **Telemetry:** `traceAsync` on `resolveBundle`; span attributes `bundle.key`, `surface.id`, `resolution.duration_ms`
- **Metrics:** `resolution_duration_ms`, `patch_acceptance_counter`, `patch_rejection_counter`, `policy_denial_counter`, `surface_fallback_counter`, `missing_renderer_counter` (see `./telemetry`)
- **Logging:** `bundle.surface.resolved`, `bundle.surface.patch.applied` (no PII)
- **Golden harness:** `src/evals/golden-context.ts`, `golden-harness.ts`, fixtures, `runGoldenResolve`, `toSnapshotPlan`
- **Snapshots:** Pilot route + key preference combinations; `bun test src/evals/ --update-snapshots` to refresh
- **Performance:** p95 <100ms server budget enforced in `golden-harness.test.ts`
- **Missing renderer:** `SlotRenderer` increments `missing_renderer_counter` when node kind has no dedicated renderer
- **Runbook:** `docs/evals-runbook.md`

### Deferred (v1)

- **Client p95 <30ms:** Server-side test only; client budget would require browser-based perf test
- **Time to first action, surface switch rate, layout churn:** Require analytics/PostHog integration; defer to product instrumentation
