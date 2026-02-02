/**
 * Marketplace Feature Module Specification
 */
import { defineFeature } from '@contractspec/lib.contracts';

/**
 * Marketplace feature module that bundles multi-vendor marketplace
 * capabilities including stores, products, orders, payouts, and reviews.
 */
export const MarketplaceFeature = defineFeature({
  meta: {
    key: 'marketplace',
    version: '1.0.0',
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
    { key: 'marketplace.store.create', version: '1.0.0' },

    // Product operations
    { key: 'marketplace.product.create', version: '1.0.0' },
    { key: 'marketplace.product.list', version: '1.0.0' },

    // Order operations
    { key: 'marketplace.order.create', version: '1.0.0' },
    { key: 'marketplace.order.updateStatus', version: '1.0.0' },

    // Payout operations
    { key: 'marketplace.payout.list', version: '1.0.0' },

    // Review operations
    { key: 'marketplace.review.create', version: '1.0.0' },
    { key: 'marketplace.review.list', version: '1.0.0' },
  ],

  events: [
    // Store events
    { key: 'marketplace.store.created', version: '1.0.0' },
    { key: 'marketplace.store.statusChanged', version: '1.0.0' },

    // Product events
    { key: 'marketplace.product.created', version: '1.0.0' },
    { key: 'marketplace.product.published', version: '1.0.0' },
    { key: 'marketplace.inventory.updated', version: '1.0.0' },

    // Order events
    { key: 'marketplace.order.created', version: '1.0.0' },
    { key: 'marketplace.order.paid', version: '1.0.0' },
    { key: 'marketplace.order.statusUpdated', version: '1.0.0' },
    { key: 'marketplace.order.shipped', version: '1.0.0' },
    { key: 'marketplace.order.completed', version: '1.0.0' },

    // Payout events
    { key: 'marketplace.payout.created', version: '1.0.0' },
    { key: 'marketplace.payout.paid', version: '1.0.0' },

    // Review events
    { key: 'marketplace.review.created', version: '1.0.0' },
    { key: 'marketplace.review.responded', version: '1.0.0' },
  ],

  presentations: [
    // Store
    { key: 'marketplace.store.profile', version: '1.0.0' },
    { key: 'marketplace.seller.dashboard', version: '1.0.0' },

    // Product
    { key: 'marketplace.product.catalog', version: '1.0.0' },
    { key: 'marketplace.product.detail', version: '1.0.0' },
    { key: 'marketplace.product.editor', version: '1.0.0' },

    // Order
    { key: 'marketplace.order.list', version: '1.0.0' },
    { key: 'marketplace.order.detail', version: '1.0.0' },
    { key: 'marketplace.checkout', version: '1.0.0' },

    // Payout
    { key: 'marketplace.payout.viewList', version: '1.0.0' },
    { key: 'marketplace.payout.detail', version: '1.0.0' },

    // Review
    { key: 'marketplace.review.viewList', version: '1.0.0' },
    { key: 'marketplace.review.form', version: '1.0.0' },
  ],

  opToPresentation: [
    {
      op: { key: 'marketplace.product.list', version: '1.0.0' },
      pres: { key: 'marketplace.product.catalog', version: '1.0.0' },
    },
    {
      op: { key: 'marketplace.order.create', version: '1.0.0' },
      pres: { key: 'marketplace.checkout', version: '1.0.0' },
    },
    {
      op: { key: 'marketplace.payout.list', version: '1.0.0' },
      pres: { key: 'marketplace.payout.viewList', version: '1.0.0' },
    },
    {
      op: { key: 'marketplace.review.list', version: '1.0.0' },
      pres: { key: 'marketplace.review.viewList', version: '1.0.0' },
    },
    {
      op: { key: 'marketplace.review.create', version: '1.0.0' },
      pres: { key: 'marketplace.review.form', version: '1.0.0' },
    },
  ],

  presentationsTargets: [
    {
      key: 'marketplace.store.profile',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.seller.dashboard',
      version: '1.0.0',
      targets: ['react'],
    },
    {
      key: 'marketplace.product.catalog',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.product.detail',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    { key: 'marketplace.product.editor', version: '1.0.0', targets: ['react'] },
    {
      key: 'marketplace.order.list',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.order.detail',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    { key: 'marketplace.checkout', version: '1.0.0', targets: ['react'] },
    {
      key: 'marketplace.payout.viewList',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'marketplace.review.viewList',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
  ],

  capabilities: {
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'audit-trail', version: '1.0.0' },
      { key: 'notifications', version: '1.0.0' },
      { key: 'files', version: '1.0.0' },
      { key: 'metering', version: '1.0.0' },
    ],
    provides: [
      { key: 'marketplace', version: '1.0.0' },
      { key: 'ecommerce', version: '1.0.0' },
      { key: 'payments', version: '1.0.0' },
    ],
  },
});
