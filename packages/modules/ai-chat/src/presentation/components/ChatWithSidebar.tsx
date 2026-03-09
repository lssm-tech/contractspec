'use client';

import * as React from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWithExport } from './ChatWithExport';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';
import { createLocalStorageConversationStore } from '../../core/local-storage-conversation-store';
import { type ConversationStore } from '../../core/conversation-store';
import type { ThinkingLevel } from '../../core/thinking-levels';
import type { UseChatOptions } from '../hooks/useChat';

export interface ChatWithSidebarProps extends Omit<
  UseChatOptions,
  'store' | 'conversationId'
> {
  /** Optional store (defaults to LocalStorage) */
  store?: ConversationStore;
  projectId?: string;
  tags?: string[];
  className?: string;
}

const defaultStore = createLocalStorageConversationStore();

/**
 * Full chat layout with sidebar (conversation history) and main chat area.
 * Uses a shared store for persistence.
 */
export function ChatWithSidebar({
  store = defaultStore,
  projectId,
  tags,
  className,
  thinkingLevel: initialThinkingLevel = 'thinking',
  ...useChatOptions
}: ChatWithSidebarProps) {
  const effectiveStore = store;
  const [thinkingLevel, setThinkingLevel] =
    React.useState<ThinkingLevel>(initialThinkingLevel);

  const chat = useChat({
    ...useChatOptions,
    store: effectiveStore,
    thinkingLevel,
  });

  const {
    messages,
    conversation,
    sendMessage,
    isLoading,
    setConversationId,
    createNewConversation,
    editMessage,
    forkConversation,
    updateConversation,
  } = chat;

  const selectedConversationId = conversation?.id ?? null;

  const handleSelectConversation = React.useCallback(
    (id: string | null) => {
      setConversationId(id);
    },
    [setConversationId]
  );

  return (
    <div className={className ?? 'flex h-full w-full'}>
      <ChatSidebar
        store={effectiveStore}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateNew={createNewConversation}
        projectId={projectId}
        tags={tags}
        selectedConversation={conversation}
        onUpdateConversation={
          updateConversation
            ? async (id, updates) => {
                if (id === selectedConversationId) {
                  await updateConversation(updates);
                }
              }
            : undefined
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatWithExport
          messages={messages}
          conversation={conversation}
          onCreateNew={createNewConversation}
          onFork={forkConversation}
          onEditMessage={editMessage}
          thinkingLevel={thinkingLevel}
          onThinkingLevelChange={setThinkingLevel}
        >
          <ChatInput
            onSend={(content, att) => sendMessage(content, att)}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </ChatWithExport>
      </div>
    </div>
  );
}
