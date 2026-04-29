'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { BellIcon, CheckIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '../atoms/Button';
import type { ShellNotificationCenter, ShellNotificationItem } from './types';

export interface ShellNotificationsProps {
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

export function ShellNotifications({ notifications }: ShellNotificationsProps) {
	const [open, setOpen] = React.useState(false);
	const panelRef = React.useRef<HTMLDivElement>(null);
	const triggerRef = React.useRef<HTMLSpanElement>(null);
	const items = notifications.items ?? [];
	const unreadCount =
		notifications.unreadCount ??
		items.filter((item) => isUnreadNotification(item)).length;
	const label = notifications.label ?? 'Notifications';
	const emptyLabel = notifications.emptyLabel ?? 'No notifications';
	const markAllReadLabel =
		notifications.markAllReadLabel ?? 'Mark all notifications as read';

	const setNotificationOpen = React.useCallback(
		(nextOpen: boolean) => {
			setOpen(nextOpen);
			notifications.onOpenChange?.(nextOpen);
		},
		[notifications]
	);

	React.useEffect(() => {
		if (!open) {
			return;
		}

		const closeOnOutsideClick = (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			if (
				panelRef.current?.contains(target) ||
				triggerRef.current?.contains(target)
			) {
				return;
			}

			setNotificationOpen(false);
		};

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setNotificationOpen(false);
			}
		};

		document.addEventListener('click', closeOnOutsideClick, true);
		document.addEventListener('keydown', closeOnEscape);
		return () => {
			document.removeEventListener('click', closeOnOutsideClick, true);
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [open, setNotificationOpen]);

	return (
		<>
			<span ref={triggerRef} className="inline-flex">
				<Button
					variant="ghost"
					size="icon"
					className="relative"
					aria-expanded={open}
					aria-haspopup="dialog"
					ariaLabelI18n={label}
					onPress={() => setNotificationOpen(!open)}
				>
					<BellIcon className="h-4 w-4" />
					{unreadCount > 0 ? (
						<span
							aria-label={`${unreadCount} unread notifications`}
							className="absolute -top-1 -right-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-medium text-[10px] text-destructive-foreground leading-none"
						>
							{unreadCount > 99 ? '99+' : unreadCount}
						</span>
					) : null}
				</Button>
			</span>

			{open ? (
				<div
					ref={panelRef}
					aria-label={label}
					aria-modal="false"
					className="fixed top-16 right-4 z-50 max-h-[calc(100svh-5rem)] w-[min(24rem,calc(100vw-2rem))] overflow-auto rounded-md border bg-background p-4 shadow-lg"
					role="dialog"
				>
					<div className="mb-3 flex items-center justify-between gap-3">
						<h2 className="font-semibold text-lg">{label}</h2>
						<div className="flex items-center gap-1">
							{items.length > 0 && notifications.onMarkAllRead ? (
								<Button
									variant="ghost"
									size="sm"
									ariaLabelI18n={markAllReadLabel}
									onPress={notifications.onMarkAllRead}
								>
									<CheckIcon className="h-4 w-4" />
									<span>Mark all read</span>
								</Button>
							) : null}
							<Button
								variant="ghost"
								size="icon"
								ariaLabelI18n="Close notifications"
								onPress={() => setNotificationOpen(false)}
							>
								<XIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						{notifications.loading ? (
							<div
								aria-live="polite"
								className="py-6 text-center text-muted-foreground text-sm"
							>
								Loading notifications...
							</div>
						) : items.length ? (
							items.map((item) => (
								<ShellNotificationRow
									key={item.id}
									item={item}
									notifications={notifications}
									onClose={() => setNotificationOpen(false)}
								/>
							))
						) : (
							<div className="py-6 text-center text-muted-foreground text-sm">
								{emptyLabel}
							</div>
						)}
					</div>
				</div>
			) : null}
		</>
	);
}

function ShellNotificationRow({
	item,
	notifications,
	onClose,
}: {
	item: ShellNotificationItem;
	notifications: ShellNotificationCenter;
	onClose: () => void;
}) {
	const unread = isUnreadNotification(item);
	const timeLabel = formatNotificationTime(item.createdAt);
	const selectItem = () => {
		notifications.onSelect?.(item);
		onClose();
	};
	const markRead = () => notifications.onMarkRead?.(item);

	if (notifications.renderItem) {
		return (
			<div className={cn('rounded-xs border p-3', unread && 'bg-muted/50')}>
				{notifications.renderItem(item, {
					unread,
					onSelect: selectItem,
					onMarkRead: markRead,
				})}
			</div>
		);
	}

	const body = (
		<>
			<span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
				<span className="flex items-center gap-2">
					{unread ? (
						<span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
					) : null}
					<span className="font-medium text-sm">{item.title}</span>
				</span>
				{item.body ? (
					<span className="text-muted-foreground text-sm">{item.body}</span>
				) : null}
				<span className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
					{item.category ? <span>{item.category}</span> : null}
					{timeLabel ? <time>{timeLabel}</time> : null}
				</span>
			</span>
		</>
	);

	return (
		<div
			className={cn(
				'flex items-start gap-2 rounded-xs border p-3',
				unread && 'bg-muted/50'
			)}
		>
			{item.actionUrl ? (
				<a
					href={item.actionUrl}
					className="min-w-0 flex-1"
					onClick={selectItem}
				>
					{body}
				</a>
			) : (
				<button type="button" className="min-w-0 flex-1" onClick={selectItem}>
					{body}
				</button>
			)}
			{unread && notifications.onMarkRead ? (
				<Button
					variant="ghost"
					size="icon"
					ariaLabelI18n={`Mark ${String(item.title)} as read`}
					onPress={markRead}
				>
					<CheckIcon className="h-4 w-4" />
				</Button>
			) : null}
		</div>
	);
}
