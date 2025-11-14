import type {
  OpenBankingAccountBalance,
  OpenBankingAccountDetails,
  OpenBankingAccountSummary,
  OpenBankingConnectionStatus,
  OpenBankingGetAccountDetailsParams,
  OpenBankingGetBalancesParams,
  OpenBankingGetConnectionStatusParams,
  OpenBankingListAccountsParams,
  OpenBankingListAccountsResult,
  OpenBankingListTransactionsParams,
  OpenBankingListTransactionsResult,
  OpenBankingProvider,
} from '../openbanking';
import {
  PowensClient,
  PowensClientError,
  type PowensClientOptions,
  type PowensAccount,
  type PowensTransaction,
  type PowensBalance,
  type PowensConnectionStatusResponse,
} from './powens-client';

export interface PowensOpenBankingProviderOptions
  extends PowensClientOptions {}

interface ProviderContext {
  tenantId: string;
  connectionId: string;
}

export class PowensOpenBankingProvider implements OpenBankingProvider {
  private readonly client: PowensClient;
  private readonly logger?: PowensClientOptions['logger'];

  constructor(options: PowensOpenBankingProviderOptions) {
    this.client = new PowensClient(options);
    this.logger = options.logger;
  }

  async listAccounts(
    params: OpenBankingListAccountsParams
  ): Promise<OpenBankingListAccountsResult> {
    if (!params.userId) {
      throw new PowensClientError(
        'Powens account listing requires the upstream userId mapped to Powens user UUID.',
        400
      );
    }
    const context = this.toContext(params.tenantId, params.connectionId);
    try {
      const response = await this.client.listAccounts({
        userUuid: params.userId,
        cursor: params.cursor,
        limit: params.pageSize,
        includeBalances: params.includeBalances,
        institutionUuid: params.institutionId,
      });
      return {
        accounts: response.accounts.map((account) =>
          this.mapAccount(account, context)
        ),
        nextCursor: response.pagination?.nextCursor,
        hasMore: response.pagination?.hasMore,
      };
    } catch (error) {
      this.handleError('listAccounts', error);
    }
  }

  async getAccountDetails(
    params: OpenBankingGetAccountDetailsParams
  ): Promise<OpenBankingAccountDetails> {
    const context = this.toContext(params.tenantId, params.connectionId);
    try {
      const account = await this.client.getAccount(params.accountId);
      return this.mapAccountDetails(account, context);
    } catch (error) {
      this.handleError('getAccountDetails', error);
    }
  }

  async listTransactions(
    params: OpenBankingListTransactionsParams
  ): Promise<OpenBankingListTransactionsResult> {
    const context = this.toContext(params.tenantId, params.connectionId);
    try {
      const response = await this.client.listTransactions({
        accountUuid: params.accountId,
        cursor: params.cursor,
        limit: params.pageSize,
        from: params.from,
        to: params.to,
        includePending: params.includePending,
      });
      return {
        transactions: response.transactions.map((transaction) =>
          this.mapTransaction(transaction, context)
        ),
        nextCursor: response.pagination?.nextCursor,
        hasMore: response.pagination?.hasMore,
      };
    } catch (error) {
      this.handleError('listTransactions', error);
    }
  }

  async getBalances(
    params: OpenBankingGetBalancesParams
  ): Promise<OpenBankingAccountBalance[]> {
    const context = this.toContext(params.tenantId, params.connectionId);
    try {
      const balances = await this.client.getBalances(params.accountId);
      return balances
        .filter((balance) =>
          params.balanceTypes?.length
            ? params.balanceTypes.includes(balance.type as any)
            : true
        )
        .map((balance) => this.mapBalance(balance, context));
    } catch (error) {
      this.handleError('getBalances', error);
    }
  }

  async getConnectionStatus(
    params: OpenBankingGetConnectionStatusParams
  ): Promise<OpenBankingConnectionStatus> {
    try {
      const status = await this.client.getConnectionStatus(params.connectionId);
      return {
        connectionId: params.connectionId,
        tenantId: params.tenantId,
        status: this.mapConnectionStatus(status.status),
        lastCheckedAt: status.lastAttemptAt,
        errorCode: status.errorCode,
        errorMessage: status.errorMessage,
        details: status.metadata,
      };
    } catch (error) {
      this.handleError('getConnectionStatus', error);
    }
  }

  private mapAccount(
    account: PowensAccount,
    context: ProviderContext
  ): OpenBankingAccountSummary {
    return {
      id: account.uuid,
      externalId: account.reference ?? account.uuid,
      tenantId: context.tenantId,
      connectionId: context.connectionId,
      userId: account.userUuid,
      displayName: account.name,
      institutionId: account.institution.id,
      institutionName: account.institution.name,
      institutionLogoUrl: account.institution.logoUrl,
      accountType: account.type ?? 'unknown',
      iban: account.iban,
      bic: account.bic,
      currency: account.currency ?? 'EUR',
      accountNumberMasked: account.metadata?.account_number_masked as
        | string
        | undefined,
      ownership: this.mapOwnership(account.metadata?.ownership as string | undefined),
      status: this.mapAccountStatus(account.status),
      lastSyncedAt: account.metadata?.last_sync_at as string | undefined,
      metadata: account.metadata,
    };
  }

  private mapAccountDetails(
    account: PowensAccount,
    context: ProviderContext
  ): OpenBankingAccountDetails {
    return {
      ...this.mapAccount(account, context),
      productCode: account.metadata?.product_code as string | undefined,
      openedAt: account.metadata?.opened_at as string | undefined,
      closedAt: account.metadata?.closed_at as string | undefined,
      availableBalance: account.availableBalance ?? undefined,
      currentBalance: account.balance ?? undefined,
      creditLimit: account.metadata?.credit_limit as number | undefined,
      customFields: account.metadata,
    };
  }

  private mapTransaction(
    transaction: PowensTransaction,
    context: ProviderContext
  ) {
    return {
      id: transaction.uuid,
      externalId: transaction.uuid,
      tenantId: context.tenantId,
      accountId: transaction.accountUuid,
      connectionId: context.connectionId,
      amount: transaction.amount,
      currency: transaction.currency,
      direction: transaction.direction === 'credit' ? 'credit' : 'debit',
      description: transaction.description ?? transaction.rawLabel,
      bookingDate: transaction.bookingDate,
      valueDate: transaction.valueDate,
      postedAt: transaction.bookingDate,
      category: transaction.category,
      rawCategory: transaction.rawLabel,
      merchantName: transaction.merchantName,
      merchantCategoryCode: transaction.merchantCategoryCode,
      counterpartyName: transaction.counterpartyName,
      counterpartyAccount: transaction.counterpartyAccount,
      reference: transaction.metadata?.reference as string | undefined,
      status: this.mapTransactionStatus(transaction.status),
      metadata: transaction.metadata,
    };
  }

  private mapBalance(
    balance: PowensBalance,
    context: ProviderContext
  ): OpenBankingAccountBalance {
    return {
      accountId: balance.accountUuid,
      connectionId: context.connectionId,
      tenantId: context.tenantId,
      type: (balance.type ?? 'current') as OpenBankingAccountBalance['type'],
      currency: balance.currency ?? 'EUR',
      amount: balance.amount,
      lastUpdatedAt: balance.updatedAt,
      metadata: balance.metadata,
    };
  }

  private toContext(
    tenantId: string,
    connectionId: string
  ): ProviderContext {
    return { tenantId, connectionId };
  }

  private mapOwnership(value: string | undefined) {
    switch (value?.toLowerCase()) {
      case 'individual':
      case 'personal':
        return 'individual';
      case 'joint':
        return 'joint';
      case 'business':
      case 'corporate':
        return 'business';
      default:
        return 'unknown';
    }
  }

  private mapAccountStatus(status?: string) {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'enabled':
        return 'active';
      case 'disabled':
      case 'inactive':
        return 'inactive';
      case 'closed':
        return 'closed';
      case 'suspended':
        return 'suspended';
      default:
        return 'active';
    }
  }

  private mapTransactionStatus(status?: string) {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'authorised':
        return 'pending';
      case 'booked':
      case 'posted':
        return 'booked';
      case 'cancelled':
      case 'rejected':
        return 'cancelled';
      default:
        return 'booked';
    }
  }

  private mapConnectionStatus(
    status: PowensConnectionStatusResponse['status']
  ): OpenBankingConnectionStatus['status'] {
    switch (status) {
      case 'healthy':
        return 'healthy';
      case 'pending':
        return 'degraded';
      case 'error':
        return 'error';
      case 'revoked':
        return 'disconnected';
      default:
        return 'degraded';
    }
  }

  private handleError(operation: string, error: unknown): never {
    if (error instanceof PowensClientError) {
      this.logger?.error?.(
        `[PowensOpenBankingProvider] ${operation} failed`,
        {
          status: error.status,
          code: error.code,
          requestId: error.requestId,
          message: error.message,
        }
      );
      throw error;
    }
    this.logger?.error?.(
      `[PowensOpenBankingProvider] ${operation} failed with unexpected error`,
      error
    );
    throw error instanceof Error
      ? error
      : new Error(`Powens operation "${operation}" failed`);
  }
}


