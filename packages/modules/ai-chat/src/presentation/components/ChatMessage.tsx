'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Avatar, AvatarFallback } from '@contractspec/lib.ui-kit-web/ui/avatar';
import { Skeleton } from '@contractspec/lib.ui-kit-web/ui/skeleton';
import {
  Bot,
  User,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Wrench,
} from 'lucide-react';
import { Button } from '@contractspec/lib.design-system';
import type {
  ChatMessage as ChatMessageType,
  ChatSource,
  ChatToolCall,
} from '../../core/message-types';
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
 * Render text with markdown-style links [text](url)
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <a
        key={key++}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:no-underline"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Render message content with code blocks and markdown links
 */
function MessageContent({ content }: { content: string }) {
  const codeBlocks = extractCodeBlocks(content);

  if (codeBlocks.length === 0) {
    return (
      <p className="whitespace-pre-wrap">{renderInlineMarkdown(content)}</p>
    );
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
          {renderInlineMarkdown(before.trim())}
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
        {renderInlineMarkdown(remaining.trim())}
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

        {/* Sources / citations */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.sources.map((source: ChatSource) => (
              <a
                key={source.id}
                href={source.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground bg-muted inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                {source.title || source.url || source.id}
              </a>
            ))}
          </div>
        )}

        {/* Tool invocations */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.toolCalls.map((tc: ChatToolCall) => (
              <details
                key={tc.id}
                className="bg-muted border-border rounded-md border"
              >
                <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium">
                  <Wrench className="text-muted-foreground h-4 w-4" />
                  {tc.name}
                  <span
                    className={cn(
                      'ml-auto rounded px-1.5 py-0.5 text-xs',
                      tc.status === 'completed' &&
                        'bg-green-500/20 text-green-700 dark:text-green-400',
                      tc.status === 'error' &&
                        'bg-destructive/20 text-destructive',
                      tc.status === 'running' &&
                        'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                    )}
                  >
                    {tc.status}
                  </span>
                </summary>
                <div className="border-border border-t px-3 py-2 text-xs">
                  {Object.keys(tc.args).length > 0 && (
                    <div className="mb-2">
                      <span className="text-muted-foreground font-medium">
                        Input:
                      </span>
                      <pre className="bg-background mt-1 overflow-x-auto rounded p-2">
                        {JSON.stringify(tc.args, null, 2)}
                      </pre>
                    </div>
                  )}
                  {tc.result !== undefined && (
                    <div>
                      <span className="text-muted-foreground font-medium">
                        Output:
                      </span>
                      <pre className="bg-background mt-1 overflow-x-auto rounded p-2">
                        {typeof tc.result === 'object'
                          ? JSON.stringify(tc.result, null, 2)
                          : String(tc.result)}
                      </pre>
                    </div>
                  )}
                  {tc.error && (
                    <p className="text-destructive mt-1">{tc.error}</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
