/**
 * Marketplace Feature Module Specification
 */
import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

/**
 * Marketplace feature module that bundles multi-vendor marketplace
 * capabilities including stores, products, orders, payouts, and reviews.
 */
export const MarketplaceFeature: FeatureModuleSpec = {
  meta: {
    key: 'marketplace',
    version: 1,
    title: 'Multi-Vendor Marketplace',
    description:
      'Full-featured marketplace with stores, products, orders, payouts, and reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'ecommerce', 'multi-vendor', 'payments'],
    stability: 'experimental',
  },

  operations: [
    // Store operations
    { key: 'marketplace.store.create', version: 1 },

    // Product operations
    { key: 'marketplace.product.create', version: 1 },
    { key: 'marketplace.product.list', version: 1 },

    // Order operations
    { key: 'marketplace.order.create', version: 1 },
    { key: 'marketplace.order.updateStatus', version: 1 },

    // Payout operations
    { key: 'marketplace.payout.list', version: 1 },

    // Review operations
    { key: 'marketplace.review.create', version: 1 },
    { key: 'marketplace.review.list', version: 1 },
  ],

  events: [
    // Store events
    { key: 'marketplace.store.created', version: 1 },
    { key: 'marketplace.store.statusChanged', version: 1 },

    // Product events
    { key: 'marketplace.product.created', version: 1 },
    { key: 'marketplace.product.published', version: 1 },
    { key: 'marketplace.inventory.updated', version: 1 },

    // Order events
    { key: 'marketplace.order.created', version: 1 },
    { key: 'marketplace.order.paid', version: 1 },
    { key: 'marketplace.order.statusUpdated', version: 1 },
    { key: 'marketplace.order.shipped', version: 1 },
    { key: 'marketplace.order.completed', version: 1 },

    // Payout events
    { key: 'marketplace.payout.created', version: 1 },
    { key: 'marketplace.payout.paid', version: 1 },

    // Review events
    { key: 'marketplace.review.created', version: 1 },
    { key: 'marketplace.review.responded', version: 1 },
  ],

  presentations: [
    // Store
    { key: 'marketplace.store.profile', version: 1 },
    { key: 'marketplace.seller.dashboard', version: 1 },

    // Product
    { key: 'marketplace.product.catalog', version: 1 },
    { key: 'marketplace.product.detail', version: 1 },
    { key: 'marketplace.product.editor', version: 1 },

    // Order
    { key: 'marketplace.order.list', version: 1 },
    { key: 'marketplace.order.detail', version: 1 },
    { key: 'marketplace.checkout', version: 1 },

    // Payout
    { key: 'marketplace.payout.list', version: 1 },
    { key: 'marketplace.payout.detail', version: 1 },

    // Review
    { key: 'marketplace.review.list', version: 1 },
    { key: 'marketplace.review.form', version: 1 },
  ],

  opToPresentation: [
    {
      op: { key: 'marketplace.product.list', version: 1 },
      pres: { key: 'marketplace.product.catalog', version: 1 },
    },
    {
      op: { key: 'marketplace.order.create', version: 1 },
      pres: { key: 'marketplace.checkout', version: 1 },
    },
    {
      op: { key: 'marketplace.payout.list', version: 1 },
      pres: { key: 'marketplace.payout.list', version: 1 },
    },
    {
      op: { key: 'marketplace.review.list', version: 1 },
      pres: { key: 'marketplace.review.list', version: 1 },
    },
    {
      op: { key: 'marketplace.review.create', version: 1 },
      pres: { key: 'marketplace.review.form', version: 1 },
    },
  ],

  presentationsTargets: [
    {
      key: 'marketplace.store.profile',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'marketplace.seller.dashboard', version: 1, targets: ['react'] },
    {
      key: 'marketplace.product.catalog',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.product.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'marketplace.product.editor', version: 1, targets: ['react'] },
    {
      key: 'marketplace.order.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.order.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'marketplace.checkout', version: 1, targets: ['react'] },
    {
      key: 'marketplace.payout.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.review.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
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
