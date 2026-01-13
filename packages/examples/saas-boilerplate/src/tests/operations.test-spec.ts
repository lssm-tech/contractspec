import type { TestSpec } from '@contractspec/lib.contracts';

function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const ProjectListTest = defineTestSpec({
  meta: {
    key: 'saas.project.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.saas-boilerplate'],
    description: 'Test for listing projects',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'saas.project.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'saas.project.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'saas.project.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const ProjectGetTest = defineTestSpec({
  meta: {
    key: 'saas.project.get.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.saas-boilerplate'],
    description: 'Test for getting project',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'saas.project.get', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'saas.project.get' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'saas.project.get' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const BillingSubscriptionGetTest = defineTestSpec({
  meta: {
    key: 'saas.billing.subscription.get.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.saas-boilerplate'],
    description: 'Test for getting subscription',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'saas.billing.subscription.get', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'saas.billing.subscription.get' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'saas.billing.subscription.get' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const BillingUsageSummaryTest = defineTestSpec({
  meta: {
    key: 'saas.billing.usage.summary.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.saas-boilerplate'],
    description: 'Test for getting usage summary',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'saas.billing.usage.summary', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'saas.billing.usage.summary' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'saas.billing.usage.summary' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
