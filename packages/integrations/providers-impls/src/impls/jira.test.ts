import { describe, expect, it, vi } from 'bun:test';
import { JiraProjectManagementProvider } from './jira';

describe('JiraProjectManagementProvider', () => {
  it('creates Jira issues via REST', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 201,
      json: async () => ({ id: '100', key: 'PM-1' }),
      text: async () => '',
    }));

    const provider = new JiraProjectManagementProvider({
      siteUrl: 'https://acme.atlassian.net',
      email: 'user@acme.com',
      apiToken: 'token',
      projectKey: 'PM',
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await provider.createWorkItem({
      title: 'Ship sync',
      description: 'Build integration',
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(result.id).toBe('100');
    expect(result.url).toBe('https://acme.atlassian.net/browse/PM-1');
  });
});
