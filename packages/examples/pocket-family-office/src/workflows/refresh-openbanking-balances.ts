import type { WorkflowSpec } from '@contractspec/lib.contracts/workflow/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts/ownership';

const BALANCE_CAPABILITY = { key: 'openbanking.balances.read', version: 1 };

export const refreshOpenBankingBalancesWorkflow: WorkflowSpec = {
  meta: {
    key: 'pfo.workflow.refresh-openbanking-balances',
    version: 1,
    title: 'Refresh Open Banking Balances',
    description:
      'Refreshes balances for synced accounts to surface the latest cash positions in dashboards.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['open-banking', 'powens', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  definition: {
    entryStepId: 'refresh-balances',
    steps: [
      {
        id: 'refresh-balances',
        type: 'automation',
        label: 'Refresh Balances',
        description:
          'Trigger the Powens provider to obtain current and available balances.',
        action: {
          operation: { key: 'openbanking.balances.refresh', version: 1 },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: [BALANCE_CAPABILITY],
        retry: {
          maxAttempts: 3,
          backoff: 'exponential',
          delayMs: 1_000,
        },
      },
      {
        id: 'fetch-balances',
        type: 'automation',
        label: 'Fetch Balances',
        description:
          'Load the canonical balance snapshots for downstream workflows and dashboards.',
        action: {
          operation: { key: 'openbanking.balances.get', version: 1 },
        },
        requiredIntegrations: ['primaryOpenBanking'],
        requiredCapabilities: [BALANCE_CAPABILITY],
        retry: {
          maxAttempts: 2,
          backoff: 'linear',
          delayMs: 750,
        },
      },
    ],
    transitions: [{ from: 'refresh-balances', to: 'fetch-balances' }],
  },
};
