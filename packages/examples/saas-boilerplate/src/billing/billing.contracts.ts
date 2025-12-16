import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import {
  SubscriptionModel,
  RecordUsageInputModel,
  RecordUsageOutputModel,
  UsageRecordedPayloadModel,
  GetUsageSummaryInputModel,
  GetUsageSummaryOutputModel,
  CheckFeatureAccessInputModel,
  CheckFeatureAccessOutputModel,
} from './billing.schema';

const OWNERS = ['example.saas-boilerplate'] as const;

/**
 * Get subscription status.
 */
export const GetSubscriptionContract = defineQuery({
  meta: {
    name: 'saas.billing.subscription.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'billing', 'subscription'],
    description: 'Get organization subscription status.',
    goal: 'Show current plan and billing status.',
    context: 'Billing page, plan upgrade prompts.',
  },
  io: {
    input: null,
    output: SubscriptionModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Record feature usage.
 */
export const RecordUsageContract = defineCommand({
  meta: {
    name: 'saas.billing.usage.record',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'billing', 'usage'],
    description: 'Record usage of a metered feature.',
    goal: 'Track feature usage for billing.',
    context: 'Called by services when metered features are used.',
  },
  io: {
    input: RecordUsageInputModel,
    output: RecordUsageOutputModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'billing.usage.recorded',
        version: 1,
        when: 'Usage is recorded',
        payload: UsageRecordedPayloadModel,
      },
    ],
  },
});

/**
 * Get usage summary.
 */
export const GetUsageSummaryContract = defineQuery({
  meta: {
    name: 'saas.billing.usage.summary',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'billing', 'usage'],
    description: 'Get usage summary for the current billing period.',
    goal: 'Show usage vs limits.',
    context: 'Billing page, usage dashboards.',
  },
  io: {
    input: GetUsageSummaryInputModel,
    output: GetUsageSummaryOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Check feature access.
 */
export const CheckFeatureAccessContract = defineQuery({
  meta: {
    name: 'saas.billing.feature.check',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['saas', 'billing', 'feature'],
    description: 'Check if organization has access to a feature.',
    goal: 'Gate features based on plan/usage.',
    context: 'Feature access checks, upgrade prompts.',
  },
  io: {
    input: CheckFeatureAccessInputModel,
    output: CheckFeatureAccessOutputModel,
  },
  policy: {
    auth: 'user',
  },
});
