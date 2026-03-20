import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View } from 'react-native';
import { VStack } from './stack';
import { Text } from './text';
import { H3 } from './typography';

const containerVariants = cva('items-center text-center', {
	variants: {
		density: {
			compact: 'gap-3 p-6',
			default: 'gap-4 p-8',
		},
	},
	defaultVariants: {
		density: 'default',
	},
});

export interface EmptyStateProps
	extends VariantProps<typeof containerVariants> {
	icon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	primaryAction?: React.ReactNode;
	secondaryAction?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon,
	title,
	description,
	primaryAction,
	secondaryAction,
	className,
	density,
}: EmptyStateProps) {
	return (
		<VStack className={cn(containerVariants({ density }), className)}>
			{icon ? (
				<View className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					{/* Consumers pass their own icon; keep neutral backdrop */}
					<View className="flex items-center justify-center text-muted-foreground">
						{icon}
					</View>
				</View>
			) : null}

			<View>
				<H3 className="font-medium">{title}</H3>
				{description ? (
					<View className="text-base text-muted-foreground">
						<Text>{description}</Text>
					</View>
				) : null}
			</View>

			{(primaryAction || secondaryAction) && (
				<View className="flex items-center justify-center gap-2">
					{primaryAction}
					{secondaryAction}
				</View>
			)}
		</VStack>
	);
}
