import { describe, expect, test, beforeAll, afterAll, mock } from 'bun:test';
import {
  RegistryClient,
  RegistryApiError,
  createRegistryClient,
} from '../../src/utils/registry-client.js';

/**
 * Unit tests for RegistryClient.
 * Uses mocked fetch to avoid network calls.
 */

const MOCK_REGISTRY = 'https://test-registry.local';

/** Helper to create a mock Response. */
function mockResponse(
  body: unknown,
  opts?: { status?: number; headers?: Record<string, string> }
): Response {
  const status = opts?.status ?? 200;
  const headers = new Headers(opts?.headers ?? {});
  headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(body), { status, headers });
}

describe('RegistryClient', () => {
  const originalFetch = globalThis.fetch;

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  test('search sends correct query params', async () => {
    let capturedUrl = '';
    globalThis.fetch = async (
      input: RequestInfo | URL,
      _init?: RequestInit
    ) => {
      capturedUrl = input.toString();
      return mockResponse({ packs: [], total: 0 });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    await client.search({
      query: 'typescript',
      tags: ['ts'],
      sort: 'downloads',
      limit: 5,
    });

    expect(capturedUrl).toContain('/packs?');
    expect(capturedUrl).toContain('q=typescript');
    expect(capturedUrl).toContain('tags=ts');
    expect(capturedUrl).toContain('sort=downloads');
    expect(capturedUrl).toContain('limit=5');
  });

  test('search returns packs and total', async () => {
    globalThis.fetch = async () => {
      return mockResponse({
        packs: [{ name: 'test-pack', description: 'Test', downloads: 100 }],
        total: 1,
      });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    const result = await client.search({});
    expect(result.packs).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.packs[0].name).toBe('test-pack');
  });

  test('info returns pack detail', async () => {
    globalThis.fetch = async () => {
      return mockResponse({
        name: 'my-pack',
        latestVersion: '1.2.0',
        versions: [{ version: '1.2.0' }],
      });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    const info = await client.info('my-pack');
    expect(info.name).toBe('my-pack');
    expect(info.latestVersion).toBe('1.2.0');
  });

  test('info throws RegistryApiError on 404', async () => {
    globalThis.fetch = async () => {
      return new Response('Not Found', { status: 404 });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    try {
      await client.info('nonexistent');
      expect(true).toBe(false); // should not reach
    } catch (err) {
      expect(err).toBeInstanceOf(RegistryApiError);
      expect((err as RegistryApiError).status).toBe(404);
    }
  });

  test('download returns ArrayBuffer and integrity', async () => {
    const body = new Uint8Array([0x1f, 0x8b, 0x08, 0x00]).buffer;
    globalThis.fetch = async () => {
      const headers = new Headers();
      headers.set('x-integrity', 'sha256-abc123');
      return new Response(body, { status: 200, headers });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    const result = await client.download('my-pack', '1.0.0');
    expect(result.data).toBeInstanceOf(ArrayBuffer);
    expect(result.integrity).toBe('sha256-abc123');
  });

  test('publish requires auth token', async () => {
    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    try {
      await client.publish(new ArrayBuffer(0), {
        name: 'test',
        version: '1.0.0',
        manifest: {},
      });
      expect(true).toBe(false);
    } catch (err) {
      expect((err as Error).message).toContain('Authentication required');
    }
  });

  test('publish sends multipart form data with auth', async () => {
    let capturedHeaders: Record<string, string> = {};
    let capturedMethod = '';
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedMethod = init?.method ?? 'GET';
      const h = (init?.headers as Record<string, string>) ?? {};
      capturedHeaders = h;
      return mockResponse(
        { name: 'test', version: '1.0.0', integrity: 'sha256-x' },
        { status: 200 }
      );
    };

    const client = new RegistryClient({
      registryUrl: MOCK_REGISTRY,
      authToken: 'test-token-123',
    });
    const result = await client.publish(new ArrayBuffer(8), {
      name: 'test',
      version: '1.0.0',
      manifest: {},
    });

    expect(capturedMethod).toBe('POST');
    expect(capturedHeaders['Authorization']).toBe('Bearer test-token-123');
    expect(result.name).toBe('test');
  });

  test('featured returns pack list', async () => {
    globalThis.fetch = async () => {
      return mockResponse({ packs: [{ name: 'featured-pack' }] });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    const packs = await client.featured(5);
    expect(packs).toHaveLength(1);
    expect(packs[0].name).toBe('featured-pack');
  });

  test('tags returns tag list', async () => {
    globalThis.fetch = async () => {
      return mockResponse({ tags: [{ tag: 'typescript', count: 42 }] });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    const tags = await client.tags();
    expect(tags).toHaveLength(1);
    expect(tags[0].tag).toBe('typescript');
  });

  test('stats returns registry statistics', async () => {
    globalThis.fetch = async () => {
      return mockResponse({
        totalPacks: 100,
        totalDownloads: 5000,
        totalVersions: 250,
      });
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    const stats = await client.stats();
    expect(stats.totalPacks).toBe(100);
    expect(stats.totalDownloads).toBe(5000);
  });

  test('health returns true on success', async () => {
    globalThis.fetch = async () => mockResponse({ status: 'ok' });

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    expect(await client.health()).toBe(true);
  });

  test('health returns false on failure', async () => {
    globalThis.fetch = async () => {
      throw new Error('Connection refused');
    };

    const client = new RegistryClient({ registryUrl: MOCK_REGISTRY });
    expect(await client.health()).toBe(false);
  });

  test('createRegistryClient uses defaults', () => {
    const client = createRegistryClient();
    expect(client).toBeInstanceOf(RegistryClient);
  });

  test('trailing slash stripped from registry URL', async () => {
    let capturedUrl = '';
    globalThis.fetch = async (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return mockResponse({ packs: [], total: 0 });
    };

    const client = new RegistryClient({ registryUrl: 'https://example.com/' });
    await client.search({});
    expect(capturedUrl).toStartWith('https://example.com/packs');
    expect(capturedUrl).not.toContain('//packs');
  });
});

describe('RegistryApiError', () => {
  test('has status and message', () => {
    const err = new RegistryApiError(403, 'Forbidden');
    expect(err.status).toBe(403);
    expect(err.message).toBe('Forbidden');
    expect(err.name).toBe('RegistryApiError');
  });
});
