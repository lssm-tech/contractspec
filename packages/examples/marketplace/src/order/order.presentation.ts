import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { OrderModel } from './order.schema';

export const OrderListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.order.list',
    version: 1,
    description: 'List of orders with status and tracking',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
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
    flags: ['marketplace.orders.enabled'],
  },
};

export const OrderDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.order.detail',
    version: 1,
    description: 'Order detail with items and shipping info',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
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
    flags: ['marketplace.orders.enabled'],
  },
};

export const CheckoutPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.checkout',
    version: 1,
    description: 'Checkout flow with cart and payment',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'checkout', 'cart'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'Checkout',
    props: OrderModel,
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.checkout.enabled'],
  },
};

