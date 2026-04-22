import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { type ButtonProps, buttonVariants } from './button';
import { HStack, hStackVariants } from './stack';

function Pagination({
	className,
	...props
}: React.ComponentPropsWithoutRef<'nav'>) {
	return (
		<HStack
			as="nav"
			role="navigation"
			aria-label="pagination"
			justify="center"
			wrap="nowrap"
			className={cn('mx-auto w-full', className)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	ref,
	...props
}: React.ComponentPropsWithoutRef<'ul'> & {
	ref?: React.Ref<HTMLUListElement>;
}) {
	return (
		<ul
			ref={ref}
			className={cn(
				hStackVariants({ align: 'center', gap: 'xs', wrap: 'nowrap' }),
				className
			)}
			{...props}
		/>
	);
}

function PaginationItem({
	className,
	ref,
	...props
}: React.ComponentPropsWithoutRef<'li'> & {
	ref?: React.Ref<HTMLLIElement>;
}) {
	return <li ref={ref} className={cn('', className)} {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
	React.ComponentPropsWithoutRef<'a'>;

function PaginationLink({
	className,
	isActive,
	size = 'icon',
	...props
}: PaginationLinkProps) {
	return (
		<a
			aria-current={isActive ? 'page' : undefined}
			className={cn(
				buttonVariants({
					variant: isActive ? 'outline' : 'ghost',
					size,
				}),
				className
			)}
			{...props}
		/>
	);
}

function PaginationPrevious({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="default"
			className={cn('gap-1 pl-2.5', className)}
			{...props}
		>
			<ChevronLeft className="h-4 w-4" />
			<span>Previous</span>
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="default"
			className={cn('gap-1 pr-2.5', className)}
			{...props}
		>
			<span>Next</span>
			<ChevronRight className="h-4 w-4" />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentPropsWithoutRef<'span'>) {
	return (
		<span
			aria-hidden
			className={cn(
				hStackVariants({
					align: 'center',
					gap: 'none',
					justify: 'center',
					wrap: 'nowrap',
				}),
				'h-9 w-9',
				className
			)}
			{...props}
		>
			<MoreHorizontal className="h-4 w-4" />
			<span className="sr-only">More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
