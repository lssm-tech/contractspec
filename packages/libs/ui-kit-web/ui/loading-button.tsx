import type { SharedLoadingButtonProps } from '@contractspec/lib.ui-kit-core/interfaces';
import React from 'react';
// import { ActivityIndicator } from 'react-native';
import type { ButtonProps } from './button';
import { Button } from './button';
import { HStack } from './stack';
import { Text } from './text';

export interface LoadingButtonProps
	extends SharedLoadingButtonProps,
		ButtonProps {
	isLoading?: boolean;
	loadingText?: string;
	children: React.ReactNode;
}

export function LoadingButton({
	isLoading = false,
	loadingText,
	children,
	disabled,
	...props
}: LoadingButtonProps) {
	return (
		<Button disabled={disabled || isLoading} {...props}>
			{isLoading ? (
				<HStack className="items-center gap-x-2">
					{/*<ActivityIndicator*/}
					{/*  size="small"*/}
					{/*  color={props.variant === 'outline' ? '#6b7280' : '#ffffff'}*/}
					{/*/>*/}
					<Text>{loadingText || 'Loading...'}</Text>
				</HStack>
			) : (
				children
			)}
		</Button>
	);
}
