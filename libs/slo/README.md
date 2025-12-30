# @contractspec/lib.slo

Service Level Objective utilities for ContractSpec operations. Define availability and latency targets, compute burn rates, and open incidents automatically.

## Highlights

- Declarative SLO definitions per capability / spec version
- Rolling error budget tracking with configurable windows
- Multi-window burn rate calculator (fast vs slow burn)
- SLO monitor that emits incidents + notifications
- Works with telemetry from `@contractspec/lib.observability`

## Usage

```ts
import { SLODefinition, SLOMonitor } from '@contractspec/lib.slo';

const slo: SLODefinition = {
  id: 'orders.create.availability',
  targetAvailability: 0.999,
  rollingWindowMs: 7 * 24 * 60 * 60 * 1000,
  alerts: {
    fastBurnThreshold: 14,
    slowBurnThreshold: 6,
  },
};

const monitor = new SLOMonitor({
  definition: slo,
  incidentManager,
});

monitor.recordWindow({ good: 9990, bad: 2, latencyP99: 420 });
```
