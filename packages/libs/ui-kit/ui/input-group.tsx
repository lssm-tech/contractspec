import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { Input, type InputProps } from './input';
import { HStack, type HStackProps } from './stack';
import { Text, type TextProps } from './text';
import { Textarea, type TextareaProps } from './textarea';

export type InputGroupAddonAlign =
	| 'inline-start'
	| 'inline-end'
	| 'block-start'
	| 'block-end';

type SlotProps = {
	'data-slot'?: string;
};

type InputGroupProps = HStackProps &
	SlotProps & {
		'data-disabled'?: boolean | string;
	};

type InputGroupAddonProps = Omit<HStackProps, 'align'> &
	SlotProps & {
		align?: InputGroupAddonAlign;
		'data-align'?: InputGroupAddonAlign;
	};

function InputGroup({
	className,
	...props
}: InputGroupProps & {
	ref?: React.RefObject<React.ComponentRef<typeof HStack>>;
}) {
	return (
		<HStack
			className={cn(
				'w-full rounded-md border border-input bg-background',
				className
			)}
			gap="xs"
			width="full"
			{...props}
		/>
	);
}

function InputGroupAddon({
	align: _align = 'inline-start',
	className,
	...props
}: InputGroupAddonProps & {
	ref?: React.RefObject<React.ComponentRef<typeof HStack>>;
}) {
	return (
		<HStack
			className={cn('items-center px-2 py-1.5', className)}
			gap="xs"
			{...props}
		/>
	);
}

function InputGroupButton({
	className,
	...props
}: ButtonProps &
	SlotProps & { ref?: React.RefObject<React.ComponentRef<typeof Button>> }) {
	return (
		<Button
			className={cn('h-8 px-2 shadow-none', className)}
			size="sm"
			variant="ghost"
			{...props}
		/>
	);
}

function InputGroupText({
	className,
	...props
}: TextProps &
	SlotProps & { ref?: React.RefObject<React.ComponentRef<typeof Text>> }) {
	return (
		<Text
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

function InputGroupInput({
	className,
	...props
}: InputProps &
	SlotProps & { ref?: React.RefObject<React.ComponentRef<typeof Input>> }) {
	return (
		<Input
			className={cn('flex-1 border-0 bg-transparent shadow-none', className)}
			{...props}
		/>
	);
}

function InputGroupTextarea({
	className,
	...props
}: TextareaProps &
	SlotProps & { ref?: React.RefObject<React.ComponentRef<typeof Textarea>> }) {
	return (
		<Textarea
			className={cn('flex-1 border-0 bg-transparent shadow-none', className)}
			{...props}
		/>
	);
}

export {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
};
