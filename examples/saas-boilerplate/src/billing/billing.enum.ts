import { defineEnum } from '@contractspec/lib.schema';

/**
 * Subscription status enum for contract schemas.
 * Note: Entity enum is defined separately in billing.entity.ts
 */
export const SubscriptionStatusSchemaEnum = defineEnum('SubscriptionStatus', [
  'TRIALING',
  'ACTIVE',
  'PAST_DUE',
  'CANCELED',
  'PAUSED',
]);

/**
 * Feature access reason enum.
 */
export const FeatureAccessReasonEnum = defineEnum('FeatureAccessReason', [
  'included',
  'limit_available',
  'limit_reached',
  'not_in_plan',
]);
