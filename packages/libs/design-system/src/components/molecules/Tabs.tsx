'use client';

import {
	Tabs as WebTabs,
	TabsContent as WebTabsContent,
	TabsList as WebTabsList,
	TabsTrigger as WebTabsTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tabs';
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
	console.log('tabs web');
	const themed = useThemedPrimitive({
		defaultComponentKey: 'Tabs',
		componentKey,
		themeVariant,
		className,
	});

	return (
		<WebTabs
			{...themed.props}
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			className={themed.className}
			orientation={orientation}
			dir={dir}
			activationMode={activationMode}
		>
			{children}
		</WebTabs>
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
		<WebTabsList {...themed.props} className={themed.className}>
			{children}
		</WebTabsList>
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
		<WebTabsTrigger
			{...themed.props}
			value={value}
			disabled={disabled}
			className={themed.className}
		>
			{children}
		</WebTabsTrigger>
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
		<WebTabsContent
			{...themed.props}
			value={value}
			forceMount={forceMount ? true : undefined}
			className={themed.className}
		>
			{children}
		</WebTabsContent>
	);
}
