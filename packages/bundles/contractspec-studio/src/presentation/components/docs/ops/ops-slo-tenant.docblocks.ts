import type { DocBlock } from '@lssm/lib.contracts/docs';

export const opsSloTenantDocs: DocBlock[] = [
  {
    id: 'docs.ops.slo-management.goal',
    title: 'SLO management goal',
    summary: 'Keep availability/latency SLOs observable and enforceable.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/slo-management/goal',
    tags: ['ops', 'slo'],
    body: 'Ensure every capability has a versioned SLO with alerts, burn-rate workflows, and incident cross-links so rollbacks are justified and auditable.',
  },
  {
    id: 'docs.ops.slo-management.usage',
    title: 'SLO management usage guide',
    summary: 'Quick checklist for defining and operating SLOs.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/slo-management/usage',
    tags: ['ops', 'slo'],
    body: `- Define \`SLODefinition\` per capability; tag tenant/tier for filtering.
- Deploy \`SLOMonitor\`; pipe incidents to PagerDuty + Ops Slack.
- Fast burn 14x -> page; slow burn 6x -> create ticket.
- Use \`SLOSnapshot\` for dashboards; include deployment IDs in incidents.
- Reset or advance error budgets after resolution when appropriate.`,
  },
  {
    id: 'docs.ops.slo-management.how',
    title: 'SLO management runbook',
    summary: 'Detailed runbook for SLO lifecycle and incident handling.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/slo-management/how',
    tags: ['ops', 'slo'],
    body: `# SLO Management Runbook

## 1. Definition Lifecycle
1. Create an entry in \`SLODefinition\` via migration or the Ops Console.
2. Map capabilities to specs: e.g. \`orders.create\` availability 99.9%, P99 500ms.
3. Store tags (\`tenant:enterprise\`, \`tier:mission-critical\`) for filtering dashboards.

## 2. Monitoring
- Deploy \`SLOMonitor\` alongside each critical service.
- Pipe \`IncidentManager.createIncident\` into PagerDuty + Ops Slack.
- Fast burn threshold (14x) -> page immediately; slow burn (6x) -> create ticket.

\`\`\`ts
const monitor = new SLOMonitor({
  definition,
  incidentManager,
});
monitor.recordWindow({ good, bad, latencyP99, latencyP95 });
\`\`\`

## 3. Error Budget Workflow
- \`ErrorBudget\` rows track rolling windows (default 7d).
- Add runbooks for "burn > 50%" (freeze deploys) and "burn > 80%" (roll back latest change).
- Use \`SLOSnapshot\` to regenerate dashboards (no warehouse needed).

## 4. Incident Triage
- Every incident includes snapshot JSON (availability, latency, burn rate).
- Attach deployment IDs from \`Deployment\` table to cross-link incidents & rollouts.
- After resolution set \`acknowledgedAt\` and reset error budget (new period) if needed.

## 5. Reporting
- Weekly summary = AVG burn rate, # incidents, # auto-rollbacks triggered by SLO monitor.
- Feed \`SLOIncident\` into Growth Agent for customer comms when SLAs impact tenants.`,
  },
  {
    id: 'docs.ops.tenant-customization.goal',
    title: 'Tenant customization goal',
    summary:
      'Let tenants customize overlays/workflows safely with audit and rollback.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/ops/tenant-customization/goal',
    tags: ['ops', 'tenant'],
    body: 'Provide controlled overlays and workflow extensions per tenant with signed assets, versioning, and observability so UI/flow tweaks stay safe and reversible.',
  },
  {
    id: 'docs.ops.tenant-customization.usage',
    title: 'Tenant customization usage guide',
    summary: 'Quick steps for onboarding a tenant customization.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ops/tenant-customization/usage',
    tags: ['ops', 'tenant'],
    body: `- Capture fields to hide/rename and workflow deviations.
- Build overlay in overlay editor; sign JSON with tenant key.
- Persist in \`Overlay\` table; register via \`OverlayRegistry\` or admin API.
- Compose \`WorkflowExtension\`; store alongside overlay metadata.
- Run sandbox smoke tests; ensure audit logs capture overlay events.`,
  },
  {
    id: 'docs.ops.tenant-customization.how',
    title: 'Tenant customization runbook',
    summary: 'Detailed runbook for overlays and workflow extensions.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/ops/tenant-customization/how',
    tags: ['ops', 'tenant'],
    body: `# Tenant Customization Runbook

Phase 4 introduces managed overlays and workflow extensions. Ops teams should follow this flow when onboarding a tenant that requests UI tweaks or workflow changes.

1. **Collect requirements**
   - List fields to hide/show or rename.
   - Capture workflow deviations (extra approvals, reordered steps).
2. **Create overlay**
   - Use the overlay editor app (\`packages/apps/overlay-editor\`) to draft the overlay.
   - Export JSON and sign with the tenant’s registered key (store keys in \`OverlaySigningKey\`).
3. **Register overlay**
   - Persist the signed payload in the \`Overlay\` table via provisioning scripts.
   - Register with \`OverlayRegistry\` at boot or push via admin API.
4. **Compose workflows**
   - Define a \`WorkflowExtension\` for the tenant (see \`@lssm/lib.workflow-composer\` docs).
   - Store extension config alongside overlay metadata.
5. **Verify**
   - Run smoke tests in the tenant sandbox.
   - Ensure audit logs capture overlay application events.
6. **Monitor**
   - Use behavior tracking dashboards to confirm adoption or trigger cleanup when overlays become obsolete.

---

## Lifecycle customization

Managed tenants can override lifecycle playbooks without touching database schemas:

1. **Stage definitions**
   - Add overrides in \`packages/modules/lifecycle-core/src/data/stage-weights.json\`.
   - Keep the canonical doc (\`docs/product/lifecycle-stages.md\`) in sync with any new stage or axis.
2. **Milestones**
   - Extend \`milestones-catalog.json\` with tenant-specific IDs. Prefix with the tenant or vertical slug (e.g., \`tenant-acme-stage3-retention\`).
   - Use feature flag \`lifecycle_managed_service\` to gate access while new milestones are validated.
3. **Playbooks & ceremonies**
   - Customize \`packages/modules/lifecycle-advisor/src/data/stage-playbooks.ts\`.
   - Use Studio’s localization hooks to translate ceremony copy for low-tech flows.
4. **Event routing**
   - Subscribe to \`LifecycleKpiPipeline\` events (see \`@lssm/bundle.lifecycle-managed\`) to forward stage changes into tenant-specific analytics.

All lifecycle overrides must be versioned alongside the tenant’s overlay and workflow extensions so ops can rollback safely.`,
  },
];

