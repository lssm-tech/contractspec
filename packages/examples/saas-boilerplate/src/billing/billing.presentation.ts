import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';

/**
 * Presentation for subscription overview.
 */
export const SubscriptionPresentation: PresentationSpec = {
  meta: {
    name: 'saas.billing.subscription',
    version: 1,
    title: 'Subscription Status',
    description:
      'Subscription status with plan info, limits, and current usage',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['billing', 'subscription'],
    stability: StabilityEnum.Beta,
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
export const UsageDashboardPresentation: PresentationSpec = {
  meta: {
    name: 'saas.billing.usage',
    version: 1,
    title: 'Usage Dashboard',
    description: 'Usage metrics and breakdown by resource type',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['billing', 'usage', 'metrics'],
    stability: StabilityEnum.Beta,
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
