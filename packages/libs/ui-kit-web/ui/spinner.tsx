'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import type * as React from 'react';

export interface SpinnerProps extends React.ComponentPropsWithoutRef<'div'> {
	size?: 'sm' | 'default' | 'lg';
}

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
	sm: 'size-4 border-2',
	default: 'size-5 border-2',
	lg: 'size-7 border-[3px]',
};

export function Spinner({
	className,
	size = 'default',
	...props
}: SpinnerProps) {
	return (
		<div
			data-slot="spinner"
			aria-label="Loading"
			role="status"
			className={cn(
				'inline-flex animate-spin rounded-full border-current border-r-transparent text-primary',
				sizeClasses[size],
				className
			)}
			{...props}
		/>
	);
}
