import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';

export const collectPaymentWorkflow: WorkflowSpec = {
  meta: {
    name: 'artisan.payments.collectPayment',
    version: 1,
    title: 'Collect Card Payment',
    description:
      'Charge a customer using the tenant Stripe connection and record settlement details.',
    domain: 'payments',
    owners: [OwnersEnum.ProductArtisanos],
    tags: [TagsEnum.Marketplace, 'stripe'],
    stability: StabilityEnum.Experimental,
  },
  definition: {
    entryStepId: 'prepare',
    steps: [
      {
        id: 'prepare',
        type: 'automation',
        label: 'Prepare charge parameters',
        action: {
          operation: { name: 'payments.prepareCharge', version: 1 },
        },
      },
      {
        id: 'charge',
        type: 'automation',
        label: 'Charge card via Stripe',
        action: {
          operation: { name: 'payments.stripe.chargeCard', version: 1 },
        },
      },
      {
        id: 'confirm',
        type: 'automation',
        label: 'Confirm settlement',
        action: {
          operation: { name: 'payments.recordSettlement', version: 1 },
        },
      },
    ],
    transitions: [
      { from: 'prepare', to: 'charge' },
      { from: 'charge', to: 'confirm', condition: 'output.success === true' },
    ],
  },
};
