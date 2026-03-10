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
  Wrench,
  Pencil,
  X,
} from 'lucide-react';
import { Button } from '@contractspec/lib.design-system';
import { Checkbox } from '@contractspec/lib.ui-kit-web/ui/checkbox';
import type {
  ChatMessage as ChatMessageType,
  ChatSource,
  ChatToolCall,
} from '../../core/message-types';
import type { ChatMessageComponents } from './component-types';
import { CodePreview } from './CodePreview';
import { ToolResultRenderer } from './ToolResultRenderer';
import { Reasoning, ReasoningTrigger, ReasoningContent } from './Reasoning';
import { Sources, SourcesTrigger, SourcesContent, Source } from './Sources';

export interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
  /** Show copy button */
  showCopy?: boolean;
  /** Show avatar */
  showAvatar?: boolean;
  /** Enable selection checkbox */
  selectable?: boolean;
  /** Whether this message is selected */
  selected?: boolean;
  /** Called when selection is toggled */
  onSelect?: (id: string) => void;
  /** Enable edit (user messages only) */
  editable?: boolean;
  /** Called when message is edited */
  onEdit?: (messageId: string, newContent: string) => void | Promise<void>;
  /** Host-provided renderer for tool results with presentationKey */
  presentationRenderer?: (key: string, data?: unknown) => React.ReactNode;
  /** Host-provided renderer for tool results with formKey */
  formRenderer?: (
    key: string,
    defaultValues?: Record<string, unknown>
  ) => React.ReactNode;
  /** Host-provided renderer for tool results with dataViewKey */
  dataViewRenderer?: (key: string, items?: unknown[]) => React.ReactNode;
  /** Override components (e.g. from ai-elements) for Reasoning, Sources, ChainOfThought */
  components?: ChatMessageComponents;
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
function toolStatusToCotStatus(
  status: ChatToolCall['status']
): 'complete' | 'active' | 'pending' {
  if (status === 'completed') return 'complete';
  if (status === 'running') return 'active';
  return 'pending';
}

export function ChatMessage({
  message,
  className,
  showCopy = true,
  showAvatar = true,
  selectable = false,
  selected = false,
  onSelect,
  editable = false,
  onEdit,
  presentationRenderer,
  formRenderer,
  dataViewRenderer,
  components: comps,
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

  const handleSelectChange = React.useCallback(
    (checked: boolean | 'indeterminate') => {
      if (checked !== 'indeterminate') onSelect?.(message.id);
    },
    [message.id, onSelect]
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(message.content);
  const editTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setEditContent(message.content);
  }, [message.content]);

  React.useEffect(() => {
    if (isEditing) {
      editTextareaRef.current?.focus();
    }
  }, [isEditing]);

  const handleStartEdit = React.useCallback(() => {
    setEditContent(message.content);
    setIsEditing(true);
  }, [message.content]);

  const handleSaveEdit = React.useCallback(async () => {
    const trimmed = editContent.trim();
    if (trimmed !== message.content) {
      await onEdit?.(message.id, trimmed);
    }
    setIsEditing(false);
  }, [editContent, message.id, message.content, onEdit]);

  const handleCancelEdit = React.useCallback(() => {
    setEditContent(message.content);
    setIsEditing(false);
  }, [message.content]);

  return (
    <div
      className={cn(
        'group flex gap-3',
        isUser && 'flex-row-reverse',
        className
      )}
    >
      {selectable && (
        <div
          className={cn(
            'flex shrink-0 items-start pt-1',
            'opacity-0 transition-opacity group-hover:opacity-100'
          )}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={handleSelectChange}
            aria-label={selected ? 'Deselect message' : 'Select message'}
          />
        </div>
      )}
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
          ) : isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                ref={editTextareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-background/50 min-h-[80px] w-full resize-y rounded-md border px-3 py-2 text-sm"
                rows={4}
                aria-label="Edit message"
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onPress={handleSaveEdit}
                  aria-label="Save edit"
                >
                  <Check className="h-3 w-3" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleCancelEdit}
                  aria-label="Cancel edit"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
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

          {editable && isUser && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onPress={handleStartEdit}
              aria-label="Edit message"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Reasoning (for models that support it) */}
        {message.reasoning &&
          (comps?.Reasoning ? (
            <comps.Reasoning isStreaming={isStreaming && !!message.reasoning}>
              {message.reasoning}
            </comps.Reasoning>
          ) : (
            <Reasoning
              isStreaming={isStreaming && !!message.reasoning}
              className="mt-2"
            >
              <ReasoningTrigger isStreaming={isStreaming} />
              <ReasoningContent>{message.reasoning}</ReasoningContent>
            </Reasoning>
          ))}

        {/* Sources / citations */}
        {message.sources &&
          message.sources.length > 0 &&
          (() => {
            const SourcesComp = comps?.Sources;
            const SourcesTriggerComp = comps?.SourcesTrigger;
            const SourceComp = comps?.Source;
            if (SourcesComp && SourcesTriggerComp && SourceComp) {
              return (
                <SourcesComp>
                  <SourcesTriggerComp count={message.sources.length} />
                  {message.sources.map((source: ChatSource) => (
                    <SourceComp
                      key={source.id}
                      href={source.url ?? '#'}
                      title={source.title || source.url || source.id}
                    />
                  ))}
                </SourcesComp>
              );
            }
            return (
              <Sources className="mt-2">
                <SourcesTrigger count={message.sources.length} />
                <SourcesContent>
                  {message.sources.map((source: ChatSource) => (
                    <Source
                      key={source.id}
                      href={source.url ?? '#'}
                      title={source.title || source.url || source.id}
                    />
                  ))}
                </SourcesContent>
              </Sources>
            );
          })()}

        {/* Tool invocations (ChainOfThought when override provided, else details) */}
        {message.toolCalls &&
          message.toolCalls.length > 0 &&
          (() => {
            const CotComp = comps?.ChainOfThought;
            const CotStepComp = comps?.ChainOfThoughtStep;
            if (CotComp && CotStepComp) {
              return (
                <CotComp defaultOpen={false} className="mt-2">
                  {message.toolCalls.map((tc: ChatToolCall) => (
                    <CotStepComp
                      key={tc.id}
                      label={tc.name}
                      description={
                        Object.keys(tc.args).length > 0
                          ? `Input: ${JSON.stringify(tc.args)}`
                          : undefined
                      }
                      status={toolStatusToCotStatus(tc.status)}
                    >
                      {tc.preliminary && tc.status === 'running' && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          Running…
                        </p>
                      )}
                      {(tc.result !== undefined || tc.nestedParts?.length) && (
                        <ToolResultRenderer
                          toolName={tc.name}
                          result={
                            tc.nestedParts?.length
                              ? { parts: tc.nestedParts }
                              : tc.result
                          }
                          presentationRenderer={presentationRenderer}
                          formRenderer={formRenderer}
                          dataViewRenderer={dataViewRenderer}
                          showRawFallback
                        />
                      )}
                      {tc.error && (
                        <p className="text-destructive mt-1 text-xs">
                          {tc.error}
                        </p>
                      )}
                    </CotStepComp>
                  ))}
                </CotComp>
              );
            }
            return (
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
                      {tc.preliminary && tc.status === 'running' && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          Running…
                        </p>
                      )}
                      {(tc.result !== undefined || tc.nestedParts?.length) && (
                        <ToolResultRenderer
                          toolName={tc.name}
                          result={
                            tc.nestedParts?.length
                              ? { parts: tc.nestedParts }
                              : tc.result
                          }
                          presentationRenderer={presentationRenderer}
                          formRenderer={formRenderer}
                          dataViewRenderer={dataViewRenderer}
                          showRawFallback
                        />
                      )}
                      {tc.error && (
                        <p className="text-destructive mt-1">{tc.error}</p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            );
          })()}
      </div>
    </div>
  );
}
