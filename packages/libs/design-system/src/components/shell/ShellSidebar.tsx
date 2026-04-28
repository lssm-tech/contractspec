'use client';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import type { ShellNavItem, ShellNavSection } from './types';

export interface ShellSidebarProps {
	sections: ShellNavSection[];
	brand?: React.ReactNode;
	commandTrigger?: React.ReactNode;
	footer?: React.ReactNode;
	activeHref?: string;
	className?: string;
}

function isActive(item: ShellNavItem, activeHref?: string) {
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

function itemKey(item: ShellNavItem) {
	return item.key ?? item.href ?? String(item.label);
}

function ShellSidebarItem({
	item,
	activeHref,
	depth = 0,
}: {
	item: ShellNavItem;
	activeHref?: string;
	depth?: number;
}) {
	const active = isActive(item, activeHref);
	const hasChildren = Boolean(item.children?.length);
	const content = (
		<span
			className={cn(
				'inline-flex min-w-0 items-center gap-2',
				depth > 0 && 'pl-4'
			)}
		>
			{item.icon}
			<span className="truncate">{item.label}</span>
		</span>
	);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild={!!item.href}
				isActive={active}
				aria-label={item.href ? undefined : item.ariaLabel}
				onClick={item.href ? undefined : () => item.onSelect?.()}
			>
				{item.href ? (
					<a
						href={item.href}
						target={item.target}
						aria-label={item.ariaLabel}
						onClick={() => item.onSelect?.()}
					>
						{content}
					</a>
				) : (
					content
				)}
			</SidebarMenuButton>
			{item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
			{hasChildren && (
				<SidebarMenu className="mt-1">
					{item.children?.map((child) => (
						<ShellSidebarItem
							key={itemKey(child)}
							item={child}
							activeHref={activeHref}
							depth={depth + 1}
						/>
					))}
				</SidebarMenu>
			)}
		</SidebarMenuItem>
	);
}

export function ShellSidebar({
	sections,
	brand,
	commandTrigger,
	footer,
	activeHref,
	className,
}: ShellSidebarProps) {
	return (
		<SidebarProvider>
			<Sidebar className={className}>
				<SidebarRail />
				<SidebarHeader
					className={cn('gap-3', !brand && !commandTrigger && 'hidden')}
				>
					{brand}
					{commandTrigger}
				</SidebarHeader>
				<SidebarContent>
					{sections.map((section, index) => (
						<SidebarGroup key={section.key ?? index}>
							{section.title && (
								<SidebarGroupLabel>{section.title}</SidebarGroupLabel>
							)}
							<SidebarGroupContent>
								<SidebarMenu>
									{section.items.map((item) => (
										<ShellSidebarItem
											key={itemKey(item)}
											item={item}
											activeHref={activeHref}
										/>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarContent>
				{footer && <SidebarFooter>{footer}</SidebarFooter>}
			</Sidebar>
		</SidebarProvider>
	);
}
