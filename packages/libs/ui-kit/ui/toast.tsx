import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as ToastPrimitive from '@rn-primitives/toast';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { Text, TextClassContext } from './text';

function Toast({
	className,
	...props
}: ToastPrimitive.RootProps & {
	ref?: React.RefObject<ToastPrimitive.RootRef>;
}) {
	return (
		<ToastPrimitive.Root
			className={cn(
				'rounded-lg border border-border bg-popover p-4 shadow-foreground/5 shadow-md',
				className
			)}
			{...props}
		/>
	);
}

function ToastTitle({
	className,
	...props
}: ToastPrimitive.TitleProps & {
	ref?: React.RefObject<ToastPrimitive.TitleRef>;
}) {
	return (
		<TextClassContext.Provider value="font-medium text-base text-popover-foreground">
			<ToastPrimitive.Title className={cn(className)} {...props} />
		</TextClassContext.Provider>
	);
}

function ToastDescription({
	className,
	...props
}: ToastPrimitive.DescriptionProps & {
	ref?: React.RefObject<ToastPrimitive.DescriptionRef>;
}) {
	return (
		<TextClassContext.Provider value="text-sm text-muted-foreground">
			<ToastPrimitive.Description className={cn(className)} {...props} />
		</TextClassContext.Provider>
	);
}

function ToastAction({
	className,
	children,
	...props
}: ToastPrimitive.ActionProps & {
	ref?: React.RefObject<ToastPrimitive.ActionRef>;
	children?: React.ReactNode;
}) {
	return (
		<TextClassContext.Provider value="font-medium text-sm text-foreground">
			<ToastPrimitive.Action
				className={cn(
					'mt-3 inline-flex min-h-9 items-center justify-center rounded-md border border-input px-3',
					className
				)}
				{...props}
			>
				{children}
			</ToastPrimitive.Action>
		</TextClassContext.Provider>
	);
}

function ToastClose({
	className,
	children,
	...props
}: ToastPrimitive.CloseProps & {
	ref?: React.RefObject<ToastPrimitive.CloseRef>;
	children?: React.ReactNode;
}) {
	return (
		<ToastPrimitive.Close
			className={cn(
				'absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md',
				className
			)}
			{...props}
		>
			{children ?? <X size={16} />}
		</ToastPrimitive.Close>
	);
}

function ToastViewport({
	className,
	children,
	...props
}: React.ComponentProps<typeof View>) {
	return (
		<View className={cn('flex flex-col gap-2', className)} {...props}>
			{children}
		</View>
	);
}

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

function ToastText({
	title,
	description,
}: {
	title?: React.ReactNode;
	description?: React.ReactNode;
}) {
	return (
		<View className="flex-1 gap-1">
			{title ? <Text className="font-medium text-base">{title}</Text> : null}
			{description ? (
				<Text className="text-muted-foreground text-sm">{description}</Text>
			) : null}
		</View>
	);
}

function ToastCard({
	title,
	description,
	action,
	open,
	onOpenChange,
}: {
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!open) {
		return null;
	}

	return (
		<Toast open={open} onOpenChange={onOpenChange}>
			<View className="flex-row items-start gap-3">
				<ToastText description={description} title={title} />
				{action}
				<ToastClose onPress={() => onOpenChange(false)} />
			</View>
		</Toast>
	);
}

function toastCard(args: Parameters<typeof ToastCard>[0]): {
	dismiss: () => void;
	element: React.ReactElement;
	id: string;
} {
	const id = Math.random().toString(36).slice(2);
	let open = args.open;
	return {
		id,
		dismiss: () => {
			open = false;
			args.onOpenChange(false);
		},
		element: (
			<ToastCard
				{...args}
				open={open}
				onOpenChange={(next) => {
					open = next;
					args.onOpenChange(next);
				}}
			/>
		),
	};
}

export {
	Toast,
	ToastAction,
	type ToastActionElement,
	ToastCard,
	ToastClose,
	ToastDescription,
	type ToastProps,
	ToastText,
	ToastTitle,
	ToastViewport,
	toastCard,
};
