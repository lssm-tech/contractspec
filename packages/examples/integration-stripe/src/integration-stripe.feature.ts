import { defineFeature } from '@contractspec/lib.contracts-spec';

export const IntegrationStripeFeature = defineFeature({
  meta: {
    key: 'integration-stripe',
    version: '1.0.0',
    title: 'Stripe Payments Integration',
    description:
      'Stripe payments integration with blueprint, workflow, and tenant configuration',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'stripe', 'payments'],
    stability: 'experimental',
  },

  integrations: [
    { key: 'integration-stripe.integration.psp', version: '1.0.0' },
  ],

  workflows: [{ key: 'integration-stripe.workflow.payment', version: '1.0.0' }],

  policies: [{ key: 'integration-stripe.policy.payments', version: '1.0.0' }],

  docs: [
    'docs.examples.integration-stripe',
    'docs.examples.integration-stripe.usage',
  ],
});
