import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Store status enum.
 */
export const StoreStatusEnum = defineEntityEnum({
  name: 'StoreStatus',
  values: ['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED'] as const,
  schema: 'marketplace',
  description: 'Status of a store.',
});

/**
 * Store type enum.
 */
export const StoreTypeEnum = defineEntityEnum({
  name: 'StoreType',
  values: ['INDIVIDUAL', 'BUSINESS', 'ENTERPRISE'] as const,
  schema: 'marketplace',
  description: 'Type of store account.',
});

/**
 * Store entity - a seller's storefront on the marketplace.
 */
export const StoreEntity = defineEntity({
  name: 'Store',
  description: 'A seller storefront on the marketplace.',
  schema: 'marketplace',
  map: 'store',
  fields: {
    id: field.id({ description: 'Unique store ID' }),

    // Identity
    name: field.string({ description: 'Store display name' }),
    slug: field.string({ description: 'URL-friendly identifier' }),
    description: field.string({ isOptional: true }),

    // Status
    status: field.enum('StoreStatus', { default: 'PENDING' }),
    type: field.enum('StoreType', { default: 'INDIVIDUAL' }),

    // Owner
    ownerId: field.foreignKey({ description: 'Store owner user ID' }),
    organizationId: field.foreignKey({ isOptional: true }),

    // Branding
    logoFileId: field.string({
      isOptional: true,
      description: 'Logo file reference',
    }),
    bannerFileId: field.string({
      isOptional: true,
      description: 'Banner file reference',
    }),

    // Contact
    email: field.string({ isOptional: true }),
    phone: field.string({ isOptional: true }),
    website: field.string({ isOptional: true }),

    // Location
    country: field.string({ isOptional: true }),
    currency: field.string({ default: '"USD"' }),
    timezone: field.string({ isOptional: true }),

    // Commission
    commissionRate: field.decimal({
      default: 0.1,
      description: 'Platform commission rate (e.g., 0.1 = 10%)',
    }),

    // Verification
    isVerified: field.boolean({ default: false }),
    verifiedAt: field.dateTime({ isOptional: true }),

    // Settings
    settings: field.json({ isOptional: true }),
    metadata: field.json({ isOptional: true }),

    // Metrics (denormalized for performance)
    totalProducts: field.int({ default: 0 }),
    totalOrders: field.int({ default: 0 }),
    totalRevenue: field.decimal({ default: 0 }),
    averageRating: field.decimal({ default: 0 }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    products: field.hasMany('Product'),
    orders: field.hasMany('Order'),
    payouts: field.hasMany('Payout'),
  },
  indexes: [
    index.unique(['slug']),
    index.on(['ownerId']),
    index.on(['status']),
    index.on(['country', 'status']),
    index.on(['averageRating']),
  ],
  enums: [StoreStatusEnum, StoreTypeEnum],
});

/**
 * Store category entity - categorization for stores.
 */
export const StoreCategoryEntity = defineEntity({
  name: 'StoreCategory',
  description: 'Category assignment for stores.',
  schema: 'marketplace',
  map: 'store_category',
  fields: {
    id: field.id(),
    storeId: field.foreignKey(),
    categoryId: field.foreignKey(),
    isPrimary: field.boolean({ default: false }),
    createdAt: field.createdAt(),

    // Relations
    store: field.belongsTo('Store', ['storeId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.unique(['storeId', 'categoryId']), index.on(['categoryId'])],
});
