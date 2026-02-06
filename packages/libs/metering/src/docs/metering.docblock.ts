import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const meteringDocBlocks: DocBlock[] = [
  {
    id: 'docs.metering.usage',
    title: 'Usage Metering & Billing Core',
    summary:
      'Reusable usage/metering layer with metric definitions, usage ingestion, aggregation, thresholds, and alerts for billing or quotas.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/metering/usage',
    tags: ['metering', 'usage', 'billing', 'quotas'],
    body: `## Capabilities

- **Entities**: MetricDefinition, UsageRecord, UsageSummary, UsageThreshold, UsageAlert.
- **Contracts**: define/list metrics; record usage (batch + idempotent); retrieve usage by subject; manage thresholds and alerts.
- **Aggregation**: hourly/daily/weekly/monthly rollups with SUM/COUNT/AVG/MIN/MAX/LAST strategies.
- **Events**: usage.recorded, usage.aggregated, threshold.exceeded (see events export).

## Usage

1) Compose schema
- Add \`meteringSchemaContribution\` to your schema composition.

2) Register contracts/events
- Import from \`@contractspec/lib.metering\` into your spec registry.

3) Ingest usage
- Use \`recordUsage\` contract (see contracts export) from application services whenever a billable/important action happens (e.g., agent run, API call).

4) Aggregate + thresholds
- Run scheduled jobs using \`aggregateUsage\` helper to roll up summaries.
- Configure \`UsageThreshold\` to emit alerts or blocking actions; pipe alerts into Notifications/Audit.
- Use \`PosthogMeteringReader\` to backfill or validate usage from PostHog events.

## Example

${'```'}ts
import { meteringSchemaContribution } from '@contractspec/lib.metering';
import { aggregateUsage } from '@contractspec/lib.metering/aggregation';

// schema composition
const schema = {
  modules: [meteringSchemaContribution],
};

// aggregation job
await aggregateUsage({
  metrics: metricRepository,
  usage: usageRepository,
  period: 'DAILY',
});
${'```'},

## Guardrails

- Keep metric keys stable; store quantities as decimals for currency/units.
- Use idempotency keys for external ingestion; avoid PII in metric metadata.
- Scope by org/user for multi-tenant isolation; emit audit + analytics events on changes.
`,
  },
];

registerDocBlocks(meteringDocBlocks);
