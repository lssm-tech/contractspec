'use client';

import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppHeader } from '../organisms/AppHeader.native';
import type { AppShellProps } from './AppShell.types';
import { PageOutline } from './PageOutline.native';
import type { ShellNavItem, ShellNavSection } from './types';

function labelToString(label: React.ReactNode) {
	return typeof label === 'string' || typeof label === 'number'
		? String(label)
		: 'Item';
}

function flattenPrimaryItems(sections: ShellNavSection[]) {
	return sections
		.flatMap((section) => section.items)
		.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
		.slice(0, 5);
}

function isShellNavItemActive(item: ShellNavItem, activeHref?: string) {
	if (item.active) {
		return true;
	}

	if (!activeHref || !item.href) {
		return false;
	}

	return item.match === 'startsWith'
		? activeHref.startsWith(item.href)
		: activeHref === item.href;
}

function NativeNavItem({
	item,
	activeHref,
	onNavigate,
	depth = 0,
}: {
	item: ShellNavItem;
	activeHref?: string;
	onNavigate?: (item: ShellNavItem) => void;
	depth?: number;
}) {
	const active =
		item.active ||
		(Boolean(activeHref) &&
			Boolean(item.href) &&
			(item.match === 'startsWith'
				? activeHref?.startsWith(item.href ?? '')
				: activeHref === item.href));

	return (
		<View className="gap-1">
			<Pressable
				accessibilityRole="link"
				accessibilityState={{ selected: active }}
				onPress={() => {
					item.onSelect?.();
					onNavigate?.(item);
				}}
				className={cn(
					'rounded-xs px-2 py-2',
					depth > 0 && 'pl-5',
					active ? 'bg-muted' : undefined
				)}
			>
				<Text
					className={cn(
						'text-sm',
						active ? 'font-semibold text-foreground' : 'text-muted-foreground'
					)}
				>
					{item.label}
				</Text>
			</Pressable>
			{item.children?.map((child) => (
				<NativeNavItem
					key={child.key ?? child.href ?? labelToString(child.label)}
					item={child}
					activeHref={activeHref}
					onNavigate={onNavigate}
					depth={depth + 1}
				/>
			))}
		</View>
	);
}

export function AppShell({
	brand,
	logo,
	title,
	navigation = [],
	commands = [],
	breadcrumbs = [],
	pageOutline = [],
	activeHref,
	activeOutlineId,
	userMenu,
	topbarEnd,
	children,
	className,
	homeHref: _homeHref,
	topbarStart: _topbarStart,
	contentClassName,
	onNavigate,
}: AppShellProps) {
	const primaryItems = flattenPrimaryItems(navigation);
	const resolvedBrand = brand ?? logo ?? title;
	const menuContent = (
		<View className="gap-5">
			{breadcrumbs.length ? (
				<View className="gap-1">
					{breadcrumbs.map((item, index) => (
						<Text key={index} className="text-muted-foreground text-xs">
							{item.label}
						</Text>
					))}
				</View>
			) : null}
			{commands.length ? (
				<View className="gap-2">
					<Text className="font-semibold text-sm">Actions</Text>
					{commands.flatMap((group) =>
						group.items.map((item) => (
							<Pressable
								key={item.id}
								accessibilityRole="button"
								onPress={item.onSelect}
								className="rounded-xs px-2 py-2"
							>
								<Text>{item.label}</Text>
							</Pressable>
						))
					)}
				</View>
			) : null}
			{navigation.map((section, index) => (
				<View key={section.key ?? index} className="gap-2">
					{section.title ? (
						<Text className="font-semibold text-muted-foreground text-xs uppercase">
							{section.title}
						</Text>
					) : null}
					{section.items.map((item) => (
						<NativeNavItem
							key={item.key ?? item.href ?? labelToString(item.label)}
							item={item}
							activeHref={activeHref}
							onNavigate={onNavigate}
						/>
					))}
				</View>
			))}
			{pageOutline.length ? (
				<View className="gap-2">
					<Text className="font-semibold text-sm">On this page</Text>
					<PageOutline items={pageOutline} activeId={activeOutlineId} />
				</View>
			) : null}
			{userMenu}
		</View>
	);

	return (
		<View className={cn('min-h-full bg-background', className)}>
			<AppHeader
				logo={resolvedBrand}
				toolbarRight={topbarEnd}
				menuContent={menuContent}
				bottomTabs={primaryItems.map((item) => ({
					key: item.key ?? item.href ?? labelToString(item.label),
					label: labelToString(item.label),
					icon: item.icon,
					active: isShellNavItemActive(item, activeHref),
					onPress: () => {
						item.onSelect?.();
						onNavigate?.(item);
					},
				}))}
			/>
			<View className={cn('flex-1 px-4 py-5', contentClassName)}>
				{children}
			</View>
		</View>
	);
}
