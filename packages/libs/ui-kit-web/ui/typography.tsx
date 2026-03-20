import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { Slot } from '@radix-ui/react-slot';
import { Text, type TextProps } from './text';

type TypographyProps = TextProps & {
	asChild?: boolean;
};

function H1({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : 'h1';
	return (
		<Component
			role="heading"
			aria-level={1}
			className={cn(
				'web:select-text web:scroll-m-20 font-extrabold text-4xl text-foreground tracking-tight lg:text-5xl',
				className
			)}
			{...props}
		/>
	);
}

function H2({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : 'h2';
	return (
		<Component
			role="heading"
			aria-level={2}
			className={cn(
				'web:select-text web:scroll-m-20 border-border border-b pb-2 font-semibold text-3xl text-foreground tracking-tight first:mt-0',
				className
			)}
			{...props}
		/>
	);
}

function H3({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : 'h3';
	return (
		<Component
			role="heading"
			aria-level={3}
			className={cn(
				'web:select-text web:scroll-m-20 font-semibold text-2xl text-foreground tracking-tight',
				className
			)}
			{...props}
		/>
	);
}

function H4({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : 'h4';
	return (
		<Component
			role="heading"
			aria-level={4}
			className={cn(
				'web:select-text web:scroll-m-20 font-semibold text-foreground text-xl tracking-tight',
				className
			)}
			{...props}
		/>
	);
}

function P({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			className={cn('web:select-text text-base text-foreground', className)}
			{...props}
		/>
	);
}

function BlockQuote({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			role="blockquote"
			className={cn(
				'mt-6 native:mt-4 web:select-text border-border border-l-2 native:pl-3 pl-6 text-base text-foreground italic',
				className
			)}
			{...props}
		/>
	);
}

function Code({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			role="code"
			className={cn(
				'relative web:select-text rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-semibold text-foreground text-sm',
				className
			)}
			{...props}
		/>
	);
}

function Lead({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			className={cn('web:select-text text-muted-foreground text-xl', className)}
			{...props}
		/>
	);
}

function Large({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			className={cn(
				'web:select-text font-semibold text-foreground text-xl',
				className
			)}
			{...props}
		/>
	);
}

function Small({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			className={cn(
				'web:select-text font-medium text-foreground text-sm leading-none',
				className
			)}
			{...props}
		/>
	);
}

function Muted({ className, asChild = false, ...props }: TypographyProps) {
	const Component = asChild ? Slot : Text;
	return (
		<Component
			className={cn('web:select-text text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
