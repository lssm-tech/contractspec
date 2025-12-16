import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import {
  SubscriptionStatusSchemaEnum,
  FeatureAccessReasonEnum,
} from './billing.enum';

/**
 * Organization subscription details schema.
 */
export const SubscriptionModel = defineSchemaModel({
  name: 'Subscription',
  description: 'Organization subscription details',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    planId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    planName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: SubscriptionStatusSchemaEnum, isOptional: false },
    currentPeriodStart: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    currentPeriodEnd: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    trialEndsAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cancelAtPeriodEnd: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

/**
 * Usage summary for a feature schema.
 */
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

/**
 * Input for recording feature usage.
 */
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

/**
 * Output for recording feature usage.
 */
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

/**
 * Payload for usage.recorded event.
 */
export const UsageRecordedPayloadModel = defineSchemaModel({
  name: 'UsageRecordedPayload',
  description: 'Payload for usage.recorded event',
  fields: {
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

/**
 * Input for getting usage summary.
 */
export const GetUsageSummaryInputModel = defineSchemaModel({
  name: 'GetUsageSummaryInput',
  description: 'Input for getting usage summary',
  fields: {
    billingPeriod: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Output for usage summary.
 */
export const GetUsageSummaryOutputModel = defineSchemaModel({
  name: 'GetUsageSummaryOutput',
  description: 'Output for usage summary',
  fields: {
    billingPeriod: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    usage: { type: UsageSummaryModel, isArray: true, isOptional: false },
  },
});

/**
 * Input for checking feature access.
 */
export const CheckFeatureAccessInputModel = defineSchemaModel({
  name: 'CheckFeatureAccessInput',
  description: 'Input for checking feature access',
  fields: {
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Output for feature access check.
 */
export const CheckFeatureAccessOutputModel = defineSchemaModel({
  name: 'CheckFeatureAccessOutput',
  description: 'Output for feature access check',
  fields: {
    hasAccess: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    reason: { type: FeatureAccessReasonEnum, isOptional: true },
    upgradeUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
  },
});
