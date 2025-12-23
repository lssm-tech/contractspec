import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const analyticsDashboardDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.analytics-dashboard',
    title: 'Analytics Dashboard',
    summary:
      'Multi-tenant analytics with dashboards, widgets, query builder, and scheduled reports built on the Event Bus.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/analytics-dashboard',
    tags: ['analytics', 'dashboards', 'bi', 'queries'],
    body: `## Entities

- Dashboard, Widget, Query, Report.
- Widget/query configs stay declarative for regeneration.

## Contracts

- \`analytics.dashboard.create\`, \`analytics.widget.add\`, \`analytics.query.execute\`, \`analytics.dashboard.get\`.
- Metrics can source from Event Bus schemas and Usage/Metering module.

## Events

- dashboard.created/updated, widget.added, report.scheduled/sent.
- Emitted for audit + notification hooks.

## UI / Presentations

- Dashboard list, dashboard view, query builder, widget gallery.
- Registered under \`analytics-dashboard\` template in Template Registry.

## Notes

- Enforce org scoping for multi-tenant isolation.
- Use Feature Flags for beta widgets; Metering to track query volume.
`,
  },
  {
    id: 'docs.examples.analytics-dashboard.goal',
    title: 'Analytics Dashboard — Goal',
    summary: 'Why this template matters and what success looks like.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/analytics-dashboard/goal',
    tags: ['analytics', 'goal'],
    body: `## Why it matters
- Give teams a regenerable analytics workspace that stays in sync with Event Bus, Usage/Metering, and presentations.
- Avoid dashboard drift by keeping schema-first widgets/queries.

## Business/Product goal
- Deliver tenant-scoped dashboards, governed queries, and scheduled reports with clear ownership and auditability.
- Enable feature-flagged rollout of new widgets and sampling for cost control.

## Success criteria
- Dashboards can be regenerated safely from spec changes.
- Queries/widgets have enforced validation; PII is redacted per policy.`,
  },
  {
    id: 'docs.examples.analytics-dashboard.usage',
    title: 'Analytics Dashboard — Usage',
    summary: 'How to seed, extend, and safely regenerate dashboards.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/analytics-dashboard/usage',
    tags: ['analytics', 'usage'],
    body: `## Setup
1) Seed dashboards/widgets (via template registry) to preload sample queries.
2) Configure org/tenant scope and attach Usage/Metering for cost/sampling controls.

## Extend & regenerate
1) Add or modify widget/query schemas in the spec (inputs, validation, PII paths).
2) Regenerate to update UI + API + events; review presentations for redaction.
3) Use Feature Flags to roll out new widgets or sampling knobs gradually.

## Guardrails
- Keep all query inputs validated; mark PII paths in policy.
- Use Audit Trail for report deliveries; Notifications for scheduled sends.`,
  },
  {
    id: 'docs.examples.analytics-dashboard.constraints',
    title: 'Analytics Dashboard — Constraints & Safety',
    summary: 'Internal guardrails for queries, widgets, and regeneration.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/analytics-dashboard/constraints',
    tags: ['analytics', 'constraints', 'internal'],
    body: `## Constraints
- Queries and widgets must declare inputs/validation in spec; no ad-hoc query strings.
- Regeneration must preserve sampling/windowing semantics; document changes explicitly.
- Events/usage metrics should remain consistent with Metering/Audit wiring.

## PII & Data
- Mark PII paths (user ids, emails) in presentations for redaction.
- Avoid exposing raw query payloads in MCP/web without policy checks.

## Verification
- Add fixtures for widget/query schema changes and scheduled reports.
- Run regeneration diff when adjusting query builders; ensure UI/markdown targets updated.
- Confirm feature-flagged widgets default to safe/off for new tenants.`,
  },
];

registerDocBlocks(analyticsDashboardDocBlocks);
