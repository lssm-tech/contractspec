import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';
import { Input, type InputProps } from './input';
import { Box, type BoxProps, HStack, type HStackProps } from './stack';
import { Text } from './text';

type InputOTPProps = InputProps & {
	containerClassName?: string;
};

function InputOTP({
	className,
	containerClassName,
	...props
}: InputOTPProps & {
	ref?: React.RefObject<React.ComponentRef<typeof Input>>;
}) {
	return (
		<HStack className={cn('items-center', containerClassName)} width="full">
			<Input className={className} {...props} />
		</HStack>
	);
}

function InputOTPGroup({
	className,
	...props
}: HStackProps & {
	ref?: React.RefObject<React.ComponentRef<typeof HStack>>;
}) {
	return <HStack className={cn('items-center', className)} {...props} />;
}

function InputOTPSlot({
	index: _index,
	className,
	...props
}: BoxProps & {
	index: number;
	ref?: React.RefObject<React.ComponentRef<typeof Box>>;
}) {
	return (
		<Box
			className={cn(
				'h-10 w-10 items-center justify-center rounded-md border border-input',
				className
			)}
			{...props}
		/>
	);
}

function InputOTPSeparator({
	className,
	children,
	...props
}: BoxProps & {
	ref?: React.RefObject<React.ComponentRef<typeof Box>>;
}) {
	return (
		<Box
			className={cn('items-center justify-center px-1', className)}
			{...props}
		>
			{children ?? <Text>-</Text>}
		</Box>
	);
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
