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
];

registerDocBlocks(analyticsDashboardDocBlocks);
