# Phase 3: Auto-Evolution Technical Notes

**Status**: In progress  
**Last updated**: 2025-11-21  

Phase 3 introduces self-learning capabilities that analyze production telemetry, suggest new specs, safely roll out variants, and generate golden tests from real traffic. This document captures the main building blocks delivered in this iteration.

---

## 1. Libraries

### @lssm/lib.evolution

- `SpecAnalyzer` converts raw telemetry samples into usage stats + anomalies.
- `SpecGenerator` produces `SpecSuggestion` objects and validates confidence thresholds.
- `SpecSuggestionOrchestrator` routes proposals through the AI approval workflow and writes approved specs to `packages/libs/contracts/src/generated`.
- Storage adapters:
  - `InMemorySpecSuggestionRepository` for tests.
  - `PrismaSpecSuggestionRepository` persists to the new Prisma model (see §4).
  - `FileSystemSuggestionWriter` emits JSON envelopes for git review.

### @lssm/lib.observability

- Added intent detection modules:
  - `IntentAggregator` batches telemetry into rolling windows.
  - `IntentDetector` surfaces latency/error/throughput regressions and sequential intents.
- `EvolutionPipeline` orchestrates aggregation → detection → intent events and exposes hooks for downstream orchestrators.
- `createTracingMiddleware` now accepts `resolveOperation`/`onSample` hooks to feed telemetry samples into the pipeline.

### @lssm/lib.growth

- New `spec-experiments` module:
  - `SpecExperimentRegistry`, `SpecExperimentRunner`, `SpecExperimentAdapter`.
  - `SpecExperimentAnalyzer` + `SpecExperimentController` handle guardrails and staged rollouts.
  - Helper `createSpecVariantResolver` plugs directly into `HandlerCtx.specVariantResolver`.
- `SpecVariantResolver` is now a first-class concept in `@lssm/lib.contracts`. The runtime will attempt to execute variant specs before falling back to the registered handler.

### @lssm/lib.testing

- `TrafficRecorder` + `TrafficStore` capture production requests with sampling and sanitization hooks.
- `GoldenTestGenerator` converts `TrafficSnapshot`s into Vitest/Jest suites.
- `generateVitestSuite` / `generateJestSuite` output self-contained test files, and `runGoldenTests` offers a programmatic harness for CI pipelines.

---

## 2. Telemetry → Intent → Spec Pipeline

1. `createTracingMiddleware({ onSample })` emits `TelemetrySample`s for every HTTP request.
2. `IntentAggregator` groups samples into statistical windows (default 15 minutes).
3. `IntentDetector` raises signals for:
   - Error spikes
   - Latency regressions
   - Throughput drops
   - Sequential workflows that hint at missing specs
4. `EvolutionPipeline` emits `intent.detected` events and hands them to `SpecGenerator`.
5. `SpecSuggestionOrchestrator` persists suggestions, triggers approval workflows, and—upon approval—writes JSON envelopes to `packages/.../contracts/src/generated`.

---

## 3. Spec Experiments & Rollouts

1. Register spec experiments in `SpecExperimentRegistry` with control + variant bindings.
2. Expose bucketed specs by attaching `createSpecVariantResolver` to `HandlerCtx.specVariantResolver` inside adapters.
3. Record outcomes via `SpecExperimentAdapter.trackOutcome()` (latency + error metrics).
4. `SpecExperimentController` uses guardrails from config and `SpecExperimentAnalyzer` to:
   - Auto-rollback on error/latency breaches.
   - Advance rollout stages (1% → 10% → 50% → 100%) when metrics stay green.

---

## 4. Data Models (Prisma)

File: `packages/libs/database/prisma/schema.prisma`

- `SpecSuggestion` – stores serialized suggestion payloads + statuses.
- `IntentSnapshot` – captured detector output for auditing/training.
- `TrafficSnapshot` – persisted production traffic (input/output/error blobs).
- `SpecExperiment` / `SpecExperimentMetric` – rollout state + metrics for each variant.

> Run `bun database generate` after pulling to refresh the Prisma client.

---

## 5. Golden Test Workflow

1. Capture traffic via middleware or direct `TrafficRecorder.record`.
2. Use the new CLI command to materialize suites:

```bash
contractspec test generate \
  --operation billing.createInvoice \
  --output tests/billing.createInvoice.golden.test.ts \
  --runner-import ./tests/run-operation \
  --runner-fn runBillingCommand \
  --from-production \
  --days 7 \
  --sample-rate 0.05
```

3. Generated files import your runner and assert against recorded outputs (or expected errors for negative paths).

---

## 6. Operational Notes

- **Approvals**: By default, every suggestion still requires human approval. `EvolutionConfig.autoApproveThreshold` can be tuned per environment but should remain conservative (<0.3) until OverlaySpec tooling lands.
- **Sampling**: Keep `TrafficRecorder.sampleRate` ≤ 0.05 in production to avoid sensitive payload storage; scrub PII through the `sanitize` callback before persistence.
- **Rollouts**: Guardrails default to 5% error-rate and 750ms P99 latency. Override per experiment to match SLOs.

---

## 7. Next Steps

1. Wire `SpecExperimentAdapter.trackOutcome` into adapters (REST, GraphQL, Workers) so every execution logs metrics automatically.
2. Add a UI for reviewing `SpecSuggestion` objects alongside approval status.
3. Expand `TrafficRecorder` to ship directly to the Prisma-backed store (currently in-memory by default).
4. Integrate `EvolutionPipeline` events with the Regenerator to close the loop (auto-open proposals + attach evidence).






















