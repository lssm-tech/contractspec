import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
	OpenBankingGetAccount,
	OpenBankingListAccounts,
	OpenBankingSyncAccounts,
	registerOpenBankingAccountContracts,
} from './accounts';
import {
	OpenBankingGetBalances,
	OpenBankingRefreshBalances,
	registerOpenBankingBalanceContracts,
} from './balances';
import {
	OpenBankingListTransactions,
	OpenBankingSyncTransactions,
	registerOpenBankingTransactionContracts,
} from './transactions';

// Feature module specification
export * from '../openbanking.feature';
export {
	OpenBankingGetAccount,
	OpenBankingGetBalances,
	OpenBankingListAccounts,
	OpenBankingListTransactions,
	OpenBankingRefreshBalances,
	OpenBankingSyncAccounts,
	OpenBankingSyncTransactions,
};

export function registerOpenBankingContracts(
	registry: OperationSpecRegistry
): OperationSpecRegistry {
	return registerOpenBankingBalanceContracts(
		registerOpenBankingTransactionContracts(
			registerOpenBankingAccountContracts(registry)
		)
	);
}
