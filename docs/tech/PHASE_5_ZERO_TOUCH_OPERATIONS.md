# Phase 5: Zero-Touch Operations

**Status**: In progress  
**Last updated**: 2025-11-21

Phase 5 delivers progressive delivery, SLO intelligence, cost attribution, and anomaly-driven remediation so the platform can deploy continuously without pager rotations.

---

## 1. New Libraries

### @lssm/lib.progressive-delivery
- `DeploymentStrategy` types capture canary vs blue-green rollouts.
- `CanaryController` + `CanaryAnalyzer` orchestrate stage evaluation against telemetry thresholds.
- `TrafficShifter` keeps stable/candidate splits in sync with feature-flag or router state.
- `DeploymentCoordinator` drives stage progression, emits events, and triggers rollbacks.
- `RollbackManager` encapsulates safe revert hooks (spec version revert, traffic shift, etc.).

### @lssm/lib.slo
- Declarative `SLODefinition` with latency + availability targets per capability/spec.
- `SLOTracker` stores rolling snapshots + error budget positions.
- `BurnRateCalculator` implements multi-window burn computations (fast vs slow burn).
- `SLOMonitor` pushes incidents to Ops tooling automatically when burn exceeds thresholds.

### @lssm/lib.cost-tracking
- `CostTracker` normalizes DB/API/compute metrics into per-operation cost totals.
- `BudgetAlertManager` raises tenant budget warnings (80% default) with contextual payloads.
- `OptimizationRecommender` suggests batching, caching, or contract tweaks to cut spend.

### Observability Anomaly Toolkit
- `BaselineCalculator` establishes rolling intent metrics (latency, error rate, throughput).
- `AnomalyDetector` flags spikes/drops via relative deltas after 10+ samples.
- `RootCauseAnalyzer` correlates anomalies with recent deployments.
- `AlertManager` deduplicates notifications and feeds MCP/SRE transports.

---

## 2. Data Model Additions

File: `packages/libs/database/prisma/schema.prisma`

| Model | Purpose |
| --- | --- |
| `SLODefinition`, `SLOSnapshot`, `ErrorBudget`, `SLOIncident` | Persist definitions, rolling windows, and incidents. |
| `OperationCost`, `TenantBudget`, `CostAlert`, `OptimizationSuggestion` | Track per-operation costs, budgets, and generated recommendations. |
| `Deployment`, `DeploymentStage`, `RollbackEvent` | Audit progressive delivery runs and automated rollbacks. |
| `MetricBaseline`, `AnomalyEvent` | Store computed baselines and anomaly evidence for training/analytics. |

Run `bun database generate` after pulling to refresh the Prisma client.

---

## 3. Operational Flow

1. **Deploy**: Define a `DeploymentStrategy` and feed telemetry via `@lssm/lib.observability`. Canary stages run automatically.
2. **Protect**: `CanaryAnalyzer` evaluates error rate + latency thresholds. Failures trigger `RollbackManager`.
3. **Observe**: `SLOMonitor` consumes snapshots and opens incidents when burn rate exceeds thresholds.
4. **Optimize**: `CostTracker` aggregates spend per tenant + capability, while `OptimizationRecommender` surfaces fixes.
5. **Detect**: Anomaly signals route to `RootCauseAnalyzer`, which links them to specific deployments for auto-rollback.

---

## 4. Integration Checklist

1. Instrument adapters with `createTracingMiddleware({ onSample })` to feed metric points into `AnomalyDetector`.
2. Register SLOs per critical operation (`billing.charge`, `knowledge.search`) and wire monitors to Ops notifications.
3. Attach `CostTracker.recordSample` to workflow runners (DB instrumentation + external call wrappers).
4. Store deployment metadata using the new Prisma models for auditing + UI surfacing.
5. Update `@lssm/app.ops-console` (next iteration) to list deployments, SLO status, costs, and anomalies in one timeline.

---

## 5. Next Steps

- Wire `DeploymentCoordinator` into the Contracts CLI so `contractspec deploy` can run staged rollouts.
- Add UI for SLO dashboards (burn rate sparkline + incident feed).
- Ship budget suggestions into Growth Agent for automated cost optimizations.
- Connect `AnomalyEvent` stream to MCP agents for root-cause playbooks.
