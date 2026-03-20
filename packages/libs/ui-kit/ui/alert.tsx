import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { useTheme } from '@react-navigation/native';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from './text';

const alertVariants = cva(
	'relative w-full rounded-lg border border-border bg-background p-4 shadow-2xs shadow-foreground/10',
	{
		variants: {
			variant: {
				default: '',
				destructive: 'border-destructive',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

function Alert({
	className,
	variant,
	children,
	icon: Icon,
	iconSize = 16,
	iconClassName,
	...props
}: ViewProps &
	VariantProps<typeof alertVariants> & {
		ref?: React.RefObject<View>;
		icon: LucideIcon;
		iconSize?: number;
		iconClassName?: string;
	}) {
	const { colors } = useTheme();
	return (
		<View
			role="alert"
			className={alertVariants({ variant, className })}
			{...props}
		>
			<View className="absolute top-4 left-3.5 -translate-y-0.5">
				<Icon
					size={iconSize}
					color={variant === 'destructive' ? colors.notification : colors.text}
				/>
			</View>
			{children}
		</View>
	);
}

function AlertTitle({
	className,
	...props
}: React.ComponentProps<typeof Text>) {
	return (
		<Text
			className={cn(
				'mb-1 pl-7 font-medium text-base text-foreground leading-none tracking-tight',
				className
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<typeof Text>) {
	return (
		<Text
			className={cn('pl-7 text-foreground text-sm leading-relaxed', className)}
			{...props}
		/>
	);
}

export { Alert, AlertDescription, AlertTitle };
