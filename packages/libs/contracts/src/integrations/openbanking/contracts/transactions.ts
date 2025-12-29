import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  type AnyOperationSpec,
  defineCommand,
  defineQuery,
} from '../../../operations';
import type { OperationSpecRegistry } from '../../../operations/registry';
import { BankTransactionRecord } from '../models';
import { OPENBANKING_TELEMETRY_EVENTS } from '../telemetry';

const OpenBankingListTransactionsInput = new SchemaModel({
  name: 'OpenBankingListTransactionsInput',
  description:
    'Parameters for listing bank transactions from the canonical ledger.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    pageSize: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    direction: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    minimumAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    maximumAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const OpenBankingListTransactionsOutput = new SchemaModel({
  name: 'OpenBankingListTransactionsOutput',
  description: 'Paginated list of transactions for a bank account.',
  fields: {
    transactions: {
      type: BankTransactionRecord,
      isOptional: false,
      isArray: true,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const OpenBankingSyncTransactionsInput = new SchemaModel({
  name: 'OpenBankingSyncTransactionsInput',
  description:
    'Command payload to synchronise transactions from the open banking provider into the canonical ledger.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    includePending: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    backfillDays: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const OpenBankingSyncTransactionsOutput = new SchemaModel({
  name: 'OpenBankingSyncTransactionsOutput',
  description: 'Result of a transaction synchronisation run.',
  fields: {
    synced: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    failed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    earliestSyncedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    latestSyncedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    nextSinceToken: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const OpenBankingListTransactions = defineQuery({
  meta: {
    key: 'openbanking.transactions.list',
    version: '1.0.0',
    description:
      'List bank transactions that have been normalised into the canonical ledger.',
    goal: 'Allow downstream analytics and UI surfaces to page through canonical bank transactions.',
    context:
      'Used by Pocket Family Office dashboards, reconciliation workflows, and analytics data views.',
    owners: ['@platform.finance'],
    tags: ['open-banking', 'powens', 'transactions'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingListTransactionsInput,
    output: OpenBankingListTransactionsOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const OpenBankingSyncTransactions = defineCommand({
  meta: {
    key: 'openbanking.transactions.sync',
    version: '1.0.0',
    description:
      'Synchronise transactions for a bank account by calling the configured open banking provider.',
    goal: 'Ensure the canonical transaction ledger stays aligned with the external provider.',
    context:
      'Triggered by scheduled workflows or on-demand actions when activity is expected on an account.',
    owners: ['@platform.finance'],
    tags: ['open-banking', 'powens', 'transactions'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingSyncTransactionsInput,
    output: OpenBankingSyncTransactionsOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: OPENBANKING_TELEMETRY_EVENTS.transactionsSynced },
      properties: ({ input, output }) => {
        const payload = input as {
          tenantId?: string;
          accountId?: string;
        };
        const result = output as {
          synced?: number;
          failed?: number;
          earliestSyncedAt?: string;
          latestSyncedAt?: string;
        } | null;
        return {
          tenantId: payload?.tenantId,
          accountId: payload?.accountId,
          synced: result?.synced,
          failed: result?.failed,
          earliestSyncedAt: result?.earliestSyncedAt,
          latestSyncedAt: result?.latestSyncedAt,
        };
      },
    },
    failure: {
      event: { key: OPENBANKING_TELEMETRY_EVENTS.transactionsSyncFailed },
      properties: ({ input, error }) => {
        const payload = input as {
          tenantId?: string;
          accountId?: string;
        };
        return {
          tenantId: payload?.tenantId,
          accountId: payload?.accountId,
          error:
            error instanceof Error ? error.message : String(error ?? 'unknown'),
        };
      },
    },
  },
});

export const openBankingTransactionContracts: Record<string, AnyOperationSpec> =
  {
    OpenBankingListTransactions,
    OpenBankingSyncTransactions,
  };

export function registerOpenBankingTransactionContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry
    .register(OpenBankingListTransactions)
    .register(OpenBankingSyncTransactions);
}
