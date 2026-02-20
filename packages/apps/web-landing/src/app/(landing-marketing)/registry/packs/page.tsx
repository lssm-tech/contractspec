import type { Metadata } from 'next';
import { searchPacks, getTags } from '@/lib/registry-api';
import { PackSearchClient } from './clients/pack-search-client';

export const metadata: Metadata = {
  title: 'Browse Packs | agentpacks Registry',
  description:
    'Search and discover agentpacks — reusable configuration packs for AI coding tools like Cursor, OpenCode, Claude Code, and Copilot.',
};

export default async function PacksSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : undefined;
  const sort =
    typeof params.sort === 'string'
      ? (params.sort as 'downloads' | 'weekly' | 'name' | 'updated')
      : 'downloads';
  const page = typeof params.page === 'string' ? Number(params.page) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const [packsResult, tagsResult] = await Promise.all([
    searchPacks({ q, sort, limit, offset }, { next: { revalidate: 60 } }),
    getTags({ next: { revalidate: 300 } }),
  ]);

  return (
    <PackSearchClient
      initialPacks={packsResult.packs}
      initialTotal={packsResult.total}
      tags={tagsResult.tags}
      initialQuery={q ?? ''}
      initialSort={sort}
      initialPage={page}
    />
  );
}
