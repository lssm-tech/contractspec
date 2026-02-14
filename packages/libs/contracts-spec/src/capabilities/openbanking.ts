import type { CapabilityRegistry, CapabilitySpec } from '../capabilities';
import { StabilityEnum } from '../ownership';

const OWNERS = ['platform.finance'] as const;
const TAGS = ['open-banking', 'finance'] as const;

export const openBankingAccountsReadCapability: CapabilitySpec = {
  meta: {
    key: 'openbanking.accounts.read',
    version: '1.0.0',
    kind: 'integration',
    title: 'Open Banking Accounts (Read)',
    description:
      'Provides read-only access to linked bank accounts, including account summaries and metadata.',
    domain: 'finance',
    owners: [...OWNERS],
    tags: [...TAGS],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'openbanking.accounts.list',
      version: '1.0.0',
      description:
        'List bank accounts linked to a Powens open banking connection.',
    },
    {
      surface: 'operation',
      key: 'openbanking.accounts.get',
      version: '1.0.0',
      description:
        'Retrieve the canonical bank account record for a specific account.',
    },
    {
      surface: 'operation',
      key: 'openbanking.accounts.sync',
      version: '1.0.0',
      description:
        'Trigger a refresh of bank account metadata from the open banking provider.',
    },
  ],
};

export const openBankingTransactionsReadCapability: CapabilitySpec = {
  meta: {
    key: 'openbanking.transactions.read',
    version: '1.0.0',
    kind: 'integration',
    title: 'Open Banking Transactions (Read)',
    description:
      'Enables retrieval of transaction history for linked bank accounts via open banking providers.',
    domain: 'finance',
    owners: [...OWNERS],
    tags: [...TAGS, 'transactions'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'openbanking.transactions.list',
      version: '1.0.0',
      description:
        'List transactions for a given bank account with optional date filtering.',
    },
    {
      surface: 'operation',
      key: 'openbanking.transactions.sync',
      version: '1.0.0',
      description:
        'Synchronise transactions from the open banking provider into the canonical ledger.',
    },
  ],
};

export const openBankingBalancesReadCapability: CapabilitySpec = {
  meta: {
    key: 'openbanking.balances.read',
    version: '1.0.0',
    kind: 'integration',
    title: 'Open Banking Balances (Read)',
    description:
      'Allows querying of current and available balances for linked bank accounts via open banking providers.',
    domain: 'finance',
    owners: [...OWNERS],
    tags: [...TAGS, 'balances'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'openbanking.balances.get',
      version: '1.0.0',
      description:
        'Retrieve the latest known balances for a specified bank account.',
    },
    {
      surface: 'operation',
      key: 'openbanking.balances.refresh',
      version: '1.0.0',
      description: 'Force a balance refresh from the open banking provider.',
    },
  ],
};

export function registerOpenBankingCapabilities(
  registry: CapabilityRegistry
): CapabilityRegistry {
  return registry
    .register(openBankingAccountsReadCapability)
    .register(openBankingTransactionsReadCapability)
    .register(openBankingBalancesReadCapability);
}
