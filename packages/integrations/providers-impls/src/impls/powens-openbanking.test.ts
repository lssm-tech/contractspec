import { describe, expect, it, vi } from 'bun:test';
import { PowensOpenBankingProvider } from './powens-openbanking';
import type { OpenBankingListAccountsResult } from '../openbanking';

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function createFetchMock() {
  const handler = vi.fn<typeof fetch>();
  const fetchFn = ((...args: Parameters<typeof fetch>) =>
    handler(...args)) as typeof fetch;
  Object.defineProperty(fetchFn, 'preconnect', {
    value: vi.fn<typeof fetch.preconnect>(),
  });
  return { fetch: fetchFn, handler };
}

const TOKEN_RESPONSE = {
  access_token: 'powens-token',
  expires_in: 3600,
  token_type: 'Bearer',
};

describe('PowensOpenBankingProvider', () => {
  it('maps Powens account payloads to canonical summaries', async () => {
    const { fetch: fetchImpl, handler } = createFetchMock();
    handler
      .mockResolvedValueOnce(createResponse(TOKEN_RESPONSE))
      .mockResolvedValueOnce(
        createResponse({
          accounts: [
            {
              uuid: 'acc-001',
              reference: 'external-acc',
              userUuid: 'user-123',
              institution: {
                id: 'inst-42',
                name: 'Powens Test Bank',
                logoUrl: 'https://powens.test/logo.png',
              },
              name: 'Family Checking',
              iban: 'FR7612345678901234567890185',
              bic: 'POWEFRPP',
              currency: 'EUR',
              balance: 1287.45,
              availableBalance: 1187.45,
              type: 'checking',
              status: 'active',
              metadata: {
                account_number_masked: '***0185',
                ownership: 'individual',
                last_sync_at: '2025-01-15T10:00:00Z',
              },
            },
          ],
          pagination: { hasMore: false },
        })
      );

    const provider = new PowensOpenBankingProvider({
      clientId: 'client',
      clientSecret: 'secret',
      environment: 'sandbox',
      fetchImpl,
    });

    const result = (await provider.listAccounts({
      tenantId: 'tenant.family-office',
      connectionId: 'conn-powens-primary',
      userId: 'user-123',
    })) as OpenBankingListAccountsResult;

    expect(result.accounts).toHaveLength(1);
    expect(result.accounts[0]).toBeDefined();
    const account = result.accounts[0]!;
    expect(account.displayName).toBe('Family Checking');
    expect(account.currency).toBe('EUR');
    expect(account.connectionId).toBe('conn-powens-primary');
    expect(account.ownership).toBe('individual');
    expect(account.accountNumberMasked).toBe('***0185');
    expect(account.lastSyncedAt).toBe('2025-01-15T10:00:00Z');
  });

  it('maps Powens balances to canonical balance records', async () => {
    const { fetch: fetchImpl, handler: balancesHandler } = createFetchMock();
    balancesHandler
      .mockResolvedValueOnce(createResponse(TOKEN_RESPONSE))
      .mockResolvedValueOnce(
        createResponse({
          accounts: [],
        })
      )
      .mockResolvedValueOnce(
        createResponse([
          {
            accountUuid: 'acc-001',
            type: 'current',
            amount: 1200.5,
            currency: 'EUR',
            updatedAt: '2025-01-20T08:30:00Z',
          },
          {
            accountUuid: 'acc-001',
            type: 'available',
            amount: 1100.25,
            currency: 'EUR',
            updatedAt: '2025-01-20T08:30:00Z',
          },
        ])
      );

    const provider = new PowensOpenBankingProvider({
      clientId: 'client',
      clientSecret: 'secret',
      environment: 'sandbox',
      fetchImpl,
    });

    // prime token cache
    await provider.listAccounts({
      tenantId: 'tenant.family-office',
      connectionId: 'conn-powens-primary',
      userId: 'user-123',
    });

    const balances = await provider.getBalances({
      tenantId: 'tenant.family-office',
      connectionId: 'conn-powens-primary',
      accountId: 'acc-001',
    });

    expect(balances).toHaveLength(2);
    expect(balances[0]).toBeDefined();
    const firstBalance = balances[0]!;
    expect(firstBalance.type).toBe('current');
    expect(firstBalance.amount).toBe(1200.5);
    expect(firstBalance.lastUpdatedAt).toBe('2025-01-20T08:30:00Z');
  });

  it('throws when userId is not provided for account listing', async () => {
    const { fetch: fetchImpl } = createFetchMock();
    const provider = new PowensOpenBankingProvider({
      clientId: 'client',
      clientSecret: 'secret',
      environment: 'sandbox',
      fetchImpl,
    });

    await expect(
      provider.listAccounts({
        tenantId: 'tenant.family-office',
        connectionId: 'conn-powens-primary',
        // userId omitted intentionally
      } as any)
    ).rejects.toThrowError(/requires the upstream userId/i);
  });
});
