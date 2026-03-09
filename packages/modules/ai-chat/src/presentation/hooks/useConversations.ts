'use client';

import * as React from 'react';
import type { ChatConversation } from '../../core/message-types';
import type { ConversationStore } from '../../core/conversation-store';

export interface UseConversationsOptions {
  store: ConversationStore;
  projectId?: string;
  tags?: string[];
  limit?: number;
}

export interface UseConversationsReturn {
  conversations: ChatConversation[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  deleteConversation: (id: string) => Promise<boolean>;
}

/**
 * Hook for listing and managing conversations from a store
 */
export function useConversations(
  options: UseConversationsOptions
): UseConversationsReturn {
  const { store, projectId, tags, limit = 50 } = options;
  const [conversations, setConversations] = React.useState<ChatConversation[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await store.list({
        status: 'active',
        projectId,
        tags,
        limit,
      });
      setConversations(list);
    } finally {
      setIsLoading(false);
    }
  }, [store, projectId, tags, limit]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteConversation = React.useCallback(
    async (id: string): Promise<boolean> => {
      const ok = await store.delete(id);
      if (ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
      }
      return ok;
    },
    [store]
  );

  return {
    conversations,
    isLoading,
    refresh,
    deleteConversation,
  };
}
