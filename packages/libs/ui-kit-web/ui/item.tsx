'use client';

import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const itemVariants = cva(
	'group/item flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-background hover:bg-muted/50',
				outline: 'border-border bg-background hover:bg-accent/50',
				muted: 'border-transparent bg-muted/50 hover:bg-muted',
			},
			size: {
				default: 'p-4',
				sm: 'gap-2 p-3',
				xs: 'gap-2 p-2.5',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const itemMediaVariants = cva(
	'flex shrink-0 items-center justify-center overflow-hidden rounded-md',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				icon: 'size-10 bg-muted text-foreground',
				image: 'size-10 bg-muted',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface ItemProps
	extends React.ComponentPropsWithoutRef<'div'>,
		VariantProps<typeof itemVariants> {
	asChild?: boolean;
}

export function Item({
	asChild = false,
	className,
	variant,
	size,
	...props
}: ItemProps) {
	const Component = asChild ? Slot : 'div';
	return (
		<Component
			data-slot="item"
			className={cn(itemVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export function ItemGroup({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-group"
			className={cn('flex flex-col gap-2', className)}
			{...props}
		/>
	);
}

export function ItemSeparator({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-separator"
			className={cn('h-px bg-border', className)}
			{...props}
		/>
	);
}

export function ItemMedia({
	className,
	variant,
	...props
}: React.ComponentPropsWithoutRef<'div'> &
	VariantProps<typeof itemMediaVariants>) {
	return (
		<div
			data-slot="item-media"
			className={cn(itemMediaVariants({ variant, className }))}
			{...props}
		/>
	);
}

export function ItemContent({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-content"
			className={cn('min-w-0 flex-1 space-y-1', className)}
			{...props}
		/>
	);
}

export function ItemHeader({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-header"
			className={cn(
				'font-medium text-muted-foreground text-xs uppercase',
				className
			)}
			{...props}
		/>
	);
}

export function ItemTitle({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-title"
			className={cn('font-medium text-sm', className)}
			{...props}
		/>
	);
}

export function ItemDescription({
	className,
	...props
}: React.ComponentPropsWithoutRef<'p'>) {
	return (
		<p
			data-slot="item-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

export function ItemActions({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-actions"
			className={cn('flex shrink-0 items-center gap-2', className)}
			{...props}
		/>
	);
}

export function ItemFooter({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			data-slot="item-footer"
			className={cn('pt-1 text-muted-foreground text-xs', className)}
			{...props}
		/>
	);
}
