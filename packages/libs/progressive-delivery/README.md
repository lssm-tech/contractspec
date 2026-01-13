# @contractspec/lib.progressive-delivery

Progressive delivery primitives for ContractSpec apps. Manage canary and blue-green deployments with guardrails, integration hooks, and automatic rollback.

## Features

- Declarative deployment strategies (canary, blue-green, hybrid)
- Stage-based traffic shifting with configurable durations
- Metric-driven guardrails (error rate, latency percentiles, throughput)
- Automatic rollback with structured events
- Event hooks for logging, auditing, and UI updates
- Works with `@contractspec/lib.observability` and feature flag pipelines

## Quick Start

```ts
import {
  DeploymentCoordinator,
  createDefaultCanaryController,
} from '@contractspec/lib.progressive-delivery';

const coordinator = new DeploymentCoordinator({
  strategy,
  controller: createDefaultCanaryController(strategy),
  metricsProvider: fetchMetricsFromOtEL,
  rollbackManager,
});

await coordinator.run();
```

See the docs in `docs/tech/PHASE_5_ZERO_TOUCH_OPERATIONS.md` for full workflows.
