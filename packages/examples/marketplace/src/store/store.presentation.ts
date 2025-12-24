import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { StoreModel } from './store.schema';

export const StoreProfilePresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.store.profile',
    version: 1,
    title: 'Store Profile',
    description: 'Public store profile page',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'store', 'profile'],
    stability: StabilityEnum.Experimental,
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

export const SellerDashboardPresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.seller.dashboard',
    version: 1,
    title: 'Seller Dashboard',
    description: 'Seller dashboard with sales and analytics',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'seller', 'dashboard'],
    stability: StabilityEnum.Experimental,
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
