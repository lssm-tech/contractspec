/**
 * Marketplace Presentation Descriptors
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import {
  StoreModel,
  ProductModel,
  OrderModel,
  PayoutModel,
  ReviewModel,
} from '../contracts';

// ============ Store Presentations ============

export const StoreProfilePresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.store.profile',
    version: 1,
    description: 'Store profile page with products and reviews',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'store', 'profile'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'StoreProfile',
    props: StoreModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.enabled'],
  },
};

export const SellerDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.seller.dashboard',
    version: 1,
    description: 'Seller dashboard with orders, products, and payouts',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'seller', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SellerDashboard',
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.seller.enabled'],
  },
};

// ============ Product Presentations ============

export const ProductCatalogPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.product.catalog',
    version: 1,
    description: 'Product catalog with filtering and search',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'product', 'catalog'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProductCatalog',
    props: ProductModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.enabled'],
  },
};

export const ProductDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.product.detail',
    version: 1,
    description: 'Product detail page with variants and reviews',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'product', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProductDetail',
    props: ProductModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.enabled'],
  },
};

export const ProductEditorPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.product.editor',
    version: 1,
    description: 'Product creation and editing form',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'product', 'editor'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ProductEditor',
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.seller.enabled'],
  },
};

// ============ Order Presentations ============

export const OrderListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.order.list',
    version: 1,
    description: 'Order list with status and filtering',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'order', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'OrderList',
    props: OrderModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.enabled'],
  },
};

export const OrderDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.order.detail',
    version: 1,
    description: 'Order detail with items, timeline, and actions',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'order', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'OrderDetail',
    props: OrderModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.enabled'],
  },
};

export const CheckoutPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.checkout',
    version: 1,
    description: 'Checkout flow with cart and payment',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'checkout'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'Checkout',
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.enabled'],
  },
};

// ============ Payout Presentations ============

export const PayoutListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.payout.list',
    version: 1,
    description: 'Payout history with status and details',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'payout', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'PayoutList',
    props: PayoutModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.seller.enabled'],
  },
};

export const PayoutDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.payout.detail',
    version: 1,
    description: 'Payout detail with included orders',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'payout', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'PayoutDetail',
    props: PayoutModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.seller.enabled'],
  },
};

// ============ Review Presentations ============

export const ReviewListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.review.list',
    version: 1,
    description: 'Review list with rating distribution',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'review', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewList',
    props: ReviewModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.reviews.enabled'],
  },
};

export const ReviewFormPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.review.form',
    version: 1,
    description: 'Review submission form',
    domain: 'marketplace',
    owners: ['marketplace-team'],
    tags: ['marketplace', 'review', 'form'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewForm',
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.reviews.enabled'],
  },
};

// ============ All Presentations ============

export const MarketplacePresentations = {
  // Store
  StoreProfilePresentation,
  SellerDashboardPresentation,

  // Product
  ProductCatalogPresentation,
  ProductDetailPresentation,
  ProductEditorPresentation,

  // Order
  OrderListPresentation,
  OrderDetailPresentation,
  CheckoutPresentation,

  // Payout
  PayoutListPresentation,
  PayoutDetailPresentation,

  // Review
  ReviewListPresentation,
  ReviewFormPresentation,
};

