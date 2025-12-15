import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Subscription status enum for entities.
 */
export const SubscriptionStatusEnum = defineEntityEnum({
  name: 'SubscriptionStatus',
  values: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED'] as const,
  schema: 'saas_app',
  description: 'Status of a subscription.',
});

/**
 * Subscription entity - organization subscription info.
 */
export const SubscriptionEntity = defineEntity({
  name: 'Subscription',
  description: 'Organization subscription/plan information.',
  schema: 'saas_app',
  map: 'subscription',
  fields: {
    id: field.id(),
    organizationId: field.foreignKey({ isUnique: true }),

    // Plan info
    planId: field.string({ description: 'Plan identifier' }),
    planName: field.string({ description: 'Plan display name' }),

    // Status
    status: field.enum('SubscriptionStatus'),

    // Billing cycle
    currentPeriodStart: field.dateTime(),
    currentPeriodEnd: field.dateTime(),

    // Trial
    trialEndsAt: field.dateTime({ isOptional: true }),

    // Cancellation
    cancelAtPeriodEnd: field.boolean({ default: false }),
    canceledAt: field.dateTime({ isOptional: true }),

    // External reference
    stripeSubscriptionId: field.string({ isOptional: true }),
    stripeCustomerId: field.string({ isOptional: true }),

    // Metadata
    metadata: field.json({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  enums: [SubscriptionStatusEnum],
});

/**
 * BillingUsage entity - track feature usage.
 */
export const BillingUsageEntity = defineEntity({
  name: 'BillingUsage',
  description: 'Track usage of metered features.',
  schema: 'saas_app',
  map: 'billing_usage',
  fields: {
    id: field.id(),
    organizationId: field.foreignKey(),

    // Feature
    feature: field.string({
      description: 'Feature being tracked (e.g., "api_calls", "storage_gb")',
    }),

    // Usage
    quantity: field.int({ description: 'Usage quantity' }),
    unit: field.string({
      isOptional: true,
      description: 'Unit of measurement',
    }),

    // Period
    billingPeriod: field.string({
      description: 'Billing period (e.g., "2024-01")',
    }),

    // Aggregation
    recordedAt: field.dateTime({ description: 'When usage was recorded' }),

    // Source
    sourceId: field.string({
      isOptional: true,
      description: 'Source of usage (e.g., request ID)',
    }),
    sourceType: field.string({ isOptional: true }),

    // Metadata
    metadata: field.json({ isOptional: true }),
  },
  indexes: [
    index.on(['organizationId', 'feature', 'billingPeriod']),
    index.on(['organizationId', 'recordedAt']),
  ],
});

/**
 * UsageLimit entity - feature usage limits per plan.
 */
export const UsageLimitEntity = defineEntity({
  name: 'UsageLimit',
  description: 'Usage limits per plan/organization.',
  schema: 'saas_app',
  map: 'usage_limit',
  fields: {
    id: field.id(),

    // Scope
    planId: field.string({
      isOptional: true,
      description: 'Plan this limit applies to',
    }),
    organizationId: field.string({
      isOptional: true,
      description: 'Org-specific override',
    }),

    // Limit
    feature: field.string({ description: 'Feature being limited' }),
    limit: field.int({ description: 'Maximum allowed usage' }),
    resetPeriod: field.string({
      default: '"monthly"',
      description: 'When limit resets',
    }),

    // Soft/hard limit
    isSoftLimit: field.boolean({
      default: false,
      description: 'Whether to warn vs block',
    }),
    overage: field.boolean({
      default: false,
      description: 'Whether overage is allowed',
    }),
    overageRate: field.float({
      isOptional: true,
      description: 'Cost per unit over limit',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [index.unique(['planId', 'feature'])],
});

