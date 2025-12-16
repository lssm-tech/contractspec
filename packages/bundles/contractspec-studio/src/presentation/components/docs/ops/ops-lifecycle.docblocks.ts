import type { DocBlock } from '@lssm/lib.contracts/docs';

export const opsLifecycleDocs: DocBlock[] = [
  {
    id: 'docs.ops.lifecycle-operations.goal',
    title: 'Lifecycle operations goal',
    summary:
      'Keep managed lifecycle assessments timely, auditable, and low-risk per tenant.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/lifecycle-operations/goal',
    tags: ['ops', 'lifecycle'],
    body: 'Operate lifecycle assessments with predictable cadence, clear observability, and reversible customizations so tenants stay aligned to milestones without risking data access.',
  },
  {
    id: 'docs.ops.lifecycle-operations.usage',
    title: 'Lifecycle operations usage guide',
    summary: 'Quick checklist for running lifecycle managed ops.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/lifecycle-operations/usage',
    tags: ['ops', 'lifecycle'],
    body: `- Run weekly auto-refresh per tenant; allow manual reruns behind \`LIFECYCLE_DETECTION_ALPHA\`.
- Publish top 3 actions + milestone checklist to Studio UI; emit lifecycle events.
- Monitor P95 < 500ms; alert on confidence < 0.5 or stage churn.
- Version overrides (weights, milestones, playbooks); never edit compiled JS.
- Log incidents for detection gaps or bad recommendations; gate ceremony output via flag if broken.`,
  },
  {
    id: 'docs.ops.lifecycle-operations.how',
    title: 'Lifecycle operations runbook',
    summary:
      'Full runbook for lifecycle assessments, customization, and alerts.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/lifecycle-operations/how',
    tags: ['ops', 'lifecycle'],
    body: `## Lifecycle Operations Runbook (ContractSpec Managed)

This runbook guides ContractSpec operators who run the lifecycle managed service (bundle + Studio surfaces). It focuses on cadence, monitoring, customization, and escalation without touching tenant-specific databases.

---

### 1. Responsibilities

1. **Assessment Cadence**
   - Default: weekly auto-refresh per tenant (using latest telemetry + questionnaires).
   - Manual rerun allowed any time via Studio admin (flag \`LIFECYCLE_DETECTION_ALPHA\` must be on).
2. **Guidance Delivery**
   - Publish top 3 recommended actions + milestone checklist to Studio UI.
   - Trigger ceremony payload when stage changes (Stage N → N+1 or N-1).
3. **Observability**
   - Ensure lifecycle events hit analytics pipeline (\`lifecycle_assessment_run\`, \`lifecycle_stage_changed\`, \`lifecycle_guidance_consumed\`).
   - Monitor error budget for orchestrator runtime (<500ms P95 on synthetic data).

---

### 2. Operational Flow

1. **Collect Signals**
   - Kick \`StageSignalCollector\` with adapters:
     - Analytics adapter pulls synthetic/aggregated metrics (no raw tenant data).
     - Questionnaire adapter reads stored JSON answers (per customer).
     - Intent adapter listens to observability events (optional).
2. **Score & Assess**
   - \`LifecycleOrchestrator\` returns \`LifecycleAssessment\` + confidence.
   - Persist assessment snapshot via Studio storage abstraction (file or KV).
3. **Generate Guidance**
   - \`LifecycleRecommendationEngine\` + \`LifecycleCeremonyDesigner\`.
   - Queue AI advisor agent call if \`LIFECYCLE_ADVISOR_ALPHA\` enabled.
4. **Publish**
   - Update Studio dashboard caches.
   - Emit lifecycle events.
   - Notify support (Slack/Webhook) when confidence < 0.5 or stage regresses.

---

### 3. Customization Guide

| What | How | Notes |
| --- | --- | --- |
| Stage weights | Update \`modules/lifecycle-core/configs/stage-weights.json\` via bundle config layer | Keep doc changes in sync; re-run unit tests |
| Milestones | Edit \`milestones-catalog.json\`, re-run CLI fixtures | Do not remove IDs used in history |
| Playbooks / ceremonies | Update \`modules/lifecycle-advisor/src/data/*.json\` | Provide localized copy if required |
| Feature flags | Toggle via progressive-delivery library (per tenant) | Document rationale and expiration date |

All overrides must be versioned; operators should never edit compiled JS.

---

### 4. Monitoring & Alerts

- **Dashboards** (Grafana or equivalent):
  - Stage distribution (per tenant / aggregated)
  - Assessment latency (trigger → completion)
  - Adoption metrics (guidance consumed events)
- **Alerts**:
  - \`LifecycleAssessmentFailed\` (error > 3 in 5m)
  - \`LifecycleConfidenceLow\` (confidence < 0.4 for 2 consecutive runs)
  - \`LifecycleStageChurn\` (stage oscillates >2 times in 7 days)

Alert recipients: lifecycle ops squad + product owner.

---

### 5. Escalation Playbook

1. **Detection gap** (signals missing):
   - Check analytics adapter health.
   - Fall back to questionnaire-only mode.
   - Log incident in lifecycle ops channel.
2. **Inaccurate recommendation**:
   - Capture assessment payload + manual notes.
   - File issue referencing \`LifecycleRecommendationEngine\`.
   - Update playbook JSON + add regression test.
3. **Ceremony assets broken**:
   - Disable \`LifecycleCeremonyDesigner\` output via feature flag.
   - Notify design systems to refresh assets.

---

### 6. Data Handling

- Managed bundle uses Studio storage; no direct access to tenant DBs.
- Retain last 10 assessments per tenant for comparison (configurable).
- Delete assessments on tenant request (flag \`lifecycle_data_retention_days\`).
- Questionnaire answers treated as customer data; store encrypted if possible.

---

### 7. Run / Maintenance Tasks

| Task | Cadence | Owner |
| --- | --- | --- |
| Review staged weight adjustments | Monthly | Lifecycle PM + Ops |
| Refresh milestone catalog with new learnings | Quarterly | Lifecycle strategist |
| Validate CLI + dashboard examples still work | Release cycle | DevRel |
| Audit analytics events coverage | Monthly | Data team |

---

### 8. Tooling References

- \`packages/bundles/lifecycle-managed/\` for managed runtime code.
- \`packages/modules/lifecycle-core/\` for detection logic.
- \`packages/modules/lifecycle-advisor/\` for playbooks and ceremonies.
- Progressive delivery config for lifecycle feature flags.

Maintain this runbook alongside code changes; every bundle release must document operational impact and flag defaults.`,
  },
];





