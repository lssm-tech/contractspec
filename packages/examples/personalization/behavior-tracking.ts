import { createBehaviorTracker } from '@lssm/lib.personalization/tracker';
import { InMemoryBehaviorStore } from '@lssm/lib.personalization/store';
import { BehaviorAnalyzer } from '@lssm/lib.personalization/analyzer';

async function main() {
  const store = new InMemoryBehaviorStore();
  const tracker = createBehaviorTracker({
    store,
    context: {
      tenantId: 'acme',
      userId: 'user-123',
    },
  });

  tracker.trackFieldAccess({ operation: 'billing.createOrder', field: 'internalNotes' });
  tracker.trackFieldAccess({ operation: 'billing.createOrder', field: 'customerReference' });
  tracker.trackFeatureUsage({ feature: 'workflow-editor', action: 'opened' });
  tracker.trackWorkflowStep({
    workflow: 'invoice-approval',
    step: 'review',
    status: 'entered',
  });
  await tracker.flush();

  const analyzer = new BehaviorAnalyzer(store);
  const insights = await analyzer.analyze({ tenantId: 'acme', userId: 'user-123' });
  console.log(insights);
}

main();






















