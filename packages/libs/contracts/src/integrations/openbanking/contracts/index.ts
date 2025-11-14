import type { SpecRegistry } from '../../../registry';
import {
  registerOpenBankingAccountContracts,
  OpenBankingGetAccount,
  OpenBankingListAccounts,
  OpenBankingSyncAccounts,
} from './accounts';
import {
  registerOpenBankingTransactionContracts,
  OpenBankingListTransactions,
  OpenBankingSyncTransactions,
} from './transactions';
import {
  registerOpenBankingBalanceContracts,
  OpenBankingGetBalances,
  OpenBankingRefreshBalances,
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

export function registerOpenBankingContracts(
  registry: SpecRegistry
): SpecRegistry {
  return registerOpenBankingBalanceContracts(
    registerOpenBankingTransactionContracts(
      registerOpenBankingAccountContracts(registry)
    )
  );
}

