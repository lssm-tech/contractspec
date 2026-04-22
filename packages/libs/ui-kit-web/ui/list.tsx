import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const listVariants = cva('flex flex-col', {
	variants: {
		type: {
			unordered: 'list-disc pl-6',
			ordered: 'list-decimal pl-6',
			none: 'list-none pl-0',
		},
		spacing: {
			none: 'gap-0',
			xs: 'gap-1',
			sm: 'gap-2',
			md: 'gap-3',
			lg: 'gap-4',
		},
	},
	defaultVariants: {
		type: 'unordered',
		spacing: 'sm',
	},
});

export type ListType = 'unordered' | 'ordered' | 'none';

export type ListProps = React.HTMLAttributes<
	HTMLUListElement | HTMLOListElement
> &
	VariantProps<typeof listVariants> & {
		type?: ListType;
		ref?: React.Ref<HTMLUListElement | HTMLOListElement>;
	};

function List({
	className,
	type = 'unordered',
	spacing,
	ref,
	...props
}: ListProps) {
	const Component = type === 'ordered' ? 'ol' : 'ul';
	return (
		<Component
			ref={ref as React.Ref<HTMLUListElement> & React.Ref<HTMLOListElement>}
			role={type === 'none' ? 'list' : undefined}
			className={cn(listVariants({ type, spacing }), className)}
			{...props}
		/>
	);
}

const listItemVariants = cva('', {
	variants: {
		tone: {
			default: '',
			muted: 'text-muted-foreground',
		},
	},
	defaultVariants: {
		tone: 'default',
	},
});

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> &
	VariantProps<typeof listItemVariants> & {
		ref?: React.Ref<HTMLLIElement>;
	};

function ListItem({ className, tone, ref, ...props }: ListItemProps) {
	return (
		<li
			ref={ref}
			className={cn(listItemVariants({ tone }), className)}
			{...props}
		/>
	);
}

export { List, ListItem, listItemVariants, listVariants };
