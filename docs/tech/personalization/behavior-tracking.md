# Behavior Tracking

`@lssm/lib.personalization` provides primitives to observe how tenants/users interact with specs and turn that telemetry into personalization insights.

## Tracker

```ts
import { createBehaviorTracker } from '@lssm/lib.personalization';
import { InMemoryBehaviorStore } from '@lssm/lib.personalization/store';

const tracker = createBehaviorTracker({
  store: new InMemoryBehaviorStore(),
  context: { tenantId: ctx.tenant.id, userId: ctx.identity.userId },
  autoFlushIntervalMs: 5000,
});

tracker.trackFieldAccess({ operation: 'billing.createOrder', field: 'internalNotes' });
tracker.trackFeatureUsage({ feature: 'workflow-editor', action: 'opened' });
tracker.trackWorkflowStep({ workflow: 'invoice-approval', step: 'review', status: 'entered' });
```

All events are buffered and flushed either when the buffer hits 25 entries or when `autoFlushIntervalMs` elapses. Tracked metrics flow to OpenTelemetry via the meter/counter built into the tracker.

## Analyzer

```ts
import { BehaviorAnalyzer } from '@lssm/lib.personalization/analyzer';

const analyzer = new BehaviorAnalyzer(store, { fieldInactivityThreshold: 2 });
const insights = await analyzer.analyze({ tenantId: 'acme', userId: 'manager-42', windowMs: 7 * 24 * 60 * 60 * 1000 });

/*
{
  unusedFields: ['internalNotes'],
  suggestedHiddenFields: ['internalNotes'],
  frequentlyUsedFields: ['customerReference', 'items'],
  workflowBottlenecks: [{ workflow: 'invoice-approval', step: 'finance-review', dropRate: 0.6 }],
  layoutPreference: 'table'
}
*/
```

Use the analyzer output with the overlay adapter to generate suggestions automatically.

## Adapter

```ts
import { insightsToOverlaySuggestion } from '@lssm/lib.personalization/adapter';

const overlay = insightsToOverlaySuggestion(insights, {
  overlayId: 'acme-order-form',
  tenantId: 'acme',
  capability: 'billing.createOrder',
});
```

When the adapter returns an overlay spec, pass it to the overlay engine to register or sign it.






















