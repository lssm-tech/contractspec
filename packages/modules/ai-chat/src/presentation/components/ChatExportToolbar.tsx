'use client';

import * as React from 'react';
import { Download, FileText, Copy, Check, Plus, GitFork } from 'lucide-react';
import { Button } from '@contractspec/lib.design-system';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
import type { ChatMessage, ChatConversation } from '../../core/message-types';
import {
  formatMessagesAsMarkdown,
  exportToFile,
} from '../../core/export-formatters';

export type ExportFormat = 'markdown' | 'txt' | 'json';

export interface ChatExportToolbarProps {
  messages: ChatMessage[];
  conversation?: ChatConversation | null;
  selectedIds: Set<string>;
  /** Called after export (for feedback/analytics) */
  onExported?: (format: ExportFormat, count: number) => void;
  /** Optional: show selection summary (e.g. "3 selected") */
  showSelectionSummary?: boolean;
  /** Optional: select all / clear selection buttons */
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  selectedCount?: number;
  totalCount?: number;
  /** New conversation callback */
  onCreateNew?: () => void;
  /** Fork conversation callback (optional messageId to fork from) */
  onFork?: (upToMessageId?: string) => Promise<string | null>;
}

/**
 * Toolbar for exporting chat conversations to Markdown, TXT, or JSON.
 * Exports selected messages when any are selected; otherwise exports all.
 */
export function ChatExportToolbar({
  messages,
  conversation,
  selectedIds,
  onExported,
  showSelectionSummary = true,
  onSelectAll,
  onClearSelection,
  selectedCount = selectedIds.size,
  totalCount = messages.length,
  onCreateNew,
  onFork,
}: ChatExportToolbarProps) {
  const [copied, setCopied] = React.useState(false);

  const toExport = React.useMemo(() => {
    if (selectedIds.size > 0) {
      const idSet = selectedIds;
      return messages.filter((m) => idSet.has(m.id));
    }
    return messages;
  }, [messages, selectedIds]);

  const handleExport = React.useCallback(
    (format: ExportFormat) => {
      exportToFile(toExport, format, conversation);
      onExported?.(format, toExport.length);
    },
    [toExport, conversation, onExported]
  );

  const handleCopy = React.useCallback(async () => {
    const content = formatMessagesAsMarkdown(toExport);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onExported?.('markdown', toExport.length);
  }, [toExport, onExported]);

  const disabled = messages.length === 0;
  const [forking, setForking] = React.useState(false);

  const handleFork = React.useCallback(
    async (upToMessageId?: string) => {
      if (!onFork) return;
      setForking(true);
      try {
        await onFork(upToMessageId);
      } finally {
        setForking(false);
      }
    },
    [onFork]
  );

  return (
    <div className="flex items-center gap-2">
      {onCreateNew && (
        <Button
          variant="outline"
          size="sm"
          onPress={onCreateNew}
          aria-label="New conversation"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      )}
      {onFork && messages.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          disabled={forking}
          onPress={() => handleFork()}
          aria-label="Fork conversation"
        >
          <GitFork className="h-4 w-4" />
          Fork
        </Button>
      )}
      {showSelectionSummary && selectedCount > 0 && (
        <span className="text-muted-foreground text-sm">
          {selectedCount} message{selectedCount !== 1 ? 's' : ''} selected
        </span>
      )}
      {onSelectAll && onClearSelection && totalCount > 0 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onPress={onSelectAll}
            className="text-xs"
          >
            Select all
          </Button>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onPress={onClearSelection}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label={
              selectedCount > 0
                ? 'Export selected messages'
                : 'Export conversation'
            }
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleExport('markdown')}
            disabled={disabled}
          >
            <FileText className="h-4 w-4" />
            Export as Markdown (.md)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleExport('txt')}
            disabled={disabled}
          >
            <FileText className="h-4 w-4" />
            Export as Plain Text (.txt)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleExport('json')}
            disabled={disabled}
          >
            <FileText className="h-4 w-4" />
            Export as JSON (.json)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleCopy()} disabled={disabled}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
