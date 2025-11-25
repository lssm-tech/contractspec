import { describe, expect, it, vi } from 'bun:test';
import { PowensClient, PowensClientError } from './powens-client';

function createFetchMock() {
  const handler = vi.fn<typeof fetch>();
  const fetchFn = ((...args: Parameters<typeof fetch>) =>
    handler(...args)) as typeof fetch;
  Object.defineProperty(fetchFn, 'preconnect', {
    value: vi.fn<typeof fetch.preconnect>(),
  });
  return { fetch: fetchFn, handler };
}

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('PowensClient', () => {
  it('fetches and caches OAuth tokens before issuing API requests', async () => {
    const { fetch: fetchImpl, handler: handler } = createFetchMock();
    handler
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
      fetchImpl,
    });

    await client.listAccounts({ userUuid: 'user-1' });
    await client.listAccounts({ userUuid: 'user-1' });

    expect(handler).toHaveBeenCalledTimes(3);
    const calls = handler.mock.calls;
    const tokenRequest = calls[0];
    const firstCall = calls[1];
    const secondCall = calls[2];
    if (!tokenRequest || !firstCall || !secondCall) {
      throw new Error('Expected fetch to be called three times');
    }
    expect(String(tokenRequest[0])).toContain('/oauth/token');
    expect(String(firstCall[0])).toContain('/users/user-1/accounts');
    expect(String(secondCall[0])).toContain('/users/user-1/accounts');
    const authHeader = getHeader(firstCall[1], 'Authorization');
    expect(authHeader).toBe('Bearer token-123');
  });

  it('throws PowensClientError when API responds with non-2xx', async () => {
    const { fetch: fetchImpl, handler } = createFetchMock();
    handler
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
      fetchImpl,
    });

    await expect(
      client.listAccounts({ userUuid: 'user-1' })
    ).rejects.toBeInstanceOf(PowensClientError);
  });
});

function getHeader(init: RequestInit | undefined, name: string) {
  if (!init?.headers) return undefined;
  const target = name.toLowerCase();
  const headers = init.headers;
  if (headers instanceof Headers) {
    return headers.get(name) ?? headers.get(target);
  }
  if (Array.isArray(headers)) {
    const entry = headers.find(
      ([key]) => key.toLowerCase() === target || key === name
    );
    return entry?.[1];
  }
  const record = headers as Record<string, string | undefined>;
  return record[name] ?? record[target];
}
