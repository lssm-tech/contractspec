'use client';

import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import { Pressable, Text, View } from 'react-native';
import type { ShellNotificationCenter, ShellNotificationItem } from './types';

export interface NativeShellNotificationsSectionProps {
	notifications: ShellNotificationCenter;
}

function isUnreadNotification(item: ShellNotificationItem) {
	return item.status === 'unread' || (!item.status && !item.readAt);
}

function formatNotificationTime(value?: string | Date) {
	if (!value) {
		return undefined;
	}

	return value instanceof Date ? value.toLocaleString() : value;
}

export function NativeShellNotificationsSection({
	notifications,
}: NativeShellNotificationsSectionProps) {
	const items = notifications.items ?? [];
	const unreadCount =
		notifications.unreadCount ??
		items.filter((item) => isUnreadNotification(item)).length;
	const emptyLabel = notifications.emptyLabel ?? 'No notifications';

	return (
		<View className="gap-2">
			<View className="flex-row items-center justify-between gap-3">
				<Text className="font-semibold text-sm">
					Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
				</Text>
				{items.length > 0 && notifications.onMarkAllRead ? (
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={
							notifications.markAllReadLabel ?? 'Mark all notifications as read'
						}
						onPress={notifications.onMarkAllRead}
						className="rounded-xs px-2 py-1"
					>
						<Text className="text-sm">Mark all read</Text>
					</Pressable>
				) : null}
			</View>
			{notifications.loading ? (
				<Text
					accessibilityLiveRegion="polite"
					className="text-muted-foreground"
				>
					Loading notifications...
				</Text>
			) : items.length ? (
				items.map((item) => (
					<NativeShellNotificationRow
						key={item.id}
						item={item}
						notifications={notifications}
					/>
				))
			) : (
				<Text className="text-muted-foreground">{emptyLabel}</Text>
			)}
		</View>
	);
}

function NativeShellNotificationRow({
	item,
	notifications,
}: {
	item: ShellNotificationItem;
	notifications: ShellNotificationCenter;
}) {
	const unread = isUnreadNotification(item);
	const timeLabel = formatNotificationTime(item.createdAt);
	const selectItem = () => notifications.onSelect?.(item);
	const markRead = () => notifications.onMarkRead?.(item);

	if (notifications.renderItem) {
		return (
			<View className={cn('rounded-xs border p-3', unread && 'bg-muted')}>
				{notifications.renderItem(item, {
					unread,
					onSelect: selectItem,
					onMarkRead: markRead,
				})}
			</View>
		);
	}

	return (
		<View
			className={cn(
				'flex-row items-start gap-2 rounded-xs border p-3',
				unread && 'bg-muted'
			)}
		>
			<Pressable
				accessibilityRole="button"
				onPress={selectItem}
				className="min-w-0 flex-1"
			>
				<Text className={cn('text-sm', unread && 'font-semibold')}>
					{unread ? '* ' : ''}
					{item.title}
				</Text>
				{item.body ? (
					<Text className="text-muted-foreground text-sm">{item.body}</Text>
				) : null}
				{item.category || timeLabel ? (
					<Text className="text-muted-foreground text-xs">
						{[item.category, timeLabel].filter(Boolean).join(' - ')}
					</Text>
				) : null}
			</Pressable>
			{unread && notifications.onMarkRead ? (
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={`Mark ${String(item.title)} as read`}
					onPress={markRead}
					className="rounded-xs px-2 py-1"
				>
					<Text className="text-sm">Read</Text>
				</Pressable>
			) : null}
		</View>
	);
}
