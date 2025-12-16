import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';

const OPEN_BANKING_CAPABILITIES = [
  { key: 'openbanking.accounts.read', version: 1 },
  { key: 'openbanking.transactions.read', version: 1 },
  { key: 'openbanking.balances.read', version: 1 },
];

export const generateOpenBankingOverviewWorkflow: WorkflowSpec = {
  meta: {
    name: 'pfo.workflow.generate-openbanking-overview',
    version: 1,
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
          operation: { name: 'pfo.openbanking.generate-overview', version: 1 },
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
};





