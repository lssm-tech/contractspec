'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { MenuIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '../atoms/Button';
import { NavBrand } from '../atoms/NavBrand';
import { Breadcrumbs } from '../molecules/Breadcrumbs';
import { CommandSearchTrigger } from '../molecules/CommandSearchTrigger';
import type { AppShellProps } from './AppShell.types';
import { PageOutline } from './PageOutline';
import { ShellNotifications } from './ShellNotifications';
import { ShellSidebar } from './ShellSidebar';
import type { ShellNavItem, ShellNavSection } from './types';

function ShellNavList({
	sections,
	activeHref,
}: {
	sections: ShellNavSection[];
	activeHref?: string;
}) {
	return (
		<nav className="flex flex-col gap-5" aria-label="Application navigation">
			{sections.map((section, index) => (
				<div key={section.key ?? index} className="flex flex-col gap-2">
					{section.title && (
						<div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							{section.title}
						</div>
					)}
					<div className="flex flex-col gap-1">
						{section.items.map((item) => (
							<ShellNavListItem
								key={item.key ?? item.href ?? String(item.label)}
								item={item}
								activeHref={activeHref}
							/>
						))}
					</div>
				</div>
			))}
		</nav>
	);
}

function ShellNavListItem({
	item,
	activeHref,
	depth = 0,
}: {
	item: ShellNavItem;
	activeHref?: string;
	depth?: number;
}) {
	const active =
		item.active ||
		(Boolean(item.href) &&
			Boolean(activeHref) &&
			(item.match === 'startsWith'
				? activeHref?.startsWith(item.href ?? '')
				: activeHref === item.href));
	const content = (
		<span
			className={cn(
				'inline-flex min-w-0 items-center gap-2',
				depth > 0 && 'pl-4'
			)}
		>
			{item.icon}
			<span className="truncate">{item.label}</span>
			{item.badge ? (
				<span className="ml-auto text-muted-foreground text-xs">
					{item.badge}
				</span>
			) : null}
		</span>
	);

	const disabled = item.disabled || item.policyDecision?.effect === 'deny';

	return (
		<div className="flex flex-col gap-1">
			{item.href && !disabled ? (
				<a
					href={item.href}
					target={item.target}
					aria-current={active ? 'page' : undefined}
					aria-label={item.ariaLabel}
					onClick={() => item.onSelect?.()}
					className={cn(
						'rounded-xs px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
						active && 'bg-accent font-medium text-accent-foreground'
					)}
				>
					{content}
				</a>
			) : (
				<button
					type="button"
					aria-disabled={disabled || undefined}
					disabled={disabled}
					aria-label={item.ariaLabel}
					onClick={() => item.onSelect?.()}
					className={cn(
						'rounded-xs px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
						active && 'bg-accent font-medium text-accent-foreground'
					)}
				>
					{content}
				</button>
			)}
			{item.children?.length ? (
				<div className="flex flex-col gap-1">
					{item.children.map((child) => (
						<ShellNavListItem
							key={child.key ?? child.href ?? String(child.label)}
							item={child}
							activeHref={activeHref}
							depth={depth + 1}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

export function AppShell({
	brand,
	logo,
	title,
	homeHref,
	navigation = [],
	commands = [],
	notifications,
	breadcrumbs = [],
	pageOutline = [],
	activeHref,
	activeOutlineId,
	userMenu,
	topbarStart,
	topbarEnd,
	children,
	className,
	contentClassName,
	onNavigate: _onNavigate,
}: AppShellProps) {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const resolvedBrand = brand ?? (
		<NavBrand href={homeHref} logo={logo} title={title} />
	);
	const renderCommandTrigger = (compact = false) =>
		commands.length ? (
			<CommandSearchTrigger
				groups={commands}
				placeholder="Search or run action..."
				compact={compact}
			/>
		) : null;

	return (
		<div className={cn('min-h-svh bg-background', className)}>
			<SidebarProvider>
				<ShellSidebar
					sections={navigation}
					brand={resolvedBrand}
					commandTrigger={renderCommandTrigger()}
					footer={userMenu}
					activeHref={activeHref}
					withProvider={false}
				/>
				<SidebarInset className="min-h-svh min-w-0">
					<header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
						<div className="flex h-14 min-w-0 items-center gap-3 px-3 md:px-4">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								ariaLabelI18n="Open navigation"
								onPress={() => setMenuOpen(true)}
							>
								<MenuIcon className="h-4 w-4" />
							</Button>
							<SidebarTrigger
								aria-label="Toggle sidebar"
								className="hidden md:inline-flex"
							/>
							<div className="min-w-0 md:hidden">{resolvedBrand}</div>
							<div className="hidden min-w-0 md:block">{topbarStart}</div>
							<div className="min-w-0 flex-1 overflow-hidden">
								{breadcrumbs.length ? (
									<Breadcrumbs items={breadcrumbs} />
								) : null}
							</div>
							<div className="hidden shrink-0 md:block">
								{renderCommandTrigger()}
							</div>
							<div className="flex shrink-0 items-center gap-2">
								{notifications ? (
									<ShellNotifications notifications={notifications} />
								) : null}
								{topbarEnd}
								{userMenu}
							</div>
						</div>
					</header>

					<div className="min-h-0 flex-1">
						<div className={cn('min-w-0 px-4 py-5 md:px-6', contentClassName)}>
							{children}
						</div>
						{pageOutline.length ? (
							<aside className="hidden xl:block">
								<PageOutline
									items={pageOutline}
									activeId={activeOutlineId}
									variant="floating"
								/>
							</aside>
						) : null}
					</div>
				</SidebarInset>
			</SidebarProvider>

			<Dialog open={menuOpen} onOpenChange={setMenuOpen}>
				<DialogContent className="max-h-[85svh] overflow-auto sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Menu</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						{renderCommandTrigger()}
						<ShellNavList sections={navigation} activeHref={activeHref} />
						{userMenu}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
