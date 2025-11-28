import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Product status enum.
 */
export const ProductStatusEnum = defineEntityEnum({
  name: 'ProductStatus',
  values: ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED', 'REJECTED'] as const,
  schema: 'marketplace',
  description: 'Status of a product listing.',
});

/**
 * Product type enum.
 */
export const ProductTypeEnum = defineEntityEnum({
  name: 'ProductType',
  values: ['PHYSICAL', 'DIGITAL', 'SERVICE', 'SUBSCRIPTION'] as const,
  schema: 'marketplace',
  description: 'Type of product.',
});

/**
 * Product entity - an item for sale on the marketplace.
 */
export const ProductEntity = defineEntity({
  name: 'Product',
  description: 'A product listing on the marketplace.',
  schema: 'marketplace',
  map: 'product',
  fields: {
    id: field.id({ description: 'Unique product ID' }),
    
    // Store
    storeId: field.foreignKey(),
    
    // Identity
    name: field.string({ description: 'Product name' }),
    slug: field.string({ description: 'URL-friendly identifier' }),
    description: field.string({ isOptional: true }),
    shortDescription: field.string({ isOptional: true }),
    
    // Status
    status: field.enum('ProductStatus', { default: 'DRAFT' }),
    type: field.enum('ProductType', { default: 'PHYSICAL' }),
    
    // Pricing
    price: field.decimal({ description: 'Base price' }),
    compareAtPrice: field.decimal({ isOptional: true, description: 'Original price for showing discounts' }),
    currency: field.string({ default: '"USD"' }),
    
    // Inventory
    sku: field.string({ isOptional: true }),
    barcode: field.string({ isOptional: true }),
    quantity: field.int({ default: 0 }),
    trackInventory: field.boolean({ default: true }),
    allowBackorder: field.boolean({ default: false }),
    lowStockThreshold: field.int({ default: 5 }),
    
    // Physical properties
    weight: field.decimal({ isOptional: true }),
    weightUnit: field.string({ default: '"kg"' }),
    
    // Categories
    categoryId: field.string({ isOptional: true }),
    tags: field.string({ isArray: true }),
    
    // Media (using file attachments)
    primaryImageId: field.string({ isOptional: true }),
    
    // SEO
    seoTitle: field.string({ isOptional: true }),
    seoDescription: field.string({ isOptional: true }),
    
    // Attributes
    attributes: field.json({ isOptional: true, description: 'Custom product attributes' }),
    
    // Reviews
    reviewCount: field.int({ default: 0 }),
    averageRating: field.decimal({ default: 0 }),
    
    // Sales
    totalSold: field.int({ default: 0 }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    publishedAt: field.dateTime({ isOptional: true }),
    
    // Relations
    store: field.belongsTo('Store', ['storeId'], ['id']),
    variants: field.hasMany('ProductVariant'),
    orderItems: field.hasMany('OrderItem'),
    reviews: field.hasMany('Review'),
  },
  indexes: [
    index.on(['storeId', 'slug']).unique(),
    index.on(['storeId', 'status']),
    index.on(['status', 'publishedAt']),
    index.on(['categoryId', 'status']),
    index.on(['averageRating']),
    index.on(['totalSold']),
    index.on(['price']),
  ],
  enums: [ProductStatusEnum, ProductTypeEnum],
});

/**
 * Product variant entity - variations of a product (size, color, etc.).
 */
export const ProductVariantEntity = defineEntity({
  name: 'ProductVariant',
  description: 'A variant of a product with specific options.',
  schema: 'marketplace',
  map: 'product_variant',
  fields: {
    id: field.id(),
    productId: field.foreignKey(),
    
    // Identity
    name: field.string({ description: 'Variant name (e.g., "Large / Blue")' }),
    
    // Options
    options: field.json({ description: 'Variant options (e.g., {size: "L", color: "Blue"})' }),
    
    // Pricing
    price: field.decimal({ description: 'Variant-specific price' }),
    compareAtPrice: field.decimal({ isOptional: true }),
    
    // Inventory
    sku: field.string({ isOptional: true }),
    barcode: field.string({ isOptional: true }),
    quantity: field.int({ default: 0 }),
    
    // Media
    imageId: field.string({ isOptional: true }),
    
    // Status
    isActive: field.boolean({ default: true }),
    
    // Position
    position: field.int({ default: 0 }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    product: field.belongsTo('Product', ['productId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['productId', 'sku']),
    index.on(['productId', 'position']),
    index.on(['barcode']),
  ],
});

/**
 * Category entity - product categorization.
 */
export const CategoryEntity = defineEntity({
  name: 'Category',
  description: 'Product category for organization.',
  schema: 'marketplace',
  map: 'category',
  fields: {
    id: field.id(),
    
    name: field.string(),
    slug: field.string(),
    description: field.string({ isOptional: true }),
    
    // Hierarchy
    parentId: field.string({ isOptional: true }),
    path: field.string({ description: 'Full path for hierarchical queries' }),
    level: field.int({ default: 0 }),
    
    // Display
    position: field.int({ default: 0 }),
    imageId: field.string({ isOptional: true }),
    
    // Status
    isActive: field.boolean({ default: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    parent: field.belongsTo('Category', ['parentId'], ['id']),
    children: field.hasMany('Category'),
  },
  indexes: [
    index.on(['slug']).unique(),
    index.on(['parentId', 'position']),
    index.on(['path']),
    index.on(['isActive']),
  ],
});

