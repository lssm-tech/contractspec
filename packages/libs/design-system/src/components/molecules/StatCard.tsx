'use client';

import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const statVariants = cva('', {
	variants: {
		emphasis: {
			default: '',
			subtle: 'bg-muted/20',
			strong: 'bg-primary/5',
		},
		density: {
			compact: 'p-3',
			comfortable: 'p-4 md:p-5',
		},
	},
	defaultVariants: { emphasis: 'default', density: 'comfortable' },
});

export type StatCardProps = React.ComponentProps<typeof Card> &
	VariantProps<typeof statVariants> & {
		label: React.ReactNode;
		value: React.ReactNode;
		hint?: React.ReactNode;
		icon?: React.ReactNode;
	};

export function StatCard({
	label,
	value,
	hint,
	icon,
	emphasis,
	density,
	className,
	...props
}: StatCardProps) {
	return (
		<Card className={className} {...props}>
			<CardContent
				className={cn(
					'flex items-center gap-3',
					statVariants({ emphasis, density })
				)}
			>
				{icon && <div className="text-muted-foreground">{icon}</div>}
				<div className="min-w-0">
					<div className="text-base text-muted-foreground">{label}</div>
					<div className="truncate font-semibold text-2xl">{value}</div>
					{hint && (
						<div className="text-base text-muted-foreground">{hint}</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function StatCardGroup({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4',
				className
			)}
		>
			{children}
		</div>
	);
}
