'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import { resolvePageOutlineItems } from './outline';
import type { PageOutlineItem, PageOutlineLevel } from './types';

export interface PageOutlineProps extends React.HTMLAttributes<HTMLElement> {
	items: PageOutlineItem[];
	activeId?: string;
	onNavigate?: (item: PageOutlineItem) => void;
	ariaLabel?: string;
	variant?: 'rail' | 'compact' | 'floating';
	maxLevel?: PageOutlineLevel;
}

export function PageOutline({
	items,
	activeId,
	onNavigate,
	ariaLabel = 'On this page',
	variant = 'rail',
	maxLevel = 3,
	className,
	...props
}: PageOutlineProps) {
	const flattened = React.useMemo(
		() => resolvePageOutlineItems(items, maxLevel),
		[items, maxLevel]
	);

	if (!flattened.length) {
		return null;
	}

	return (
		<nav
			aria-label={ariaLabel}
			className={cn(
				'text-muted-foreground text-sm',
				variant === 'rail' &&
					'sticky top-20 max-h-[calc(100svh-6rem)] overflow-auto border-l pl-4',
				variant === 'compact' && 'rounded-md border p-3',
				variant === 'floating' &&
					'group fixed top-24 right-4 z-20 hidden max-h-[calc(100svh-7rem)] w-10 overflow-hidden rounded-md border border-transparent bg-background/70 py-2 backdrop-blur-xs transition-[width,background-color,border-color,box-shadow] duration-200 focus-within:w-64 focus-within:border-border focus-within:bg-background/95 focus-within:shadow-md hover:w-64 hover:border-border hover:bg-background/95 hover:shadow-md xl:block',
				className
			)}
			{...props}
		>
			<ol
				className={cn(
					'm-0 list-none space-y-1 p-0',
					variant === 'floating' && 'w-64 pr-2'
				)}
			>
				{flattened.map((item) => {
					const isActive = activeId === item.id;
					const href = item.href ?? `#${item.id}`;

					return (
						<li key={`${item.id}-${item.resolvedLevel}`}>
							<a
								href={href}
								aria-current={isActive ? 'location' : undefined}
								onClick={() => onNavigate?.(item)}
								className={cn(
									'block rounded-xs px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground',
									variant === 'floating' &&
										'grid grid-cols-[1rem_minmax(0,1fr)] items-center gap-2 overflow-hidden',
									variant !== 'floating' && item.resolvedLevel === 2 && 'pl-5',
									variant !== 'floating' &&
										item.resolvedLevel === 3 &&
										'pl-8 text-xs',
									variant === 'floating' &&
										item.resolvedLevel === 3 &&
										'text-xs',
									isActive && 'bg-accent font-medium text-accent-foreground'
								)}
							>
								{variant === 'floating' ? (
									<>
										<span
											aria-hidden="true"
											className={cn(
												'h-1.5 w-1.5 rounded-full bg-border transition-colors',
												item.resolvedLevel === 2 && 'ml-1',
												item.resolvedLevel === 3 && 'ml-2 h-1 w-1',
												isActive && 'bg-accent-foreground'
											)}
										/>
										<span className="truncate opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
											{item.label}
										</span>
									</>
								) : (
									item.label
								)}
							</a>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export function usePageOutlineActiveItem(
	ids: string[],
	options?: IntersectionObserverInit
) {
	const [activeId, setActiveId] = React.useState<string | undefined>(ids[0]);

	React.useEffect(() => {
		if (!ids.length || typeof IntersectionObserver === 'undefined') {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

				if (visible?.target.id) {
					setActiveId(visible.target.id);
				}
			},
			options ?? {
				rootMargin: '-20% 0px -65% 0px',
				threshold: [0, 0.25, 0.5, 1],
			}
		);

		for (const id of ids) {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		}

		return () => observer.disconnect();
	}, [ids, options]);

	return activeId;
}
