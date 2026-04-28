import type * as React from 'react';

export type ShellNavMatch = 'exact' | 'startsWith';

export interface ShellNavItem {
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
	key?: string;
	title?: React.ReactNode;
	items: ShellNavItem[];
}

export interface ShellCommandItem {
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
	breadcrumbs?: ShellBreadcrumbItem[];
	userMenu?: React.ReactNode;
	pageOutline?: PageOutlineItem[];
}
