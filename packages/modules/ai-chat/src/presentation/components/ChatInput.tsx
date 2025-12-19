'use client';

import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import { Textarea } from '@lssm/lib.design-system';
import { Button } from '@lssm/lib.design-system';
import { Send, Paperclip, X, Loader2, FileText, Code } from 'lucide-react';
import type { ChatAttachment } from '../../core/message-types';

export interface ChatInputProps {
  /** Called when a message is sent */
  onSend: (content: string, attachments?: ChatAttachment[]) => void;
  /** Whether input is disabled (e.g., during streaming) */
  disabled?: boolean;
  /** Whether currently loading/streaming */
  isLoading?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class name */
  className?: string;
  /** Show attachment button */
  showAttachments?: boolean;
  /** Max attachments allowed */
  maxAttachments?: number;
}

/**
 * Chat input component with attachment support
 */
export function ChatInput({
  onSend,
  disabled = false,
  isLoading = false,
  placeholder = 'Type a message...',
  className,
  showAttachments = true,
  maxAttachments = 5,
}: ChatInputProps) {
  const [content, setContent] = React.useState('');
  const [attachments, setAttachments] = React.useState<ChatAttachment[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canSend = content.trim().length > 0 || attachments.length > 0;

  const handleSubmit = React.useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!canSend || disabled || isLoading) return;

      onSend(content.trim(), attachments.length > 0 ? attachments : undefined);
      setContent('');
      setAttachments([]);

      // Focus back on textarea
      textareaRef.current?.focus();
    },
    [canSend, content, attachments, disabled, isLoading, onSend]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      // Submit on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleFileSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newAttachments: ChatAttachment[] = [];

      for (const file of Array.from(files)) {
        if (attachments.length + newAttachments.length >= maxAttachments) break;

        const content = await file.text();
        const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
        const isCode = [
          'ts',
          'tsx',
          'js',
          'jsx',
          'py',
          'go',
          'rs',
          'java',
        ].includes(extension);

        newAttachments.push({
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          type: isCode ? 'code' : 'file',
          name: file.name,
          content,
          mimeType: file.type,
          size: file.size,
        });
      }

      setAttachments((prev) => [...prev, ...newAttachments]);

      // Reset file input
      e.target.value = '';
    },
    [attachments.length, maxAttachments]
  );

  const removeAttachment = React.useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1',
                'bg-muted text-muted-foreground text-sm'
              )}
            >
              {attachment.type === 'code' ? (
                <Code className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              <span className="max-w-[150px] truncate">{attachment.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(attachment.id)}
                className="hover:text-foreground"
                aria-label={`Remove ${attachment.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment button */}
        {showAttachments && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".ts,.tsx,.js,.jsx,.json,.md,.txt,.py,.go,.rs,.java,.yaml,.yml"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Attach files"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => fileInputRef.current?.click()}
              disabled={disabled || attachments.length >= maxAttachments}
              aria-label="Attach files"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Text input */}
        <div className="relative flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'max-h-[200px] min-h-[44px] resize-none pr-12',
              'focus-visible:ring-1'
            )}
            rows={1}
            aria-label="Chat message"
          />
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={!canSend || disabled || isLoading}
          size="sm"
          aria-label={isLoading ? 'Sending...' : 'Send message'}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Helper text */}
      <p className="text-muted-foreground text-xs">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
