'use client';

import { useMemo } from 'react';
import { defaultDocRegistry } from '@contractspec/lib.contracts';

/**
 * Hook to fetch documentation blocks related to a specific key or set of tags.
 */
export function useRelatedDocs(key: string, tags?: string[]) {
  const docs = useMemo(() => {
    try {
      const allDocs = defaultDocRegistry.list();
      return allDocs
        .filter(({ block }) => {
          // Match by key in ID or title
          const keyMatch = 
            block.id.toLowerCase().includes(key.toLowerCase()) || 
            block.title.toLowerCase().includes(key.toLowerCase());
          
          // Match by tags
          const tagMatch = tags?.some(t => 
            block.tags?.some(bt => bt.toLowerCase().includes(t.toLowerCase()))
          );

          return keyMatch || tagMatch;
        })
        .map(({ block, route }) => ({
          id: block.id,
          title: block.title,
          summary: block.summary,
          route,
        }));
    } catch (e) {
      console.error('Failed to fetch related docs:', e);
      return [];
    }
  }, [key, tags]);

  return docs;
}
