'use client';

import * as React from 'react';
import { ScrollArea } from '@contractspec/lib.ui-kit-web/ui/scroll-area';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Show scroll-to-bottom button when scrolled up */
  showScrollButton?: boolean;
}

/**
 * Container component for chat messages with scrolling
 */
export function ChatContainer({
  children,
  className,
  showScrollButton = true,
}: ChatContainerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = React.useState(false);

  // Auto-scroll to bottom when children change
  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Check if user has scrolled up
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;

    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [children]);

  // Track scroll position for scroll-to-bottom button
  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const container = event.currentTarget;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;
      setShowScrollDown(!isAtBottom);
    },
    []
  );

  const scrollToBottom = React.useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className={cn('relative flex flex-1 flex-col', className)}>
      <ScrollArea ref={scrollRef} className="flex-1" onScroll={handleScroll}>
        <div className="flex flex-col gap-4 p-4">{children}</div>
      </ScrollArea>

      {showScrollButton && showScrollDown && (
        <button
          onClick={scrollToBottom}
          className={cn(
            'absolute bottom-4 left-1/2 -translate-x-1/2',
            'bg-primary text-primary-foreground',
            'rounded-full px-3 py-1.5 text-sm font-medium shadow-lg',
            'hover:bg-primary/90 transition-colors',
            'flex items-center gap-1.5'
          )}
          aria-label="Scroll to bottom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          New messages
        </button>
      )}
    </div>
  );
}
