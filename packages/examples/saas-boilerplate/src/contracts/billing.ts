import { defineCommand, defineQuery, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

const OWNERS = ['example.saas-boilerplate'] as const;

// ============ Enums (for contract schemas) ============
// Note: Entity enums for Prisma are defined separately in ../entities

const SubscriptionStatusSchemaEnum = defineEnum('SubscriptionStatus', [
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'PAUSED',
]);

export const FeatureAccessReasonEnum = defineEnum('FeatureAccessReason', [
  'included',
  'limit_available',
  'limit_reached',
  'not_in_plan',
]);

// ============ Schemas ============

export const SubscriptionModel = defineSchemaModel({
  name: 'Subscription',
  description: 'Organization subscription details',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    planId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    planName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: SubscriptionStatusSchemaEnum, isOptional: false },
    currentPeriodStart: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    currentPeriodEnd: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    trialEndsAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cancelAtPeriodEnd: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const UsageSummaryModel = defineSchemaModel({
  name: 'UsageSummary',
  description: 'Usage summary for a feature',
  fields: {
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    used: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    unit: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    percentage: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
  },
});

export const RecordUsageInputModel = defineSchemaModel({
  name: 'RecordUsageInput',
  description: 'Input for recording feature usage',
  fields: {
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    sourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sourceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const RecordUsageOutputModel = defineSchemaModel({
  name: 'RecordUsageOutput',
  description: 'Output for recording feature usage',
  fields: {
    recorded: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    currentUsage: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    limitReached: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const UsageRecordedPayloadModel = defineSchemaModel({
  name: 'UsageRecordedPayload',
  description: 'Payload for usage.recorded event',
  fields: {
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const GetUsageSummaryInputModel = defineSchemaModel({
  name: 'GetUsageSummaryInput',
  description: 'Input for getting usage summary',
  fields: {
    billingPeriod: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const GetUsageSummaryOutputModel = defineSchemaModel({
  name: 'GetUsageSummaryOutput',
  description: 'Output for usage summary',
  fields: {
    billingPeriod: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    usage: { type: UsageSummaryModel, isArray: true, isOptional: false },
  },
});

export const CheckFeatureAccessInputModel = defineSchemaModel({
  name: 'CheckFeatureAccessInput',
  description: 'Input for checking feature access',
  fields: {
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const CheckFeatureAccessOutputModel = defineSchemaModel({
  name: 'CheckFeatureAccessOutput',
  description: 'Output for feature access check',
  fields: {
    hasAccess: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    reason: { type: FeatureAccessReasonEnum, isOptional: true },
    upgradeUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
  },
});

// ============ Contracts ============

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
      { name: 'billing.usage.recorded', version: 1, when: 'Usage is recorded', payload: UsageRecordedPayloadModel },
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
