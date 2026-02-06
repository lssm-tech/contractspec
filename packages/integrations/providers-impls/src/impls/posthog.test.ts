import { describe, expect, it, vi } from 'bun:test';
import type { PostHog } from 'posthog-node';
import { PosthogAnalyticsProvider } from './posthog';

describe('PosthogAnalyticsProvider', () => {
  it('captures events via client', async () => {
    const capture = vi.fn(async () => undefined);
    const client = { capture } as unknown as PostHog;
    const provider = new PosthogAnalyticsProvider({
      projectApiKey: 'phc_project',
      client,
    });

    await provider.capture({
      distinctId: 'user-1',
      event: 'example.event',
      properties: { source: 'test' },
    });

    expect(capture).toHaveBeenCalled();
  });

  it('queries HogQL via API request', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ results: [[1]] }),
      headers: new Headers(),
    }));

    const provider = new PosthogAnalyticsProvider({
      projectId: '123',
      personalApiKey: 'phx_personal',
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await provider.queryHogQL({
      query: 'SELECT 1',
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(result.results).toEqual([[1]]);
  });
});
