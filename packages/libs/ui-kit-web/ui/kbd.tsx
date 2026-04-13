'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import type * as React from 'react';

export function Kbd({
	className,
	...props
}: React.ComponentPropsWithoutRef<'kbd'>) {
	return (
		<kbd
			data-slot="kbd"
			className={cn(
				'inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border bg-muted px-1.5 font-medium text-[0.8rem] text-muted-foreground',
				className
			)}
			{...props}
		/>
	);
}

export function KbdGroup({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="kbd-group"
			className={cn('inline-flex items-center gap-1', className)}
			{...props}
		/>
	);
}
