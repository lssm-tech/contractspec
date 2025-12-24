import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { PayoutModel } from './payout.schema';

export const PayoutListPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.payout.list',
    version: 1,
    title: 'Payout List',
    description: 'List of payouts for sellers',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'payout', 'list'],
    stability: StabilityEnum.Experimental,
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

export const PayoutDetailPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.payout.detail',
    version: 1,
    title: 'Payout Details',
    description: 'Payout detail with breakdown',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'payout', 'detail'],
    stability: StabilityEnum.Experimental,
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
