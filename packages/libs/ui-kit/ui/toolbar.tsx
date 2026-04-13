import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as ToolbarPrimitive from '@rn-primitives/toolbar';
import * as React from 'react';
import { TextClassContext } from './text';

const ToolbarContext =
	React.createContext<ToolbarPrimitive.ToggleGroupProps | null>(null);

function Toolbar({
	className,
	...props
}: ToolbarPrimitive.RootProps & {
	ref?: React.RefObject<ToolbarPrimitive.RootRef>;
}) {
	return (
		<ToolbarPrimitive.Root
			className={cn('flex flex-row items-center gap-1', className)}
			{...props}
		/>
	);
}

function ToolbarButton({
	className,
	children,
	...props
}: ToolbarPrimitive.ButtonProps & {
	ref?: React.RefObject<ToolbarPrimitive.ButtonRef>;
	children?: React.ReactNode;
}) {
	return (
		<TextClassContext.Provider value="font-medium text-sm text-foreground">
			<ToolbarPrimitive.Button
				className={cn(
					'min-h-9 items-center justify-center rounded-md px-3 active:bg-accent',
					props.disabled && 'opacity-50',
					className
				)}
				{...props}
			>
				{children}
			</ToolbarPrimitive.Button>
		</TextClassContext.Provider>
	);
}

function ToolbarLink({
	className,
	children,
	...props
}: ToolbarPrimitive.LinkProps & {
	ref?: React.RefObject<ToolbarPrimitive.LinkRef>;
	children?: React.ReactNode;
}) {
	return (
		<TextClassContext.Provider value="font-medium text-sm text-primary">
			<ToolbarPrimitive.Link
				className={cn(
					'min-h-9 items-center justify-center rounded-md px-3',
					className
				)}
				{...props}
			>
				{children}
			</ToolbarPrimitive.Link>
		</TextClassContext.Provider>
	);
}

function ToolbarToggleGroup({
	className,
	children,
	...props
}: ToolbarPrimitive.ToggleGroupProps & {
	ref?: React.RefObject<ToolbarPrimitive.ToggleGroupRef>;
	children?: React.ReactNode;
}) {
	return (
		<ToolbarContext.Provider value={props}>
			<ToolbarPrimitive.ToggleGroup
				className={cn('flex flex-row items-center gap-1', className)}
				{...props}
			>
				{children}
			</ToolbarPrimitive.ToggleGroup>
		</ToolbarContext.Provider>
	);
}

function ToolbarToggleItem({
	className,
	children,
	...props
}: ToolbarPrimitive.ToggleItemProps & {
	ref?: React.RefObject<ToolbarPrimitive.ToggleItemRef>;
	children?: React.ReactNode;
}) {
	const context = React.useContext(ToolbarContext);
	const selected =
		context?.type === 'single'
			? context.value === props.value
			: Array.isArray(context?.value) && context.value.includes(props.value);

	return (
		<TextClassContext.Provider
			value={cn(
				'font-medium text-sm',
				selected ? 'text-accent-foreground' : 'text-foreground'
			)}
		>
			<ToolbarPrimitive.ToggleItem
				className={cn(
					'min-h-9 items-center justify-center rounded-md px-3 active:bg-accent',
					selected && 'bg-accent',
					props.disabled && 'opacity-50',
					className
				)}
				{...props}
			>
				{children}
			</ToolbarPrimitive.ToggleItem>
		</TextClassContext.Provider>
	);
}

function ToolbarSeparator({
	className,
	...props
}: ToolbarPrimitive.SeparatorProps & {
	ref?: React.RefObject<ToolbarPrimitive.SeparatorRef>;
}) {
	return (
		<ToolbarPrimitive.Separator
			className={cn('mx-1 h-5 w-px bg-border', className)}
			{...props}
		/>
	);
}

export {
	Toolbar,
	ToolbarButton,
	ToolbarLink,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
};
