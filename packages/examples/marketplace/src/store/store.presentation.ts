import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { StoreModel } from './store.schema';

export const StoreProfilePresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.store.profile',
    version: 1,
    description: 'Public store profile page',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
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
    flags: ['marketplace.stores.enabled'],
  },
};

export const SellerDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.seller.dashboard',
    version: 1,
    description: 'Seller dashboard with sales and analytics',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'seller', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SellerDashboard',
    props: StoreModel,
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.seller.enabled'],
  },
};
