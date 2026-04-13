'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';

export function NativeSelect({
	className,
	...props
}: React.ComponentPropsWithoutRef<'select'>) {
	return (
		<select
			data-slot="native-select"
			className={cn(
				'h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
				className
			)}
			{...props}
		/>
	);
}

export function NativeSelectOption({
	...props
}: React.ComponentPropsWithoutRef<'option'>) {
	return <option data-slot="native-select-option" {...props} />;
}

export function NativeSelectOptGroup({
	...props
}: React.ComponentPropsWithoutRef<'optgroup'>) {
	return <optgroup data-slot="native-select-opt-group" {...props} />;
}
