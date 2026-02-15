export type OpenBankingAccountOwnership =
  | 'individual'
  | 'joint'
  | 'business'
  | 'unknown';

export interface OpenBankingAccountSummary {
  id: string;
  externalId: string;
  tenantId: string;
  connectionId: string;
  userId?: string;
  displayName: string;
  institutionId: string;
  institutionName: string;
  institutionLogoUrl?: string;
  accountType: string;
  iban?: string;
  bic?: string;
  currency: string;
  accountNumberMasked?: string;
  ownership?: OpenBankingAccountOwnership;
  status?: 'active' | 'inactive' | 'closed' | 'suspended';
  lastSyncedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface OpenBankingAccountDetails extends OpenBankingAccountSummary {
  productCode?: string;
  openedAt?: string;
  closedAt?: string;
  availableBalance?: number;
  currentBalance?: number;
  creditLimit?: number;
  customFields?: Record<string, unknown>;
}

export interface OpenBankingTransaction {
  id: string;
  externalId: string;
  tenantId: string;
  accountId: string;
  connectionId: string;
  amount: number;
  currency: string;
  direction: 'debit' | 'credit';
  description?: string;
  bookingDate?: string;
  valueDate?: string;
  postedAt?: string;
  category?: string;
  rawCategory?: string;
  merchantName?: string;
  merchantCategoryCode?: string;
  counterpartyName?: string;
  counterpartyAccount?: string;
  reference?: string;
  status?: 'pending' | 'booked' | 'cancelled';
  metadata?: Record<string, unknown>;
}

export type OpenBankingBalanceType =
  | 'current'
  | 'available'
  | 'authorised'
  | 'uncleared'
  | 'credit'
  | (string & {});

export interface OpenBankingAccountBalance {
  accountId: string;
  connectionId: string;
  tenantId: string;
  type: OpenBankingBalanceType;
  currency: string;
  amount: number;
  lastUpdatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface OpenBankingConnectionStatus {
  connectionId: string;
  tenantId: string;
  status: 'healthy' | 'degraded' | 'error' | 'disconnected';
  lastCheckedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  details?: Record<string, unknown>;
}

export interface OpenBankingListAccountsParams {
  tenantId: string;
  connectionId: string;
  userId?: string;
  cursor?: string;
  pageSize?: number;
  includeBalances?: boolean;
  institutionId?: string;
}

export interface OpenBankingListAccountsResult {
  accounts: OpenBankingAccountSummary[];
  nextCursor?: string;
  hasMore?: boolean;
}

export interface OpenBankingGetAccountDetailsParams {
  tenantId: string;
  accountId: string;
  connectionId: string;
  includeBalances?: boolean;
}

export interface OpenBankingListTransactionsParams {
  tenantId: string;
  accountId: string;
  connectionId: string;
  from?: string;
  to?: string;
  cursor?: string;
  pageSize?: number;
  includePending?: boolean;
}

export interface OpenBankingListTransactionsResult {
  transactions: OpenBankingTransaction[];
  nextCursor?: string;
  hasMore?: boolean;
}

export interface OpenBankingGetBalancesParams {
  tenantId: string;
  accountId: string;
  connectionId: string;
  balanceTypes?: OpenBankingBalanceType[];
}

export interface OpenBankingGetConnectionStatusParams {
  tenantId: string;
  connectionId: string;
}

export interface OpenBankingProvider {
  listAccounts(
    params: OpenBankingListAccountsParams
  ): Promise<OpenBankingListAccountsResult>;
  getAccountDetails(
    params: OpenBankingGetAccountDetailsParams
  ): Promise<OpenBankingAccountDetails>;
  listTransactions(
    params: OpenBankingListTransactionsParams
  ): Promise<OpenBankingListTransactionsResult>;
  getBalances(
    params: OpenBankingGetBalancesParams
  ): Promise<OpenBankingAccountBalance[]>;
  getConnectionStatus(
    params: OpenBankingGetConnectionStatusParams
  ): Promise<OpenBankingConnectionStatus>;
}
