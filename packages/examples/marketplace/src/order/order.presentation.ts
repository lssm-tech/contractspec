import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { OrderModel } from './order.schema';

export const OrderListPresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.order.list',
    version: 1,
    title: 'Order List',
    description: 'List of orders with status and tracking',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide a comprehensive view of all orders for the user.',
    context: 'Used in the buyer and seller dashboards to track order progress.',
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

export const OrderDetailPresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.order.detail',
    version: 1,
    title: 'Order Details',
    description: 'Order detail with items and shipping info',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Display all details of a single order.',
    context:
      'Accessed from the order list to see specific items, shipping, and payment details.',
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

export const CheckoutPresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.checkout',
    version: 1,
    title: 'Checkout',
    description: 'Checkout flow with cart and payment',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'checkout', 'cart'],
    stability: StabilityEnum.Experimental,
    goal: 'Guide the user through the payment and order confirmation process.',
    context: 'The final stage of the purchasing journey.',
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
