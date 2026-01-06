import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import {
  RegistryClient,
  resolveRegistryUrl,
  addToRegistry,
  listFromRegistry,
  searchRegistry,
} from './registry';

describe('Registry Service', () => {
  const mockFetch = mock(() =>
    Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
  );

  const mockLogger = {
    info: mock(),
    warn: mock(),
    error: mock(),
    debug: mock(),
    createProgress: mock(() => ({
      start: mock(),
      update: mock(),
      stop: mock(),
      succeed: mock(),
      fail: mock(),
      warn: mock(),
    })),
  };

  beforeEach(() => {
    mockFetch.mockClear();
    mockLogger.info.mockClear();
    global.fetch = mockFetch as unknown as typeof fetch;
    
    // Reset to default success response
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );
  });

  afterEach(() => {
    mock.restore();
  });

  describe('RegistryClient', () => {
    it('should resolve URL correctly', () => {
      const client = new RegistryClient({ registryUrl: 'http://foo.com/' });
      // client.getJson uses resolved URL
    });

    it('should fetch JSON', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ data: 'test' }), { status: 200 })
      );
      const client = new RegistryClient({ registryUrl: 'http://foo.com' });
      const result = await client.getJson<{ data: string }>('/path');
      expect(result).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://foo.com/path',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should throw on error status', async () => {
      mockFetch.mockResolvedValue(
        new Response('Not Found', { status: 404, statusText: 'Not Found' })
      );
      const client = new RegistryClient({ registryUrl: 'http://foo.com' });
      expect(client.getJson('/path')).rejects.toThrow('Registry request failed: 404');
    });

    it('should throw on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      const client = new RegistryClient({ registryUrl: 'http://foo.com' });
      expect(client.getJson('/path')).rejects.toThrow('Registry request failed');
    });
  });

  describe('resolveRegistryUrl', () => {
    it('should prioritize CLI argument', () => {
      const url = resolveRegistryUrl('http://cli.com');
      expect(url).toBe('http://cli.com');
    });

    it('should use ENV if no CLI arg', () => {
      process.env.CONTRACTSPEC_REGISTRY_URL = 'http://env.com';
      const url = resolveRegistryUrl(undefined);
      expect(url).toBe('http://env.com');
      delete process.env.CONTRACTSPEC_REGISTRY_URL;
    });

    it('should fallback to default', () => {
      const url = resolveRegistryUrl(undefined);
      expect(url).toBe('http://localhost:8090');
    });
  });

  describe('High-level functions', () => {
    it('addToRegistry should call correct endpoint', async () => {
      await addToRegistry('specs/foo.yaml', {}, { logger: mockLogger });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/specs/add?path='),
        expect.anything()
      );
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('listFromRegistry should call correct endpoint', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(['spec1']), { status: 200 })
      );
      const specs = await listFromRegistry({}, { logger: mockLogger });
      expect(specs).toEqual(['spec1']);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/specs'),
        expect.anything()
      );
    });

    it('searchRegistry should call correct endpoint', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(['found']), { status: 200 })
      );
      const results = await searchRegistry('query', {}, { logger: mockLogger });
      expect(results).toEqual(['found']);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/specs/search?q=query'),
        expect.anything()
      );
    });
  });
});
