/**
 * Marketplace Feature Module Specification
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * Marketplace feature module that bundles multi-vendor marketplace
 * capabilities including stores, products, orders, payouts, and reviews.
 */
export const MarketplaceFeature: FeatureModuleSpec = {
  meta: {
    key: 'marketplace',
    title: 'Multi-Vendor Marketplace',
    description: 'Full-featured marketplace with stores, products, orders, payouts, and reviews',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'ecommerce', 'multi-vendor', 'payments'],
    stability: 'experimental',
  },

  operations: [
    // Store operations
    { name: 'marketplace.store.create', version: 1 },
    
    // Product operations
    { name: 'marketplace.product.create', version: 1 },
    { name: 'marketplace.product.list', version: 1 },
    
    // Order operations
    { name: 'marketplace.order.create', version: 1 },
    { name: 'marketplace.order.updateStatus', version: 1 },
    
    // Payout operations
    { name: 'marketplace.payout.list', version: 1 },
    
    // Review operations
    { name: 'marketplace.review.create', version: 1 },
    { name: 'marketplace.review.list', version: 1 },
  ],

  events: [
    // Store events
    { name: 'marketplace.store.created', version: 1 },
    { name: 'marketplace.store.statusChanged', version: 1 },
    
    // Product events
    { name: 'marketplace.product.created', version: 1 },
    { name: 'marketplace.product.published', version: 1 },
    { name: 'marketplace.inventory.updated', version: 1 },
    
    // Order events
    { name: 'marketplace.order.created', version: 1 },
    { name: 'marketplace.order.paid', version: 1 },
    { name: 'marketplace.order.statusUpdated', version: 1 },
    { name: 'marketplace.order.shipped', version: 1 },
    { name: 'marketplace.order.completed', version: 1 },
    
    // Payout events
    { name: 'marketplace.payout.created', version: 1 },
    { name: 'marketplace.payout.paid', version: 1 },
    
    // Review events
    { name: 'marketplace.review.created', version: 1 },
    { name: 'marketplace.review.responded', version: 1 },
  ],

  presentations: [
    // Store
    { name: 'marketplace.store.profile', version: 1 },
    { name: 'marketplace.seller.dashboard', version: 1 },
    
    // Product
    { name: 'marketplace.product.catalog', version: 1 },
    { name: 'marketplace.product.detail', version: 1 },
    { name: 'marketplace.product.editor', version: 1 },
    
    // Order
    { name: 'marketplace.order.list', version: 1 },
    { name: 'marketplace.order.detail', version: 1 },
    { name: 'marketplace.checkout', version: 1 },
    
    // Payout
    { name: 'marketplace.payout.list', version: 1 },
    { name: 'marketplace.payout.detail', version: 1 },
    
    // Review
    { name: 'marketplace.review.list', version: 1 },
    { name: 'marketplace.review.form', version: 1 },
  ],

  opToPresentation: [
    { op: { name: 'marketplace.product.list', version: 1 }, pres: { name: 'marketplace.product.catalog', version: 1 } },
    { op: { name: 'marketplace.order.create', version: 1 }, pres: { name: 'marketplace.checkout', version: 1 } },
    { op: { name: 'marketplace.payout.list', version: 1 }, pres: { name: 'marketplace.payout.list', version: 1 } },
    { op: { name: 'marketplace.review.list', version: 1 }, pres: { name: 'marketplace.review.list', version: 1 } },
    { op: { name: 'marketplace.review.create', version: 1 }, pres: { name: 'marketplace.review.form', version: 1 } },
  ],

  presentationsTargets: [
    { name: 'marketplace.store.profile', version: 1, targets: ['react', 'markdown'] },
    { name: 'marketplace.seller.dashboard', version: 1, targets: ['react'] },
    { name: 'marketplace.product.catalog', version: 1, targets: ['react', 'markdown'] },
    { name: 'marketplace.product.detail', version: 1, targets: ['react', 'markdown'] },
    { name: 'marketplace.product.editor', version: 1, targets: ['react'] },
    { name: 'marketplace.order.list', version: 1, targets: ['react', 'markdown'] },
    { name: 'marketplace.order.detail', version: 1, targets: ['react', 'markdown'] },
    { name: 'marketplace.checkout', version: 1, targets: ['react'] },
    { name: 'marketplace.payout.list', version: 1, targets: ['react', 'markdown'] },
    { name: 'marketplace.review.list', version: 1, targets: ['react', 'markdown'] },
  ],

  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'files', version: 1 },
      { key: 'metering', version: 1 },
    ],
    provides: [
      { key: 'marketplace', version: 1 },
      { key: 'ecommerce', version: 1 },
      { key: 'payments', version: 1 },
    ],
  },
};

