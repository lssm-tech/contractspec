import { describe, expect, it, vi } from 'bun:test';
import type { Client } from '@notionhq/client';
import { NotionProjectManagementProvider } from './notion';

describe('NotionProjectManagementProvider', () => {
  it('creates database entries for work items', async () => {
    const pagesCreate = vi.fn(async () => ({
      id: 'page-1',
      url: 'https://notion.so/page-1',
    }));
    const client = {
      pages: { create: pagesCreate },
      blocks: { children: { append: vi.fn() } },
    } as unknown as Client;

    const provider = new NotionProjectManagementProvider({
      apiKey: 'secret',
      databaseId: 'db-1',
      client,
    });

    const result = await provider.createWorkItem({
      title: 'Document workflow',
      description: 'Share with team',
      tags: ['docs'],
    });

    expect(pagesCreate).toHaveBeenCalled();
    expect(result.id).toBe('page-1');
  });
});
