import { defineWorkflow } from '@contractspec/lib.contracts/workflow';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts';

const ACCOUNT_CAPABILITY = {
  key: 'openbanking.accounts.read',
  version: '1.0.0',
};

export const syncOpenBankingAccountsWorkflow = defineWorkflow({
  meta: {
    key: 'pfo.workflow.sync-openbanking-accounts',
    version: '1.0.0',
    title: 'Synchronise Open Banking Accounts',
    description:
      'Validates Powens connectivity and synchronises bank account metadata into the canonical ledger.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['open-banking', 'powens', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  definition: {
    entryStepId: 'sync-accounts',
    steps: [
      {
        id: 'sync-accounts',
        type: 'automation',
        label: 'Sync Accounts',
        description:
          'Refresh linked bank accounts via Powens and upsert canonical BankAccount records.',
        action: {
          operation: { key: 'openbanking.accounts.sync', version: '1.0.0' },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: [ACCOUNT_CAPABILITY],
        retry: {
          maxAttempts: 3,
          backoff: 'exponential',
          delayMs: 1_000,
        },
      },
      {
        id: 'fetch-accounts',
        type: 'automation',
        label: 'Fetch Accounts',
        description:
          'Retrieve the latest canonical account snapshot for downstream consumers.',
        action: {
          operation: { key: 'openbanking.accounts.list', version: '1.0.0' },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: [ACCOUNT_CAPABILITY],
        retry: {
          maxAttempts: 2,
          backoff: 'linear',
          delayMs: 750,
        },
      },
    ],
    transitions: [{ from: 'sync-accounts', to: 'fetch-accounts' }],
  },
});
