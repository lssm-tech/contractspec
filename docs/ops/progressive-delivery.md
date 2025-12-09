# Progressive Delivery Runbook

**Scope**: Contracts runtime deployments running on ContractSpec infrastructure.

## 1. Prerequisites
- Register a `DeploymentStrategy` via `@lssm/lib.progressive-delivery`.
- Ensure adapters emit telemetry through `@lssm/lib.observability` (HTTP middleware + custom metrics).
- Define rollback actions (feature flag toggle, spec revert, infrastructure switch) and wire them to `RollbackManager`.

## 2. Standard Canary
```ts
const strategy: DeploymentStrategy = {
  target: { name: 'billing.createInvoice', version: 7 },
  mode: 'canary',
  thresholds: {
    errorRate: 0.01,
    latencyP99: 500,
    latencyP95: 250,
  },
};
```

1. Run `DeploymentCoordinator.run()` from CLI or CI job.
2. Watch emitted events (`stage_started`, `stage_passed`, `stage_failed`). Pipe them to Ops Slack and the Ops Console timeline.
3. On failure the coordinator triggers `RollbackManager.execute` automatically; the runbook owner only validates post-rollback metrics.

## 3. Blue-Green Swap
- Use mode `blue-green` with two stages: `0%` warmup and `100%` swap.
- Attach smoke tests to `stage_started` events before sending any traffic.
- After `blue_green_swapped`, freeze the old environment for 24h before decommissioning.

## 4. Guardrails
- Default thresholds: error rate 1%, P99 500ms, throughput drop 40%.
- Add custom evaluator for domain-specific metrics:
```ts
thresholds: {
  errorRate: 0.005,
  customEvaluator: (metrics) => metrics.throughput > 200,
}
```

## 5. Incident Hooks
- `Deployment`, `DeploymentStage`, and `RollbackEvent` tables store the full history.
- Tag rollbacks with incident ID to keep Ops Console synchronized.
- Auto-resolve the incident once `status === 'completed'` and SLO burn rate returns < 2x.
