import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import {
  type AnyOperationSpec,
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts-spec/operations';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import { BankAccountRecord } from '../models';
import { OPENBANKING_TELEMETRY_EVENTS } from '../telemetry';

const OpenBankingListAccountsInput = new SchemaModel({
  name: 'OpenBankingListAccountsInput',
  description:
    'Parameters for listing bank accounts through the open banking provider.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    includeBalances: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    institutionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    pageSize: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const OpenBankingListAccountsOutput = new SchemaModel({
  name: 'OpenBankingListAccountsOutput',
  description:
    'Paginated list of bank accounts available to the tenant and user.',
  fields: {
    accounts: {
      type: BankAccountRecord,
      isOptional: false,
      isArray: true,
    },
    nextCursor: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const OpenBankingGetAccountInput = new SchemaModel({
  name: 'OpenBankingGetAccountInput',
  description: 'Parameters for retrieving a specific bank account.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    includeBalances: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    includeLatestTransactions: {
      type: ScalarTypeEnum.Boolean(),
      isOptional: true,
    },
  },
});

const OpenBankingSyncAccountsInput = new SchemaModel({
  name: 'OpenBankingSyncAccountsInput',
  description:
    'Command payload to trigger an account synchronisation against the open banking provider.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountIds: {
      type: ScalarTypeEnum.ID(),
      isArray: true,
      isOptional: true,
    },
    forceFullRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    triggerWorkflows: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const OpenBankingSyncAccountsOutput = new SchemaModel({
  name: 'OpenBankingSyncAccountsOutput',
  description: 'Result of a bank account synchronisation run.',
  fields: {
    synced: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    failed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    nextSyncSuggestedAt: {
      type: ScalarTypeEnum.DateTime(),
      isOptional: true,
    },
  },
});

export const OpenBankingListAccounts = defineQuery({
  meta: {
    key: 'openbanking.accounts.list',
    version: '1.0.0',
    description:
      'List bank accounts available to a tenant/user via Powens Open Banking.',
    goal: 'Provide downstream workflows with the set of accounts accessible via the configured open banking connection.',
    context:
      'Used by Pocket Family Office dashboards and sync workflows to enumerate bank accounts prior to syncing balances or transactions.',
    owners: ['@platform.finance'],
    tags: ['open-banking', 'powens', 'accounts'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingListAccountsInput,
    output: OpenBankingListAccountsOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const OpenBankingGetAccount = defineQuery({
  meta: {
    key: 'openbanking.accounts.get',
    version: '1.0.0',
    description:
      'Retrieve the canonical bank account record for the given account identifier.',
    goal: 'Allow user-facing experiences and automations to display up-to-date account metadata.',
    context:
      'Invoked by UI surfaces and workflow automation steps that require detailed metadata for a specific bank account.',
    owners: ['@platform.finance'],
    tags: ['open-banking', 'powens', 'accounts'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingGetAccountInput,
    output: BankAccountRecord,
  },
  policy: {
    auth: 'user',
  },
});

export const OpenBankingSyncAccounts = defineCommand({
  meta: {
    key: 'openbanking.accounts.sync',
    version: '1.0.0',
    description:
      'Initiate a synchronisation run to refresh bank account metadata from Powens.',
    goal: 'Keep canonical bank account records aligned with the external open banking provider.',
    context:
      'Triggered by scheduled workflows or manual operator actions to reconcile account metadata prior to transaction/balance syncs.',
    owners: ['@platform.finance'],
    tags: ['open-banking', 'powens', 'accounts'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingSyncAccountsInput,
    output: OpenBankingSyncAccountsOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { key: OPENBANKING_TELEMETRY_EVENTS.accountsSynced },
      properties: ({ input, output }) => {
        const payload = input as {
          tenantId?: string;
          connectionId?: string;
        };
        const result = output as {
          synced?: number;
          failed?: number;
        } | null;
        return {
          tenantId: payload?.tenantId,
          connectionId: payload?.connectionId,
          synced: result?.synced,
          failed: result?.failed,
        };
      },
    },
    failure: {
      event: { key: OPENBANKING_TELEMETRY_EVENTS.accountsSyncFailed },
      properties: ({ input, error }) => {
        const payload = input as {
          tenantId?: string;
          connectionId?: string;
        };
        return {
          tenantId: payload?.tenantId,
          connectionId: payload?.connectionId,
          error:
            error instanceof Error ? error.message : String(error ?? 'unknown'),
        };
      },
    },
  },
});

export const openBankingAccountContracts: Record<string, AnyOperationSpec> = {
  OpenBankingListAccounts,
  OpenBankingGetAccount,
  OpenBankingSyncAccounts,
};

export function registerOpenBankingAccountContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registry
    .register(OpenBankingListAccounts)
    .register(OpenBankingGetAccount)
    .register(OpenBankingSyncAccounts);
}
