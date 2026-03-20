import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { VStack } from './stack';

const containerVariants = cva('items-center text-center', {
	variants: {
		density: {
			compact: 'gap-3 p-6',
			default: 'gap-4 p-8',
		},
	},
	defaultVariants: {
		density: 'default',
	},
});

export interface EmptyStateProps
	extends VariantProps<typeof containerVariants> {
	icon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	primaryAction?: React.ReactNode;
	secondaryAction?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon,
	title,
	description,
	primaryAction,
	secondaryAction,
	className,
	density,
}: EmptyStateProps) {
	return (
		<VStack className={cn(containerVariants({ density }), className)}>
			{icon ? (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					{/* Consumers pass their own icon; keep neutral backdrop */}
					<div className="flex items-center justify-center text-muted-foreground">
						{icon}
					</div>
				</div>
			) : null}

			<div>
				<h3 className="font-medium">{title}</h3>
				{description ? (
					<p className="text-base text-muted-foreground">{description}</p>
				) : null}
			</div>

			{(primaryAction || secondaryAction) && (
				<div className="flex items-center justify-center gap-2">
					{primaryAction}
					{secondaryAction}
				</div>
			)}
		</VStack>
	);
}
