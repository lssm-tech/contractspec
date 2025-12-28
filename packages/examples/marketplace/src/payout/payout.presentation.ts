import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { PayoutModel } from './payout.schema';

export const PayoutListPresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.payout.list',
    version: 1,
    title: 'Payout List',
    description: 'List of payouts for sellers',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'payout', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Show sellers their historical and pending payouts.',
    context: 'Financial dashboard for sellers.',
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
    key: 'marketplace.payout.detail',
    version: 1,
    title: 'Payout Details',
    description: 'Payout detail with breakdown',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'payout', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Show the breakdown of a specific payout including fees and orders.',
    context: 'Accessed from the payout list.',
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
