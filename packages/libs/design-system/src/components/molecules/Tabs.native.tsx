import {
	Tabs as NativeTabs,
	TabsContent as NativeTabsContent,
	TabsList as NativeTabsList,
	TabsTrigger as NativeTabsTrigger,
} from '@contractspec/lib.ui-kit/ui/tabs';
import * as React from 'react';
import {
	type ThemedPrimitiveProps,
	useThemedPrimitive,
} from '../primitives/themed';

export interface TabsProps extends ThemedPrimitiveProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	children?: React.ReactNode;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl';
	activationMode?: 'automatic' | 'manual';
}

export interface TabsListProps extends ThemedPrimitiveProps {
	className?: string;
	children?: React.ReactNode;
}

export interface TabsTriggerProps extends ThemedPrimitiveProps {
	value: string;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export interface TabsContentProps extends ThemedPrimitiveProps {
	value: string;
	forceMount?: boolean;
	className?: string;
	children?: React.ReactNode;
}

export function Tabs({
	value,
	defaultValue,
	onValueChange,
	className,
	children,
	orientation,
	dir,
	activationMode,
	componentKey,
	themeVariant,
}: TabsProps) {
	console.log('tabs mobile');
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Tabs',
		componentKey,
		themeVariant,
		className,
	});
	const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
	const isControlled = value !== undefined;
	const resolvedValue = isControlled ? value : internalValue;

	const handleValueChange = React.useCallback(
		(nextValue: string) => {
			if (!isControlled) {
				setInternalValue(nextValue);
			}
			onValueChange?.(nextValue);
		},
		[onValueChange, setInternalValue]
	);

	return (
		<NativeTabs
			{...themed.props}
			value={resolvedValue}
			onValueChange={handleValueChange}
			className={themed.className}
			orientation={orientation}
			dir={dir}
			activationMode={activationMode}
		>
			{children}
		</NativeTabs>
	);
}

export function TabsList({
	className,
	children,
	componentKey,
	themeVariant,
}: TabsListProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'TabsList',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<NativeTabsList {...themed.props} className={themed.className}>
			{children}
		</NativeTabsList>
	);
}

export function TabsTrigger({
	value,
	disabled,
	className,
	children,
	componentKey,
	themeVariant,
}: TabsTriggerProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'TabsTrigger',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<NativeTabsTrigger
			{...themed.props}
			value={value}
			disabled={disabled}
			className={themed.className}
		>
			{children}
		</NativeTabsTrigger>
	);
}

export function TabsContent({
	value,
	forceMount,
	className,
	children,
	componentKey,
	themeVariant,
}: TabsContentProps) {
	const themed = useThemedPrimitive({
		defaultComponentKey: 'TabsContent',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<NativeTabsContent
			{...themed.props}
			value={value}
			forceMount={forceMount ? true : undefined}
			className={themed.className}
		>
			{children}
		</NativeTabsContent>
	);
}
