'use client';

import * as React from 'react';
import { ChatContainer } from './ChatContainer';
import { ChatMessage } from './ChatMessage';
import { ChatExportToolbar } from './ChatExportToolbar';
import { ThinkingLevelPicker } from './ThinkingLevelPicker';
import { useMessageSelection } from '../hooks/useMessageSelection';
import type {
  ChatMessage as ChatMessageType,
  ChatConversation,
} from '../../core/message-types';
import type { ThinkingLevel } from '../../core/thinking-levels';

export interface ChatWithExportProps {
  messages: ChatMessageType[];
  conversation?: ChatConversation | null;
  children?: React.ReactNode;
  className?: string;
  /** Show export toolbar */
  showExport?: boolean;
  /** Show message selection checkboxes */
  showMessageSelection?: boolean;
  /** Show scroll-to-bottom button */
  showScrollButton?: boolean;
  /** New conversation callback */
  onCreateNew?: () => void;
  /** Fork conversation callback */
  onFork?: (upToMessageId?: string) => Promise<string | null>;
  /** Edit message callback */
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
  /** Thinking level (instant, thinking, extra_thinking, max) */
  thinkingLevel?: ThinkingLevel;
  /** Called when thinking level changes */
  onThinkingLevelChange?: (level: ThinkingLevel) => void;
  /** Host-provided renderer for tool results with presentationKey */
  presentationRenderer?: (key: string, data?: unknown) => React.ReactNode;
  /** Host-provided renderer for tool results with formKey */
  formRenderer?: (
    key: string,
    defaultValues?: Record<string, unknown>
  ) => React.ReactNode;
}

/**
 * Chat container with export and message selection.
 * Composes ChatContainer, ChatExportToolbar, and useMessageSelection.
 */
export function ChatWithExport({
  messages,
  conversation,
  children,
  className,
  showExport = true,
  showMessageSelection = true,
  showScrollButton = true,
  onCreateNew,
  onFork,
  onEditMessage,
  thinkingLevel = 'thinking',
  onThinkingLevelChange,
  presentationRenderer,
  formRenderer,
}: ChatWithExportProps) {
  const messageIds = React.useMemo(() => messages.map((m) => m.id), [messages]);
  const selection = useMessageSelection(messageIds);

  const hasToolbar = showExport || showMessageSelection;
  const hasPicker = Boolean(onThinkingLevelChange);
  const headerContent =
    hasPicker || hasToolbar ? (
      <>
        {hasPicker && (
          <ThinkingLevelPicker
            value={thinkingLevel}
            onChange={onThinkingLevelChange!}
            compact
          />
        )}
        {hasToolbar && (
          <ChatExportToolbar
            messages={messages}
            conversation={conversation}
            selectedIds={selection.selectedIds}
            showSelectionSummary={showMessageSelection}
            onSelectAll={showMessageSelection ? selection.selectAll : undefined}
            onClearSelection={
              showMessageSelection ? selection.clearSelection : undefined
            }
            selectedCount={selection.selectedCount}
            totalCount={messages.length}
            onCreateNew={onCreateNew}
            onFork={onFork}
          />
        )}
      </>
    ) : null;

  return (
    <ChatContainer
      className={className}
      headerContent={headerContent}
      showScrollButton={showScrollButton}
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          selectable={showMessageSelection}
          selected={selection.isSelected(msg.id)}
          onSelect={showMessageSelection ? selection.toggle : undefined}
          editable={msg.role === 'user' && !!onEditMessage}
          onEdit={onEditMessage}
          presentationRenderer={presentationRenderer}
          formRenderer={formRenderer}
        />
      ))}
      {children}
    </ChatContainer>
  );
}
