# SLO Management Runbook

## 1. Definition Lifecycle
1. Create an entry in `SLODefinition` via migration or the Ops Console.
2. Map capabilities to specs: e.g. `orders.create` availability 99.9%, P99 500ms.
3. Store tags (`tenant:enterprise`, `tier:mission-critical`) for filtering dashboards.

## 2. Monitoring
- Deploy `SLOMonitor` alongside each critical service.
- Pipe `IncidentManager.createIncident` into PagerDuty + Ops Slack.
- Fast burn threshold (14x) -> page immediately; slow burn (6x) -> create ticket.

```ts
const monitor = new SLOMonitor({
  definition,
  incidentManager,
});
monitor.recordWindow({ good, bad, latencyP99, latencyP95 });
```

## 3. Error Budget Workflow
- `ErrorBudget` rows track rolling windows (default 7d).
- Add runbooks for "burn > 50%" (freeze deploys) and "burn > 80%" (roll back latest change).
- Use `SLOSnapshot` to regenerate dashboards (no warehouse needed).

## 4. Incident Triage
- Every incident includes snapshot JSON (availability, latency, burn rate).
- Attach deployment IDs from `Deployment` table to cross-link incidents & rollouts.
- After resolution set `acknowledgedAt` and reset error budget (new period) if needed.

## 5. Reporting
- Weekly summary = AVG burn rate, # incidents, # auto-rollbacks triggered by SLO monitor.
- Feed `SLOIncident` into Growth Agent for customer comms when SLAs impact tenants.
