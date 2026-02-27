import { describe, expect, it, vi } from 'bun:test';
import { HealthProviderCapabilityError } from './base-health-provider';
import {
  OpenWearablesHealthProvider,
  UnofficialHealthAutomationProvider,
  WhoopHealthProvider,
} from './providers';

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

describe('health provider implementations', () => {
  it('routes OpenWearables activities with upstream provider filter', async () => {
    const { fetch: fetchFn, handler } = createFetchMock();
    handler.mockResolvedValueOnce(
      createJsonResponse({
        activities: [
          {
            id: 'activity-1',
            external_id: 'ext-1',
            type: 'run',
            started_at: '2026-01-01T10:00:00.000Z',
          },
        ],
      })
    );

    const provider = new OpenWearablesHealthProvider({
      providerKey: 'health.strava',
      upstreamProvider: 'strava',
      transport: 'aggregator-api',
      apiBaseUrl: 'https://openwearables.example',
      apiKey: 'api-key',
      fetchFn,
      route: 'fallback',
      aggregatorKey: 'health.openwearables',
    });

    const result = await provider.listActivities({
      tenantId: 'tenant-1',
      connectionId: 'conn-1',
      pageSize: 10,
    });

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]?.providerKey).toBe('health.strava');
    expect(result.source?.route).toBe('fallback');
    expect(result.source?.aggregatorKey).toBe('health.openwearables');
    const requestUrl = String(handler.mock.calls[0]?.[0]);
    expect(requestUrl).toContain('/v1/activities');
    expect(requestUrl).toContain('upstreamProvider=strava');
  });

  it('reports unsupported capability on provider methods', async () => {
    const provider = new WhoopHealthProvider({
      transport: 'official-api',
      accessToken: 'token',
    });

    await expect(
      provider.listNutrition({
        tenantId: 'tenant-1',
        connectionId: 'conn-1',
      })
    ).rejects.toBeInstanceOf(HealthProviderCapabilityError);
  });

  it('calls unofficial MCP tools for unofficial providers', async () => {
    const { fetch: fetchFn, handler } = createFetchMock();
    handler.mockResolvedValueOnce(
      createJsonResponse({
        result: {
          structuredContent: {
            activities: [
              {
                id: 'activity-1',
                external_id: 'external-1',
                type: 'ride',
                started_at: '2026-01-01T10:00:00.000Z',
              },
            ],
          },
        },
      })
    );

    const provider = new UnofficialHealthAutomationProvider({
      providerKey: 'health.peloton',
      transport: 'unofficial',
      mcpUrl: 'https://mcp.example',
      mcpAccessToken: 'mcp-token',
      fetchFn,
    });

    const result = await provider.listActivities({
      tenantId: 'tenant-1',
      connectionId: 'conn-1',
    });

    expect(result.activities).toHaveLength(1);
    expect(result.activities[0]?.providerKey).toBe('health.peloton');
    const rpcPayload = handler.mock.calls[0]?.[1]?.body;
    expect(String(rpcPayload)).toContain('peloton_list_activities');
  });
});
