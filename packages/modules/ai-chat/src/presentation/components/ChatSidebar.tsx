'use client';

import * as React from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@contractspec/lib.design-system';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { ChatConversation } from '../../core/message-types';
import { useConversations } from '../hooks/useConversations';
import type { ConversationStore } from '../../core/conversation-store';

export interface ChatSidebarProps {
  store: ConversationStore;
  selectedConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  onCreateNew: () => void;
  projectId?: string;
  tags?: string[];
  limit?: number;
  className?: string;
  /** Collapsible on mobile */
  collapsed?: boolean;
  /** Optional: update conversation (for project/tags edit) */
  onUpdateConversation?: (
    id: string,
    updates: { projectId?: string; projectName?: string; tags?: string[] }
  ) => Promise<void>;
  /** Selected conversation for meta display */
  selectedConversation?: ChatConversation | null;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 604800000) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function ConversationItem({
  conversation,
  selected,
  onSelect,
  onDelete,
}: {
  conversation: ChatConversation;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const title =
    conversation.title ??
    conversation.messages[0]?.content?.slice(0, 50) ??
    'New chat';
  const displayTitle = title.length > 40 ? `${title.slice(0, 40)}…` : title;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        selected
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent/50'
      )}
    >
      <MessageSquare className="text-muted-foreground h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate">{displayTitle}</p>
        <p className="text-muted-foreground text-xs">
          {formatDate(conversation.updatedAt)}
          {conversation.projectName && ` · ${conversation.projectName}`}
          {conversation.tags && conversation.tags.length > 0 && (
            <> · {conversation.tags.slice(0, 2).join(', ')}</>
          )}
        </p>
      </div>
      <span onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 shrink-0 p-0 opacity-0 group-hover:opacity-100"
          onPress={onDelete}
          aria-label="Delete conversation"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </span>
    </div>
  );
}

/**
 * Sidebar listing conversations with new/delete actions
 */
export function ChatSidebar({
  store,
  selectedConversationId,
  onSelectConversation,
  onCreateNew,
  projectId,
  tags,
  limit = 50,
  className,
  collapsed = false,
  onUpdateConversation,
  selectedConversation,
}: ChatSidebarProps) {
  const { conversations, isLoading, refresh, deleteConversation } =
    useConversations({ store, projectId, tags, limit });

  const handleDelete = React.useCallback(
    async (id: string) => {
      const ok = await deleteConversation(id);
      if (ok && selectedConversationId === id) {
        onSelectConversation(null);
      }
    },
    [deleteConversation, selectedConversationId, onSelectConversation]
  );

  if (collapsed) return null;

  return (
    <div
      className={cn(
        'border-border flex w-64 shrink-0 flex-col border-r',
        className
      )}
    >
      <div className="border-border flex shrink-0 items-center justify-between border-b p-2">
        <span className="text-muted-foreground text-sm font-medium">
          Conversations
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onPress={onCreateNew}
          aria-label="New conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-muted-foreground py-4 text-center text-sm">
            Loading…
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-sm">
            No conversations yet
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                selected={conv.id === selectedConversationId}
                onSelect={() => onSelectConversation(conv.id)}
                onDelete={() => handleDelete(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
      {selectedConversation && onUpdateConversation && (
        <ConversationMeta
          conversation={selectedConversation}
          onUpdate={onUpdateConversation}
        />
      )}
    </div>
  );
}

function ConversationMeta({
  conversation,
  onUpdate,
}: {
  conversation: ChatConversation;
  onUpdate: (
    id: string,
    updates: { projectId?: string; projectName?: string; tags?: string[] }
  ) => Promise<void>;
}) {
  const [projectName, setProjectName] = React.useState(
    conversation.projectName ?? ''
  );
  const [tagsStr, setTagsStr] = React.useState(
    conversation.tags?.join(', ') ?? ''
  );

  React.useEffect(() => {
    setProjectName(conversation.projectName ?? '');
    setTagsStr(conversation.tags?.join(', ') ?? '');
  }, [conversation.id, conversation.projectName, conversation.tags]);

  const handleBlur = React.useCallback(() => {
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (
      projectName !== (conversation.projectName ?? '') ||
      JSON.stringify(tags) !== JSON.stringify(conversation.tags ?? [])
    ) {
      onUpdate(conversation.id, {
        projectName: projectName || undefined,
        projectId: projectName ? projectName.replace(/\s+/g, '-') : undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
    }
  }, [
    conversation.id,
    conversation.projectName,
    conversation.tags,
    projectName,
    tagsStr,
    onUpdate,
  ]);

  return (
    <div className="border-border shrink-0 border-t p-2">
      <p className="text-muted-foreground mb-1 text-xs font-medium">
        Project
      </p>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        onBlur={handleBlur}
        placeholder="Project name"
        className="border-input bg-background mb-2 w-full rounded px-2 py-1 text-xs"
      />
      <p className="text-muted-foreground mb-1 text-xs font-medium">Tags</p>
      <input
        type="text"
        value={tagsStr}
        onChange={(e) => setTagsStr(e.target.value)}
        onBlur={handleBlur}
        placeholder="tag1, tag2"
        className="border-input bg-background w-full rounded px-2 py-1 text-xs"
      />
    </div>
  );
}
