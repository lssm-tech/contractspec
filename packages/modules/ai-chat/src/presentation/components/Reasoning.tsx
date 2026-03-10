'use client';

import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@contractspec/lib.ui-kit-web/ui/collapsible';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface ReasoningProps {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Collapsible reasoning display. Auto-opens during streaming, closes when done.
 */
export function Reasoning({
  isStreaming = false,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: ReasoningProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const prevStreamingRef = React.useRef(isStreaming);
  const isControlled = open !== undefined;

  React.useEffect(() => {
    if (isStreaming) {
      if (isControlled) {
        onOpenChange?.(true);
      } else {
        setInternalOpen(true);
      }
    } else if (prevStreamingRef.current) {
      if (isControlled) {
        onOpenChange?.(false);
      } else {
        setInternalOpen(false);
      }
    }
    prevStreamingRef.current = isStreaming;
  }, [isStreaming, isControlled, onOpenChange]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setInternalOpen(next);
      }
    },
    [isControlled, onOpenChange]
  );

  return (
    <Collapsible
      open={isControlled ? open : internalOpen}
      onOpenChange={handleOpenChange}
      className={cn('w-full', className)}
    >
      {children}
    </Collapsible>
  );
}

export interface ReasoningTriggerProps {
  children?: React.ReactNode;
  isStreaming?: boolean;
  className?: string;
}

export function ReasoningTrigger({
  children,
  isStreaming = false,
  className,
}: ReasoningTriggerProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        'text-muted-foreground hover:bg-muted hover:text-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        className
      )}
    >
      {isStreaming && (
        <span
          className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"
          aria-hidden
        />
      )}
      {children ?? (isStreaming ? 'Thinking...' : 'View reasoning')}
    </CollapsibleTrigger>
  );
}

export interface ReasoningContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ReasoningContent({
  children,
  className,
}: ReasoningContentProps) {
  return (
    <CollapsibleContent>
      <div
        className={cn(
          'text-muted-foreground bg-muted mt-1 rounded-md p-2 text-sm',
          className
        )}
      >
        <p className="whitespace-pre-wrap">{children}</p>
      </div>
    </CollapsibleContent>
  );
}
