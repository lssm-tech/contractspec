import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Payout status enum.
 */
export const PayoutStatusEnum = defineEntityEnum({
  name: 'PayoutStatus',
  values: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED'] as const,
  schema: 'marketplace',
  description: 'Status of a payout.',
});

/**
 * Payout schedule enum.
 */
export const PayoutScheduleEnum = defineEntityEnum({
  name: 'PayoutSchedule',
  values: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'MANUAL'] as const,
  schema: 'marketplace',
  description: 'Payout schedule frequency.',
});

/**
 * Payout entity - payment to seller.
 */
export const PayoutEntity = defineEntity({
  name: 'Payout',
  description: 'A payout to a seller.',
  schema: 'marketplace',
  map: 'payout',
  fields: {
    id: field.id({ description: 'Unique payout ID' }),

    // Store
    storeId: field.foreignKey(),

    // Reference
    payoutNumber: field.string({ description: 'Human-readable payout number' }),

    // Status
    status: field.enum('PayoutStatus', { default: 'PENDING' }),

    // Amount
    grossAmount: field.decimal({ description: 'Total before fees' }),
    platformFees: field.decimal({ description: 'Platform fees deducted' }),
    otherDeductions: field.decimal({ default: 0 }),
    netAmount: field.decimal({ description: 'Final payout amount' }),
    currency: field.string({ default: '"USD"' }),

    // Period
    periodStart: field.dateTime({ description: 'Start of payout period' }),
    periodEnd: field.dateTime({ description: 'End of payout period' }),

    // Payment details
    paymentMethod: field.string({ isOptional: true }),
    paymentReference: field.string({ isOptional: true }),

    // Bank account (snapshot)
    bankAccountId: field.string({ isOptional: true }),
    bankAccountLast4: field.string({ isOptional: true }),

    // Notes
    notes: field.string({ isOptional: true }),
    failureReason: field.string({ isOptional: true }),

    // Stats
    orderCount: field.int({ default: 0 }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    scheduledAt: field.dateTime({ isOptional: true }),
    processedAt: field.dateTime({ isOptional: true }),
    paidAt: field.dateTime({ isOptional: true }),

    // Relations
    store: field.belongsTo('Store', ['storeId'], ['id']),
    items: field.hasMany('PayoutItem'),
  },
  indexes: [
    index.unique(['payoutNumber']),
    index.on(['storeId', 'status']),
    index.on(['status', 'scheduledAt']),
    index.on(['periodStart', 'periodEnd']),
  ],
  enums: [PayoutStatusEnum],
});

/**
 * Payout item entity - orders included in a payout.
 */
export const PayoutItemEntity = defineEntity({
  name: 'PayoutItem',
  description: 'An order included in a payout.',
  schema: 'marketplace',
  map: 'payout_item',
  fields: {
    id: field.id(),
    payoutId: field.foreignKey(),
    orderId: field.foreignKey(),

    // Amounts
    orderTotal: field.decimal(),
    platformFee: field.decimal(),
    netAmount: field.decimal(),

    createdAt: field.createdAt(),

    // Relations
    payout: field.belongsTo('Payout', ['payoutId'], ['id'], {
      onDelete: 'Cascade',
    }),
    order: field.belongsTo('Order', ['orderId'], ['id']),
  },
  indexes: [index.on(['payoutId']), index.on(['orderId'])],
});

/**
 * Bank account entity - seller payment destinations.
 */
export const BankAccountEntity = defineEntity({
  name: 'BankAccount',
  description: 'A bank account for receiving payouts.',
  schema: 'marketplace',
  map: 'bank_account',
  fields: {
    id: field.id(),
    storeId: field.foreignKey(),

    // Account info
    accountHolderName: field.string(),
    accountType: field.string({ default: '"CHECKING"' }),
    bankName: field.string({ isOptional: true }),

    // Masked details
    last4: field.string({ description: 'Last 4 digits of account' }),
    routingLast4: field.string({ isOptional: true }),

    // Provider reference
    externalId: field.string({
      isOptional: true,
      description: 'External provider account ID',
    }),

    // Status
    isDefault: field.boolean({ default: false }),
    isVerified: field.boolean({ default: false }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    verifiedAt: field.dateTime({ isOptional: true }),

    // Relations
    store: field.belongsTo('Store', ['storeId'], ['id']),
  },
  indexes: [index.on(['storeId', 'isDefault']), index.on(['externalId'])],
});

/**
 * Payout settings entity - store payout configuration.
 */
export const PayoutSettingsEntity = defineEntity({
  name: 'PayoutSettings',
  description: 'Payout configuration for a store.',
  schema: 'marketplace',
  map: 'payout_settings',
  fields: {
    id: field.id(),
    storeId: field.foreignKey(),

    // Schedule
    schedule: field.enum('PayoutSchedule', { default: 'WEEKLY' }),
    dayOfWeek: field.int({
      isOptional: true,
      description: 'Day for weekly/biweekly (0=Sunday)',
    }),
    dayOfMonth: field.int({
      isOptional: true,
      description: 'Day for monthly (1-28)',
    }),

    // Thresholds
    minimumPayout: field.decimal({
      default: 50,
      description: 'Minimum amount for payout',
    }),

    // Default account
    defaultBankAccountId: field.string({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    store: field.belongsTo('Store', ['storeId'], ['id']),
  },
  indexes: [index.unique(['storeId'])],
  enums: [PayoutScheduleEnum],
});
