import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
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
    goal: 'Showcase a seller store with its products and reputation.',
    context: 'The public landing page for a marketplace seller.',
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
    goal: 'Provide sellers with an overview of their business performance.',
    context: 'The primary workspace for store owners.',
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
