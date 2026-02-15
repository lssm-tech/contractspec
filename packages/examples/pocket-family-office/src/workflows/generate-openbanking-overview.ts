import { defineWorkflow } from '@contractspec/lib.contracts-spec/workflow';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts-spec';

const OPEN_BANKING_CAPABILITIES = [
  { key: 'openbanking.accounts.read', version: '1.0.0' },
  { key: 'openbanking.transactions.read', version: '1.0.0' },
  { key: 'openbanking.balances.read', version: '1.0.0' },
];

export const generateOpenBankingOverviewWorkflow = defineWorkflow({
  meta: {
    key: 'pfo.workflow.generate-openbanking-overview',
    version: '1.0.0',
    title: 'Generate Open Banking Overview',
    description:
      'Produces a derived financial overview and stores it in the operational knowledge space.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['open-banking', 'summary', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  definition: {
    entryStepId: 'generate-overview',
    steps: [
      {
        id: 'generate-overview',
        type: 'automation',
        label: 'Generate Overview',
        description:
          'Aggregate balances, cashflow, and category breakdowns into a knowledge entry.',
        action: {
          operation: {
            key: 'pfo.openbanking.generate-overview',
            version: '1.0.0',
          },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: OPEN_BANKING_CAPABILITIES,
        retry: {
          maxAttempts: 3,
          backoff: 'exponential',
          delayMs: 1_500,
        },
      },
    ],
    transitions: [],
  },
});
