import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
  OpenBankingGetAccount,
  OpenBankingListAccounts,
  OpenBankingSyncAccounts,
  registerOpenBankingAccountContracts,
} from './accounts';
import {
  OpenBankingListTransactions,
  OpenBankingSyncTransactions,
  registerOpenBankingTransactionContracts,
} from './transactions';
import {
  OpenBankingGetBalances,
  OpenBankingRefreshBalances,
  registerOpenBankingBalanceContracts,
} from './balances';

export {
  OpenBankingGetAccount,
  OpenBankingListAccounts,
  OpenBankingSyncAccounts,
  OpenBankingListTransactions,
  OpenBankingSyncTransactions,
  OpenBankingGetBalances,
  OpenBankingRefreshBalances,
};

// Feature module specification
export * from '../openbanking.feature';

export function registerOpenBankingContracts(
  registry: OperationSpecRegistry
): OperationSpecRegistry {
  return registerOpenBankingBalanceContracts(
    registerOpenBankingTransactionContracts(
      registerOpenBankingAccountContracts(registry)
    )
  );
}
