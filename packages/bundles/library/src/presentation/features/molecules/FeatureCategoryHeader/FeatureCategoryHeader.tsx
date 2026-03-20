'use client';

import { StatusChip } from '@contractspec/lib.design-system';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Boxes, ChevronDown } from 'lucide-react';
import * as React from 'react';

export interface FeatureCategoryHeaderProps {
	/** Category/domain title */
	title: string;
	/** Number of features in this category */
	count: number;
	/** Icon for the category */
	icon?: React.ReactNode;
	/** Whether the section is collapsed */
	isCollapsed?: boolean;
	/** Toggle collapse state */
	onToggle?: () => void;
	/** Additional class name */
	className?: string;
}

/**
 * Category/domain section header for grouped feature display.
 */
export function FeatureCategoryHeader({
	title,
	count,
	icon,
	isCollapsed = false,
	onToggle,
	className,
}: FeatureCategoryHeaderProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className={cn(
				'flex w-full items-center justify-between rounded-lg px-4 py-3',
				'bg-muted/30 transition-colors hover:bg-muted/50',
				'group cursor-pointer',
				className
			)}
		>
			<HStack gap="sm" className="items-center">
				<div className="text-muted-foreground transition-colors group-hover:text-foreground">
					{icon || <Boxes className="h-5 w-5" />}
				</div>
				<span className="font-semibold text-lg capitalize transition-colors group-hover:text-primary">
					{title}
				</span>
				<StatusChip
					tone="neutral"
					label={`${count} ${count === 1 ? 'feature' : 'features'}`}
					size="sm"
				/>
			</HStack>
			<ChevronDown
				className={cn(
					'h-5 w-5 text-muted-foreground transition-transform duration-200',
					isCollapsed && '-rotate-90'
				)}
			/>
		</button>
	);
}
