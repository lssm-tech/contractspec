import { describe, expect, it, vi } from 'vitest';
import { PowensClient, PowensClientError } from './powens-client';

function createJsonResponse(
  body: unknown,
  status = 200
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('PowensClient', () => {
  it('fetches and caches OAuth tokens before issuing API requests', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        createJsonResponse({
          access_token: 'token-123',
          expires_in: 3600,
          token_type: 'Bearer',
        })
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          accounts: [],
        })
      )
      .mockResolvedValueOnce(
        createJsonResponse({
          accounts: [],
        })
      );

    const client = new PowensClient({
      clientId: 'client',
      clientSecret: 'secret',
      environment: 'sandbox',
      fetchImpl: fetchMock,
    });

    await client.listAccounts({ userUuid: 'user-1' });
    await client.listAccounts({ userUuid: 'user-1' });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const [tokenRequest, firstCall, secondCall] = fetchMock.mock.calls;
    expect(String(tokenRequest[0])).toContain('/oauth/token');
    expect(String(firstCall[0])).toContain('/users/user-1/accounts');
    expect(String(secondCall[0])).toContain('/users/user-1/accounts');
    const headers = (firstCall[1]?.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer token-123');
  });

  it('throws PowensClientError when API responds with non-2xx', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        createJsonResponse({
          access_token: 'token-123',
          expires_in: 3600,
          token_type: 'Bearer',
        })
      )
      .mockResolvedValueOnce(
        createJsonResponse(
          {
            code: 'invalid_credentials',
            message: 'Invalid Powens credentials supplied.',
          },
          401
        )
      );

    const client = new PowensClient({
      clientId: 'client',
      clientSecret: 'secret',
      environment: 'sandbox',
      fetchImpl: fetchMock,
    });

    await expect(
      client.listAccounts({ userUuid: 'user-1' })
    ).rejects.toBeInstanceOf(PowensClientError);
  });
});

