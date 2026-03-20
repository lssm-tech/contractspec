import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from './navigation-menu';

export const navPanelVariants = cva('', {
	variants: {
		width: {
			sm: 'w-[280px]',
			md: 'w-[500px]',
			lg: 'w-[900px]',
			full: 'w-[calc(100vw-2rem)]',
		},
		padding: {
			none: '',
			sm: 'p-2',
			md: 'p-3',
		},
	},
	defaultVariants: {
		width: 'lg',
		padding: 'md',
	},
});

export interface NavPanelProps extends React.ComponentPropsWithoutRef<'div'> {
	width?: 'sm' | 'md' | 'lg' | 'full';
	padding?: 'none' | 'sm' | 'md';
}

export function NavPanel({
	width,
	padding,
	className,
	...props
}: NavPanelProps) {
	return (
		<div
			className={cn(navPanelVariants({ width, padding }), className)}
			{...props}
		/>
	);
}

// Simple list layout
export function NavSimpleList({
	title,
	items,
}: {
	title?: React.ReactNode;
	items: { href: string; label: string; description?: string }[];
}) {
	return (
		<div>
			{title && <div className="mb-2 font-semibold text-base">{title}</div>}
			<ul className="grid w-[280px] gap-2">
				{items.map((it) => (
					<li key={it.href}>
						<NavigationMenuLink asChild>
							<a
								href={it.href}
								className="block rounded-md p-2 hover:bg-accent"
							>
								<div className="font-medium text-base">{it.label}</div>
								{it.description && (
									<div className="line-clamp-2 text-muted-foreground text-sm">
										{it.description}
									</div>
								)}
							</a>
						</NavigationMenuLink>
					</li>
				))}
			</ul>
		</div>
	);
}

// Columns layout
export function NavColumns({
	columns,
}: {
	columns: {
		title?: string;
		items: { href: string; label: string; description?: string }[];
	}[];
}) {
	return (
		<div className="grid w-[500px] grid-cols-2 gap-3">
			{columns.map((col, idx) => (
				<div key={idx}>
					{col.title && (
						<div className="mb-2 font-semibold text-base text-muted-foreground">
							{col.title}
						</div>
					)}
					<ul className="grid gap-2">
						{col.items.map((it) => (
							<li key={it.href}>
								<NavigationMenuLink asChild>
									<a
										href={it.href}
										className="block rounded-md p-2 hover:bg-accent"
									>
										<div className="font-medium text-base">{it.label}</div>
										{it.description && (
											<div className="line-clamp-2 text-muted-foreground text-sm">
												{it.description}
											</div>
										)}
									</a>
								</NavigationMenuLink>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

// Categorized with preview layout
export function NavCategorizedWithPreview({
	categories,
	modules,
	activeCategory,
	setActiveCategory,
	activeKey: _activeKey,
	setActiveKey,
	preview,
}: {
	categories: { key: string; label: string }[];
	modules: {
		key: string;
		title: string;
		description?: string;
		categories: string[];
	}[];
	activeCategory: string;
	setActiveCategory: (k: string) => void;
	activeKey: string | null;
	setActiveKey: (k: string | null) => void;
	preview: React.ReactNode;
}) {
	const visible = React.useMemo(
		() =>
			modules.filter(
				(m) => activeCategory === 'all' || m.categories.includes(activeCategory)
			),
		[modules, activeCategory]
	);

	return (
		<div className="flex items-start gap-3">
			<div className="max-h-96 w-48 shrink-0 overflow-auto pr-1">
				<button
					className={`w-full rounded-md px-3 py-2 text-left text-base transition-colors hover:bg-muted ${
						activeCategory === 'all' ? 'bg-muted' : ''
					}`}
					onMouseEnter={() => setActiveCategory('all')}
					onFocus={() => setActiveCategory('all')}
					onClick={() => setActiveCategory('all')}
				>
					All
				</button>
				{categories.map((c) => (
					<button
						key={c.key}
						className={`w-full rounded-md px-3 py-2 text-left text-base transition-colors hover:bg-muted ${
							activeCategory === c.key ? 'bg-muted' : ''
						}`}
						onMouseEnter={() => setActiveCategory(c.key)}
						onFocus={() => setActiveCategory(c.key)}
						onClick={() => setActiveCategory(c.key)}
					>
						{c.label}
					</button>
				))}
			</div>
			<div className="grid max-h-96 flex-1 grid-cols-1 gap-1 overflow-auto pr-1">
				{visible.map((m) => (
					<NavigationMenuLink asChild key={m.key}>
						<a
							href={`/modules/${m.key}`}
							className="rounded-md px-3 py-2 text-left transition-colors hover:bg-muted"
							onMouseEnter={() => setActiveKey(m.key)}
							onFocus={() => setActiveKey(m.key)}
						>
							<div className="font-medium text-base">{m.title}</div>
							{m.description && (
								<div className="line-clamp-2 text-muted-foreground text-sm">
									{m.description}
								</div>
							)}
						</a>
					</NavigationMenuLink>
				))}
			</div>
			<div className="w-[320px] shrink-0">{preview}</div>
		</div>
	);
}

export {
	NavigationMenu as NavRoot,
	NavigationMenuContent as NavContent,
	NavigationMenuItem as NavItem,
	NavigationMenuLink as NavLink,
	NavigationMenuList as NavList,
	NavigationMenuTrigger as NavTrigger,
};
