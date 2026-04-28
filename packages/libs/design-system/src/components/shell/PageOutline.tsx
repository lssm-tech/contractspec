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
	variant?: 'rail' | 'compact';
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
				variant === 'rail'
					? 'sticky top-20 max-h-[calc(100svh-6rem)] overflow-auto border-l pl-4'
					: 'rounded-md border p-3',
				className
			)}
			{...props}
		>
			<ol className="m-0 list-none space-y-1 p-0">
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
									item.resolvedLevel === 2 && 'pl-5',
									item.resolvedLevel === 3 && 'pl-8 text-xs',
									isActive && 'bg-accent font-medium text-accent-foreground'
								)}
							>
								{item.label}
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
