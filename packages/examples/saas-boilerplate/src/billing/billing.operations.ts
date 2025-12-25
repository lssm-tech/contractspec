import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import {
  CheckFeatureAccessInputModel,
  CheckFeatureAccessOutputModel,
  GetUsageSummaryInputModel,
  GetUsageSummaryOutputModel,
  RecordUsageInputModel,
  RecordUsageOutputModel,
  SubscriptionModel,
  UsageRecordedPayloadModel,
} from './billing.schema';

const OWNERS = ['@example.saas-boilerplate'] as const;

/**
 * Get subscription status.
 */
export const GetSubscriptionContract = defineQuery({
  meta: {
    key: 'saas.billing.subscription.get',
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
  acceptance: {
    scenarios: [
      {
        key: 'get-subscription-happy-path',
        given: ['Organization has active subscription'],
        when: ['User requests subscription status'],
        then: ['Subscription details are returned'],
      },
    ],
    examples: [
      {
        key: 'get-basic',
        input: null,
        output: { plan: 'pro', status: 'active', currentPeriodEnd: '2025-02-01T00:00:00Z' },
      },
    ],
  },
});

/**
 * Record feature usage.
 */
export const RecordUsageContract = defineCommand({
  meta: {
    key: 'saas.billing.usage.record',
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
        key: 'billing.usage.recorded',
        version: 1,
        when: 'Usage is recorded',
        payload: UsageRecordedPayloadModel,
      },
    ],
  },
  acceptance: {
    scenarios: [
      {
        key: 'record-usage-happy-path',
        given: ['Organization exists'],
        when: ['System records feature usage'],
        then: ['Usage is recorded'],
      },
    ],
    examples: [
      {
        key: 'record-api-call',
        input: { feature: 'api_calls', quantity: 1, idempotencyKey: 'abc-123' },
        output: { recorded: true, currentUsage: 100 },
      },
    ],
  },
});

/**
 * Get usage summary.
 */
export const GetUsageSummaryContract = defineQuery({
  meta: {
    key: 'saas.billing.usage.summary',
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
  acceptance: {
    scenarios: [
      {
        key: 'get-usage-happy-path',
        given: ['Organization has usage history'],
        when: ['User requests usage summary'],
        then: ['Usage metrics are returned'],
      },
    ],
    examples: [
      {
        key: 'get-current-usage',
        input: { period: 'current' },
        output: { features: [{ name: 'api_calls', used: 100, limit: 1000 }] },
      },
    ],
  },
});

/**
 * Check feature access.
 */
export const CheckFeatureAccessContract = defineQuery({
  meta: {
    key: 'saas.billing.feature.check',
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
  acceptance: {
    scenarios: [
      {
        key: 'check-access-granted',
        given: ['Organization is on Pro plan'],
        when: ['User checks access to Pro feature'],
        then: ['Access is granted'],
      },
    ],
    examples: [
      {
        key: 'check-advanced-reports',
        input: { feature: 'advanced_reports' },
        output: { hasAccess: true, reason: 'Included in Pro plan' },
      },
    ],
  },
});
