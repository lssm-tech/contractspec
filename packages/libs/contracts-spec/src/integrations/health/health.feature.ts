import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const HealthFeature = defineFeature({
  meta: {
    key: 'health',
    version: '1.0.0',
    title: 'Health Integrations',
    description:
      'Unified health and wearable data sync for activities, workouts, sleep, biometrics, nutrition, and webhooks.',
    domain: 'integrations',
    owners: ['@platform.integrations'],
    tags: ['health', 'wearables', 'integrations'],
    stability: 'experimental',
  },
  operations: [
    { key: 'health.activities.list', version: '1.0.0' },
    { key: 'health.activities.sync', version: '1.0.0' },
    { key: 'health.workouts.list', version: '1.0.0' },
    { key: 'health.workouts.sync', version: '1.0.0' },
    { key: 'health.sleep.list', version: '1.0.0' },
    { key: 'health.sleep.sync', version: '1.0.0' },
    { key: 'health.biometrics.list', version: '1.0.0' },
    { key: 'health.biometrics.sync', version: '1.0.0' },
    { key: 'health.nutrition.list', version: '1.0.0' },
    { key: 'health.nutrition.sync', version: '1.0.0' },
    { key: 'health.webhooks.ingest', version: '1.0.0' },
  ],
  events: [],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
  capabilities: {
    provides: [{ key: 'health', version: '1.0.0' }],
    requires: [{ key: 'identity', version: '1.0.0' }],
  },
});
