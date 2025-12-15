import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';

/**
 * Presentation for subscription overview.
 */
export const SubscriptionPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'saas.billing.subscription',
    version: 1,
    description:
      'Subscription status with plan info, limits, and current usage',
    domain: 'saas-boilerplate',
    owners: ['saas-team'],
    tags: ['billing', 'subscription'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SubscriptionView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['saas.billing.enabled'],
  },
};

/**
 * Presentation for usage dashboard.
 */
export const UsageDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'saas.billing.usage',
    version: 1,
    description: 'Usage metrics and breakdown by resource type',
    domain: 'saas-boilerplate',
    owners: ['saas-team'],
    tags: ['billing', 'usage', 'metrics'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'UsageDashboardView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['saas.billing.enabled'],
  },
};

