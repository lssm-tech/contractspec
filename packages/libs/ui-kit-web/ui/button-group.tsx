'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import type * as React from 'react';

export interface ButtonGroupProps
	extends React.ComponentPropsWithoutRef<'div'> {
	orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({
	className,
	orientation = 'horizontal',
	...props
}: ButtonGroupProps) {
	return (
		<div
			data-slot="button-group"
			data-orientation={orientation}
			className={cn(
				'inline-flex items-stretch overflow-hidden rounded-md',
				'data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
				'[&>[data-slot=button]:not(:first-child)]:rounded-none',
				'[&>[data-slot=button]:first-child:not(:last-child)]:rounded-r-none',
				'[&>[data-slot=button]:last-child:not(:first-child)]:rounded-l-none',
				'[&>[data-slot=button]:not(:last-child)]:border-r-0',
				'data-[orientation=vertical]:[&>[data-slot=button]:not(:last-child)]:border-r',
				'data-[orientation=vertical]:[&>[data-slot=button]:not(:last-child)]:border-b-0',
				'data-[orientation=vertical]:[&>[data-slot=button]:first-child:not(:last-child)]:rounded-b-none',
				'data-[orientation=vertical]:[&>[data-slot=button]:last-child:not(:first-child)]:rounded-t-none',
				className
			)}
			{...props}
		/>
	);
}
