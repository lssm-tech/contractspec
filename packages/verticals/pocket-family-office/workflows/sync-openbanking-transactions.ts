import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';

const TRANSACTION_CAPABILITY = {
  key: 'openbanking.transactions.read',
  version: 1,
};

export const syncOpenBankingTransactionsWorkflow: WorkflowSpec = {
  meta: {
    name: 'pfo.workflow.sync-openbanking-transactions',
    version: 1,
    title: 'Synchronise Open Banking Transactions',
    description:
      'Fetches recent transactions from Powens for each linked account and stores them in the canonical ledger.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['open-banking', 'powens', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  definition: {
    entryStepId: 'sync-transactions',
    steps: [
      {
        id: 'sync-transactions',
        type: 'automation',
        label: 'Sync Transactions',
        description:
          'Call the Powens provider to pull incremental transactions for active accounts.',
        action: {
          operation: { name: 'openbanking.transactions.sync', version: 1 },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: [TRANSACTION_CAPABILITY],
        retry: {
          maxAttempts: 4,
          backoff: 'exponential',
          delayMs: 1_500,
        },
      },
      {
        id: 'list-transactions',
        type: 'automation',
        label: 'List Transactions',
        description:
          'Retrieve the canonical transaction list for reporting and downstream analytics.',
        action: {
          operation: { name: 'openbanking.transactions.list', version: 1 },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: [TRANSACTION_CAPABILITY],
        retry: {
          maxAttempts: 2,
          backoff: 'linear',
          delayMs: 1_000,
        },
      },
    ],
    transitions: [{ from: 'sync-transactions', to: 'list-transactions' }],
  },
};






