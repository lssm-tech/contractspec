import { createBehaviorTracker } from '@contractspec/lib.personalization/tracker';
import { InMemoryBehaviorStore } from '@contractspec/lib.personalization/store';
import { BehaviorAnalyzer } from '@contractspec/lib.personalization/analyzer';
import { Logger, LogLevel } from '@contractspec/lib.logger';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment:
    (process.env.NODE_ENV as 'production' | 'development' | 'test') ||
    'development',
  enableColors: process.env.NODE_ENV !== 'production',
});

export async function runBehaviorTrackingExample(): Promise<void> {
  const store = new InMemoryBehaviorStore();
  const tracker = createBehaviorTracker({
    store,
    context: {
      tenantId: 'acme',
      userId: 'user-123',
    },
  });

  tracker.trackFieldAccess({
    operation: 'billing.createOrder',
    field: 'internalNotes',
  });
  tracker.trackFieldAccess({
    operation: 'billing.createOrder',
    field: 'customerReference',
  });
  tracker.trackFeatureUsage({ feature: 'workflow-editor', action: 'opened' });
  tracker.trackWorkflowStep({
    workflow: 'invoice-approval',
    step: 'review',
    status: 'entered',
  });
  await tracker.flush();

  const analyzer = new BehaviorAnalyzer(store);
  const insights = await analyzer.analyze({
    tenantId: 'acme',
    userId: 'user-123',
  });

  logger.info('Behavior insights computed', { insights });
}
