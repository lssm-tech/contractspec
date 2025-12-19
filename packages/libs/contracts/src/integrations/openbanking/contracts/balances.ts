import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
import {
  defineCommand,
  defineQuery,
  type AnyContractSpec,
} from '../../../spec';
import type { SpecRegistry } from '../../../registry';
import { AccountBalanceRecord } from '../models';
import { OPENBANKING_TELEMETRY_EVENTS } from '../telemetry';

const OpenBankingGetBalancesInput = new SchemaModel({
  name: 'OpenBankingGetBalancesInput',
  description:
    'Parameters for retrieving bank account balances from the canonical ledger.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    balanceTypes: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

const OpenBankingGetBalancesOutput = new SchemaModel({
  name: 'OpenBankingGetBalancesOutput',
  description: 'Canonical balances for a bank account.',
  fields: {
    balances: {
      type: AccountBalanceRecord,
      isOptional: false,
      isArray: true,
    },
    asOf: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const OpenBankingRefreshBalancesInput = new SchemaModel({
  name: 'OpenBankingRefreshBalancesInput',
  description:
    'Command payload to refresh balances for a bank account via the open banking provider.',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: true },
    balanceTypes: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    forceRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const OpenBankingRefreshBalancesOutput = new SchemaModel({
  name: 'OpenBankingRefreshBalancesOutput',
  description: 'Result of a balance refresh against the open banking provider.',
  fields: {
    balances: {
      type: AccountBalanceRecord,
      isOptional: false,
      isArray: true,
    },
    refreshedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    errors: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const OpenBankingGetBalances = defineQuery({
  meta: {
    name: 'openbanking.balances.get',
    version: 1,
    description: 'Retrieve the latest cached balances for a bank account.',
    goal: 'Expose current and available balances required by dashboards and analytics.',
    context:
      'Used by Pocket Family Office UI surfaces and automation steps that require balance totals prior to generating summaries.',
    owners: ['platform.finance'],
    tags: ['open-banking', 'powens', 'balances'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingGetBalancesInput,
    output: OpenBankingGetBalancesOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const OpenBankingRefreshBalances = defineCommand({
  meta: {
    name: 'openbanking.balances.refresh',
    version: 1,
    description:
      'Refresh balances for a bank account via the configured open banking provider.',
    goal: 'Ensure canonical balance records reflect the latest values from Powens.',
    context:
      'Triggered by scheduled workflows before generating summaries or forecasting cashflow.',
    owners: ['platform.finance'],
    tags: ['open-banking', 'powens', 'balances'],
    stability: 'experimental',
  },
  io: {
    input: OpenBankingRefreshBalancesInput,
    output: OpenBankingRefreshBalancesOutput,
  },
  policy: {
    auth: 'admin',
  },
  telemetry: {
    success: {
      event: { name: OPENBANKING_TELEMETRY_EVENTS.balancesRefreshed },
      properties: ({ input, output }) => {
        const payload = input as {
          tenantId?: string;
          accountId?: string;
        };
        const result = output as {
          balances?: unknown[];
          refreshedAt?: string;
        } | null;
        return {
          tenantId: payload?.tenantId,
          accountId: payload?.accountId,
          refreshedAt: result?.refreshedAt,
          balanceCount: Array.isArray(result?.balances)
            ? result?.balances.length
            : undefined,
        };
      },
    },
    failure: {
      event: { name: OPENBANKING_TELEMETRY_EVENTS.balancesRefreshFailed },
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

export const openBankingBalanceContracts: Record<string, AnyContractSpec> = {
  OpenBankingGetBalances,
  OpenBankingRefreshBalances,
};

export function registerOpenBankingBalanceContracts(
  registry: SpecRegistry
): SpecRegistry {
  return registry
    .register(OpenBankingGetBalances)
    .register(OpenBankingRefreshBalances);
}
