# Anomaly Detection Runbook

## 1. Pipeline Overview
1. `createTracingMiddleware({ onSample })` emits metric points (latency, errors, throughput).
2. Feed points into `AnomalyDetector.evaluate` after enriching with timestamps.
3. On signal, run `RootCauseAnalyzer.analyze(signal, recentDeployments)`.
4. Send deduplicated alerts via `AlertManager` (cooldown default 60s).

## 2. Configuration
- Baseline: exponential moving average with `alpha=0.2`, 10-sample warmup.
- Thresholds (default):
  - Error rate delta 50%
  - Latency delta 35%
  - Throughput drop 40%
- Override per capability when traffic is bursty (e.g., nightly batch jobs).

## 3. Auto-Rollback Hook
- When anomaly type = `error_rate_spike` AND `DeploymentCoordinator` is active, trigger rollback immediately.
- Record an `AnomalyEvent` pointing to `deploymentId` for auditability.

## 4. Postmortem Checklist
- Export anomaly JSON (metrics + baseline) into the incident doc.
- Verify `MetricBaseline` updated after fix; burn rate should fall < 2x.
- Backfill `AnomalyEvent.notes` with RCA outcome for future training.

## 5. Testing
- Use load test harness to inject latency and verify detector emits signals within 30 seconds.
- Chaos suite should simulate upstream outages to ensure throughput-drop detection fires.
