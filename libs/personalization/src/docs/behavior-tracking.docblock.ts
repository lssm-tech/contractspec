import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

export const personalization_behavior_tracking_DocBlocks: DocBlock[] = [
  {
    id: 'docs.personalization.behavior-tracking',
    title: 'Behavior Tracking',
    summary:
      '`@contractspec/lib.personalization` provides primitives to observe how tenants/users interact with specs and turn that telemetry into personalization insights.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/personalization/behavior-tracking',
    tags: ['personalization', 'behavior-tracking'],
    body: "# Behavior Tracking\n\n`@contractspec/lib.personalization` provides primitives to observe how tenants/users interact with specs and turn that telemetry into personalization insights.\n\n## Tracker\n\n```ts\nimport { createBehaviorTracker } from '@contractspec/lib.personalization';\nimport { InMemoryBehaviorStore } from '@contractspec/lib.personalization/store';\n\nconst tracker = createBehaviorTracker({\n  store: new InMemoryBehaviorStore(),\n  context: { tenantId: ctx.tenant.id, userId: ctx.identity.userId },\n  autoFlushIntervalMs: 5000,\n});\n\ntracker.trackFieldAccess({ operation: 'billing.createOrder', field: 'internalNotes' });\ntracker.trackFeatureUsage({ feature: 'workflow-editor', action: 'opened' });\ntracker.trackWorkflowStep({ workflow: 'invoice-approval', step: 'review', status: 'entered' });\n```\n\nAll events are buffered and flushed either when the buffer hits 25 entries or when `autoFlushIntervalMs` elapses. Tracked metrics flow to OpenTelemetry via the meter/counter built into the tracker.\n\n## Analyzer\n\n```ts\nimport { BehaviorAnalyzer } from '@contractspec/lib.personalization/analyzer';\n\nconst analyzer = new BehaviorAnalyzer(store, { fieldInactivityThreshold: 2 });\nconst insights = await analyzer.analyze({ tenantId: 'acme', userId: 'manager-42', windowMs: 7 * 24 * 60 * 60 * 1000 });\n\n/*\n{\n  unusedFields: ['internalNotes'],\n  suggestedHiddenFields: ['internalNotes'],\n  frequentlyUsedFields: ['customerReference', 'items'],\n  workflowBottlenecks: [{ workflow: 'invoice-approval', step: 'finance-review', dropRate: 0.6 }],\n  layoutPreference: 'table'\n}\n*/\n```\n\nUse the analyzer output with the overlay adapter to generate suggestions automatically.\n\n## Adapter\n\n```ts\nimport { insightsToOverlaySuggestion } from '@contractspec/lib.personalization/adapter';\n\nconst overlay = insightsToOverlaySuggestion(insights, {\n  overlayId: 'acme-order-form',\n  tenantId: 'acme',\n  capability: 'billing.createOrder',\n});\n```\n\nWhen the adapter returns an overlay spec, pass it to the overlay engine to register or sign it.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  },
];
registerDocBlocks(personalization_behavior_tracking_DocBlocks);
