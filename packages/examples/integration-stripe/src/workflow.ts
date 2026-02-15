import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';

export const collectPaymentWorkflow: WorkflowSpec = {
  meta: {
    key: 'artisan.payments.collectPayment',
    version: '1.0.0',
    title: 'Collect Card Payment',
    description:
      'Charge a customer using the tenant Stripe connection and record settlement details.',
    domain: 'payments',
    owners: [OwnersEnum.PlatformCore],
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
          operation: { key: 'payments.prepareCharge', version: '1.0.0' },
        },
      },
      {
        id: 'charge',
        type: 'automation',
        label: 'Charge card via Stripe',
        action: {
          operation: { key: 'payments.stripe.chargeCard', version: '1.0.0' },
        },
      },
      {
        id: 'confirm',
        type: 'automation',
        label: 'Confirm settlement',
        action: {
          operation: { key: 'payments.recordSettlement', version: '1.0.0' },
        },
      },
    ],
    transitions: [
      { from: 'prepare', to: 'charge' },
      { from: 'charge', to: 'confirm', condition: 'output.success === true' },
    ],
  },
};
