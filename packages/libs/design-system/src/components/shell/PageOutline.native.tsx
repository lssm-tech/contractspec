'use client';

import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { resolvePageOutlineItems } from './outline';
import type { PageOutlineItem, PageOutlineLevel } from './types';

export interface PageOutlineProps {
	items: PageOutlineItem[];
	activeId?: string;
	onNavigate?: (item: PageOutlineItem) => void;
	ariaLabel?: string;
	variant?: 'rail' | 'compact' | 'floating';
	maxLevel?: PageOutlineLevel;
	className?: string;
}

export function PageOutline({
	items,
	activeId,
	onNavigate,
	ariaLabel = 'On this page',
	maxLevel = 3,
	className,
}: PageOutlineProps) {
	const flattened = React.useMemo(
		() => resolvePageOutlineItems(items, maxLevel),
		[items, maxLevel]
	);

	if (!flattened.length) {
		return null;
	}

	return (
		<View accessibilityLabel={ariaLabel} className={cn('gap-1', className)}>
			{flattened.map((item) => {
				const isActive = activeId === item.id;

				return (
					<Pressable
						key={`${item.id}-${item.resolvedLevel}`}
						accessibilityRole="link"
						accessibilityState={{ selected: isActive }}
						onPress={() => onNavigate?.(item)}
						className={cn(
							'rounded-xs px-2 py-2',
							item.resolvedLevel === 2 && 'pl-5',
							item.resolvedLevel === 3 && 'pl-8',
							isActive ? 'bg-muted' : undefined
						)}
					>
						<Text
							className={cn(
								'text-sm',
								isActive
									? 'font-semibold text-foreground'
									: 'text-muted-foreground'
							)}
						>
							{item.label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

export function usePageOutlineActiveItem(ids: string[]) {
	return ids[0];
}
