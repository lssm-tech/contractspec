import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { PayoutModel } from './payout.schema';

export const PayoutListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.payout.list',
    version: 1,
    description: 'List of payouts for sellers',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
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
    flags: ['marketplace.payouts.enabled'],
  },
};

export const PayoutDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'marketplace.payout.detail',
    version: 1,
    description: 'Payout detail with breakdown',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
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
    flags: ['marketplace.payouts.enabled'],
  },
};

