import type { PolicyDecision } from '@contractspec/lib.contracts-spec';
import type { PolicyRequirement } from '@contractspec/lib.contracts-spec/policy';
import type * as React from 'react';

export type ShellNavMatch = 'exact' | 'startsWith';

export interface ShellNavItem {
	policy?: PolicyRequirement;
	policyBehavior?: 'hide' | 'disable' | 'show-with-lock';
	policyDecision?: PolicyDecision;
	disabled?: boolean;
	locked?: boolean;
	key?: string;
	label: React.ReactNode;
	href?: string;
	icon?: React.ReactNode;
	badge?: React.ReactNode;
	description?: React.ReactNode;
	children?: ShellNavItem[];
	active?: boolean;
	match?: ShellNavMatch;
	priority?: number;
	target?: '_self' | '_blank';
	ariaLabel?: string;
	onSelect?: () => void;
	commandId?: string;
}

export interface ShellNavSection {
	policy?: PolicyRequirement;
	policyBehavior?: 'hide' | 'disable' | 'show-with-lock';
	policyDecision?: PolicyDecision;
	disabled?: boolean;
	locked?: boolean;
	key?: string;
	title?: React.ReactNode;
	items: ShellNavItem[];
}

export interface ShellCommandItem {
	policy?: PolicyRequirement;
	policyBehavior?: 'hide' | 'disable' | 'show-with-lock';
	policyDecision?: PolicyDecision;
	disabled?: boolean;
	locked?: boolean;
	id: string;
	label: string;
	shortcut?: string;
	onSelect?: () => void;
}

export interface ShellCommandGroup {
	heading?: string;
	items: ShellCommandItem[];
}

export interface ShellBreadcrumbItem {
	href?: string;
	label: React.ReactNode;
}

export type ShellNotificationStatus = 'unread' | 'read' | 'archived' | string;

export interface ShellNotificationItem {
	id: string;
	title: React.ReactNode;
	body?: React.ReactNode;
	type?: string;
	status?: ShellNotificationStatus;
	readAt?: string | Date | null;
	createdAt?: string | Date;
	actionUrl?: string;
	priority?: 'low' | 'normal' | 'high' | 'urgent' | string;
	category?: string;
	metadata?: Record<string, unknown>;
}

export interface ShellNotificationRenderContext {
	unread: boolean;
	onSelect: () => void;
	onMarkRead: () => void;
}

export interface ShellNotificationCenter {
	items?: ShellNotificationItem[];
	unreadCount?: number;
	loading?: boolean;
	emptyLabel?: React.ReactNode;
	label?: string;
	markAllReadLabel?: string;
	onOpenChange?: (open: boolean) => void;
	onSelect?: (item: ShellNotificationItem) => void;
	onMarkRead?: (item: ShellNotificationItem) => void;
	onMarkAllRead?: () => void;
	renderItem?: (
		item: ShellNotificationItem,
		context: ShellNotificationRenderContext
	) => React.ReactNode;
}

export interface ShellUserMenuItem {
	label: React.ReactNode;
	href?: string;
	onSelect?: () => void;
	icon?: React.ReactNode;
	danger?: boolean;
}

export interface ShellUserMenu {
	name?: string;
	email?: string;
	imageUrl?: string;
	items: ShellUserMenuItem[];
}

export type PageOutlineLevel = 1 | 2 | 3;

export interface PageOutlineItem {
	id: string;
	label: React.ReactNode;
	href?: string;
	level?: PageOutlineLevel;
	children?: PageOutlineItem[];
}

export interface AppShellConfig {
	brand?: React.ReactNode;
	navigation?: ShellNavSection[];
	commands?: ShellCommandGroup[];
	notifications?: ShellNotificationCenter;
	breadcrumbs?: ShellBreadcrumbItem[];
	userMenu?: React.ReactNode;
	pageOutline?: PageOutlineItem[];
}
