'use client';

import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import { Avatar, AvatarFallback } from '@lssm/lib.ui-kit-web/ui/avatar';
import { Skeleton } from '@lssm/lib.ui-kit-web/ui/skeleton';
import { Bot, User, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@lssm/lib.design-system';
import type { ChatMessage as ChatMessageType } from '../../core/message-types';
import { CodePreview } from './CodePreview';

export interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
  /** Show copy button */
  showCopy?: boolean;
  /** Show avatar */
  showAvatar?: boolean;
}

/**
 * Extract code blocks from message content
 */
function extractCodeBlocks(
  content: string
): { language: string; code: string; raw: string }[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: { language: string; code: string; raw: string }[] = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] ?? 'text',
      code: match[2] ?? '',
      raw: match[0],
    });
  }

  return blocks;
}

/**
 * Render message content with code blocks
 */
function MessageContent({ content }: { content: string }) {
  const codeBlocks = extractCodeBlocks(content);

  if (codeBlocks.length === 0) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  // Split content by code blocks and render
  let remaining = content;
  const parts: React.ReactNode[] = [];
  let key = 0;

  for (const block of codeBlocks) {
    const [before, after] = remaining.split(block.raw);
    if (before) {
      parts.push(
        <p key={key++} className="whitespace-pre-wrap">
          {before.trim()}
        </p>
      );
    }
    parts.push(
      <CodePreview
        key={key++}
        code={block.code}
        language={block.language}
        className="my-2"
      />
    );
    remaining = after ?? '';
  }

  if (remaining.trim()) {
    parts.push(
      <p key={key++} className="whitespace-pre-wrap">
        {remaining.trim()}
      </p>
    );
  }

  return <>{parts}</>;
}

/**
 * Chat message component
 */
export function ChatMessage({
  message,
  className,
  showCopy = true,
  showAvatar = true,
}: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);

  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isStreaming = message.status === 'streaming';

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  return (
    <div
      className={cn(
        'group flex gap-3',
        isUser && 'flex-row-reverse',
        className
      )}
    >
      {showAvatar && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            className={cn(
              isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn('flex max-w-[80%] flex-col gap-1', isUser && 'items-end')}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground',
            isError && 'border-destructive bg-destructive/10 border'
          )}
        >
          {isError && message.error ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-destructive font-medium">
                  {message.error.code}
                </p>
                <p className="text-muted-foreground text-sm">
                  {message.error.message}
                </p>
              </div>
            </div>
          ) : isStreaming && !message.content ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>

        {/* Message meta */}
        <div
          className={cn(
            'flex items-center gap-2 text-xs',
            'text-muted-foreground opacity-0 transition-opacity',
            'group-hover:opacity-100'
          )}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {message.usage && (
            <span>
              {message.usage.inputTokens + message.usage.outputTokens} tokens
            </span>
          )}

          {showCopy && !isUser && message.content && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onPress={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy message'}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        {/* Reasoning (for models that support it) */}
        {message.reasoning && (
          <details className="text-muted-foreground mt-2 text-sm">
            <summary className="cursor-pointer hover:underline">
              View reasoning
            </summary>
            <div className="bg-muted mt-1 rounded-md p-2">
              <p className="whitespace-pre-wrap">{message.reasoning}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
