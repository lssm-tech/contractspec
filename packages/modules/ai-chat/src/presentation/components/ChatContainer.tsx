'use client';

import { ScrollArea } from '@contractspec/lib.ui-kit-web/ui/scroll-area';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';

export interface ChatContainerProps {
	children: React.ReactNode;
	className?: string;
	/** Show scroll-to-bottom button when scrolled up */
	showScrollButton?: boolean;
	/** Optional header content (e.g. export toolbar) */
	headerContent?: React.ReactNode;
}

/**
 * Container component for chat messages with scrolling
 */
export function ChatContainer({
	children,
	className,
	showScrollButton = true,
	headerContent,
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
			{headerContent && (
				<div className="flex shrink-0 items-center justify-end gap-2 border-border border-b px-4 py-2">
					{headerContent}
				</div>
			)}
			<ScrollArea ref={scrollRef} className="flex-1" onScroll={handleScroll}>
				<div className="flex flex-col gap-4 p-4">{children}</div>
			</ScrollArea>

			{showScrollButton && showScrollDown && (
				<button
					onClick={scrollToBottom}
					className={cn(
						'absolute bottom-4 left-1/2 -translate-x-1/2',
						'bg-primary text-primary-foreground',
						'rounded-full px-3 py-1.5 font-medium text-sm shadow-lg',
						'transition-colors hover:bg-primary/90',
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
