# @contractspec/lib.cost-tracking

Website: https://contractspec.io/


Cost attribution, budgeting, and optimization helpers for ContractSpec operations.

## Features

- Normalize DB/API/compute metrics into unified cost samples
- Attribute costs per operation, tenant, and feature flag
- Detect budget overruns with configurable alerts
- Generate optimization suggestions (N+1, caching, batching)
- Integrates with telemetry produced via `@contractspec/lib.observability`

## Example

```ts
import { CostTracker, defaultCostModel } from '@contractspec/lib.cost-tracking';

const tracker = new CostTracker({ costModel: defaultCostModel });

tracker.recordSample({
  operation: 'orders.list',
  tenantId: 'acme',
  dbReads: 12,
  dbWrites: 2,
  externalCalls: [{ provider: 'stripe', cost: 0.02 }],
  computeMs: 150,
});

const summary = tracker.getTotals();
```
