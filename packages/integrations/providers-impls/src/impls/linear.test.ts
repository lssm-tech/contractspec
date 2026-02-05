import { describe, expect, it, vi } from 'bun:test';
import type { LinearClient } from '@linear/sdk';
import { LinearProjectManagementProvider } from './linear';

describe('LinearProjectManagementProvider', () => {
  it('creates issues with default team', async () => {
    const createIssue = vi.fn(async () => ({
      issue: Promise.resolve({
        id: 'issue-1',
        title: 'Test task',
        url: 'https://linear.app/issue-1',
        state: { name: 'Todo' },
      }),
    }));

    const client = { createIssue } as unknown as LinearClient;
    const provider = new LinearProjectManagementProvider({
      apiKey: 'linear-key',
      teamId: 'team-1',
      client,
    });

    const result = await provider.createWorkItem({ title: 'Test task' });

    expect(createIssue).toHaveBeenCalledWith(
      expect.objectContaining({ teamId: 'team-1', title: 'Test task' })
    );
    expect(result.id).toBe('issue-1');
  });
});
