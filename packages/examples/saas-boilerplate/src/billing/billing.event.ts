import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

/**
 * Payload when feature usage is recorded.
 */
const UsageRecordedPayload = defineSchemaModel({
  name: 'UsageRecordedPayload',
  description: 'Payload when feature usage is recorded',
  fields: {
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    billingPeriod: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    recordedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when usage limit is reached.
 */
const UsageLimitReachedPayload = defineSchemaModel({
  name: 'UsageLimitReachedPayload',
  description: 'Payload when usage limit is reached',
  fields: {
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    feature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    currentUsage: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    reachedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when subscription status changes.
 */
const SubscriptionChangedPayload = defineSchemaModel({
  name: 'SubscriptionChangedPayload',
  description: 'Payload when subscription status changes',
  fields: {
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    previousPlan: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    newPlan: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Event: Feature usage has been recorded.
 */
export const UsageRecordedEvent = defineEvent({
  name: 'billing.usage.recorded',
  version: 1,
  description: 'Feature usage has been recorded.',
  payload: UsageRecordedPayload,
});

/**
 * Event: Usage limit has been reached for a feature.
 */
export const UsageLimitReachedEvent = defineEvent({
  name: 'billing.limit.reached',
  version: 1,
  description: 'Usage limit has been reached for a feature.',
  payload: UsageLimitReachedPayload,
});

/**
 * Event: Subscription status has changed.
 */
export const SubscriptionChangedEvent = defineEvent({
  name: 'billing.subscription.changed',
  version: 1,
  description: 'Subscription status has changed.',
  payload: SubscriptionChangedPayload,
});
