import type { DocBlock } from '@lssm/lib.contracts/docs';

export const opsRunbookDocsA: DocBlock[] = [
  {
    id: 'docs.ops.anomaly-detection.goal',
    title: 'Anomaly detection goal',
    summary: 'Why anomaly detection matters for ops stability.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/anomaly-detection/goal',
    tags: ['ops', 'observability'],
    body: 'Ensure anomalies are detected early to protect latency, error rate, and throughput SLAs; keep rollback hooks ready and audits reproducible.',
  },
  {
    id: 'docs.ops.anomaly-detection.usage',
    title: 'Anomaly detection usage guide',
    summary: 'How to run and consume anomaly detection in operations.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/anomaly-detection/usage',
    tags: ['ops', 'observability'],
    body: `- Enable tracing middleware; emit latency/error/throughput samples.
- Configure thresholds per capability when bursty traffic exists.
- Wire rollback hook in DeploymentCoordinator for error spikes.
- Export anomaly JSON into incidents; update MetricBaseline post-fix.
- Run chaos/load checks to validate signals within 30s.`,
  },
  {
    id: 'docs.ops.anomaly-detection.how',
    title: 'Anomaly detection runbook',
    summary: 'Step-by-step runbook for anomaly signals and rollback hooks.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/anomaly-detection/how',
    tags: ['ops', 'observability'],
    body: `# Anomaly Detection Runbook

## 1. Pipeline Overview
1. \`createTracingMiddleware({ onSample })\` emits metric points (latency, errors, throughput).
2. Feed points into \`AnomalyDetector.evaluate\` after enriching with timestamps.
3. On signal, run \`RootCauseAnalyzer.analyze(signal, recentDeployments)\`.
4. Send deduplicated alerts via \`AlertManager\` (cooldown default 60s).

## 2. Configuration
- Baseline: exponential moving average with \`alpha=0.2\`, 10-sample warmup.
- Thresholds (default):
  - Error rate delta 50%
  - Latency delta 35%
  - Throughput drop 40%
- Override per capability when traffic is bursty (e.g., nightly batch jobs).

## 3. Auto-Rollback Hook
- When anomaly type = \`error_rate_spike\` AND \`DeploymentCoordinator\` is active, trigger rollback immediately.
- Record an \`AnomalyEvent\` pointing to \`deploymentId\` for auditability.

## 4. Postmortem Checklist
- Export anomaly JSON (metrics + baseline) into the incident doc.
- Verify \`MetricBaseline\` updated after fix; burn rate should fall < 2x.
- Backfill \`AnomalyEvent.notes\` with RCA outcome for future training.

## 5. Testing
- Use load test harness to inject latency and verify detector emits signals within 30 seconds.
- Chaos suite should simulate upstream outages to ensure throughput-drop detection fires.`,
  },
  {
    id: 'docs.ops.cost-optimization.goal',
    title: 'Cost optimization goal',
    summary: 'Keep spend predictable and actionable for ops and finance.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/cost-optimization/goal',
    tags: ['ops', 'cost'],
    body: 'Align telemetry, budgets, and rollback levers so cost spikes are detected early, communicated clearly, and mitigated without breaking SLAs.',
  },
  {
    id: 'docs.ops.cost-optimization.usage',
    title: 'Cost optimization usage guide',
    summary: 'Quick checklist to run cost tracking and optimization.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/cost-optimization/usage',
    tags: ['ops', 'cost'],
    body: `- Emit \`CostSample\` via wrapped DB/HTTP clients; include provider/invoice cost.
- Batch into \`OperationCost\` every 5m; alert at 80% of monthlyLimit.
- Nightly run \`OptimizationRecommender.generate\`; push tickets with evidence.
- Use regional overrides for \`defaultCostModel\` when infra prices differ.
- Send proactive alerts for ±20% deviations to enterprise tenants.`,
  },
  {
    id: 'docs.ops.cost-optimization.how',
    title: 'Cost optimization runbook',
    summary: 'Step-by-step cost tracking, alerting, and communication.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/cost-optimization/how',
    tags: ['ops', 'cost'],
    body: `# Cost Tracking & Optimization Runbook

## 1. Instrumentation
- Wrap DB client and HTTP adapters to emit \`CostSample\`s to \`CostTracker.recordSample\`.
- For external APIs, attach provider name + actual invoice cost when available.
- Persist aggregate rows into \`OperationCost\` (batch job every 5 minutes).

## 2. Budgets
- Insert/update \`TenantBudget\` per workspace.
- Default alert threshold: 80% of \`monthlyLimit\`.
- \`BudgetAlertManager.track(summary)\` emits Slack + email payloads including breakdown JSON.

## 3. Optimization Suggestions
- Nightly job reads \`OperationCost\` and creates \`OptimizationSuggestion\` records via \`OptimizationRecommender.generate\`.
- Auto-file tickets or push to Growth Agent backlog with the evidence (avg reads, compute share, external spend).

## 4. Forecasting
- Cost model inputs live in \`@lssm/lib.cost-tracking\` (\`defaultCostModel\`). Override per region if infra prices differ.
- Keep a history of \`OperationCost\` to render spark lines in Ops Console; highlight slopes > 15% week-over-week.

## 5. Customer Communication
- For enterprise tenants offer proactive alerts when spend deviates ±20% from plan.
- Connect \`TenantBudget\` alerts to CRM notes so Success teams see when automation saved costs.`,
  },
];






