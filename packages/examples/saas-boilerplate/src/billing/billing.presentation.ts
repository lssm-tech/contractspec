import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';

/**
 * Presentation for subscription overview.
 */
export const SubscriptionPresentation: PresentationSpec = {
  meta: {
    key: 'saas.billing.subscription',
    version: 1,
    title: 'Subscription Status',
    description:
      'Subscription status with plan info, limits, and current usage',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['billing', 'subscription'],
    stability: StabilityEnum.Beta,
    goal: 'View subscription plan and status',
    context: 'Billing section',
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
    key: 'saas.billing.usage',
    version: 1,
    title: 'Usage Dashboard',
    description: 'Usage metrics and breakdown by resource type',
    domain: 'saas-boilerplate',
    owners: ['@saas-team'],
    tags: ['billing', 'usage', 'metrics'],
    stability: StabilityEnum.Beta,
    goal: 'Monitor feature usage and limits',
    context: 'Billing section',
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
