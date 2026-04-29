'use client';
import { Separator } from '@contractspec/lib.ui-kit-web/ui/separator';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva } from 'class-variance-authority';
import { Menu } from 'lucide-react';
import * as React from 'react';
import type {
	CtaAction,
	HeaderNavItem,
	NavSection,
} from '../../types/navigation';
import { Button } from '../atoms/Button';
import { ButtonLink } from '../atoms/ButtonLink';
import { NavMain } from '../molecules/NavMain';
import { NavUser } from '../molecules/NavUser';
import { AdaptivePanel } from '../overlays';
import { AppSidebar } from './AppSidebar';

export interface HeaderProps {
	logo: React.ReactNode;
	nav: HeaderNavItem[];
	userMenu?: React.ComponentProps<typeof NavUser>;
	cta?: CtaAction;
	className?: string;
	density?: 'compact' | 'comfortable';
	mobileSidebar?: {
		sections: NavSection[];
		top?: React.ReactNode;
		bottom?: React.ReactNode;
	};
}

const desktopHeaderVariants = cva(
	'hidden items-center justify-between gap-4 md:flex',
	{
		variants: {
			density: {
				compact: 'px-3 py-1',
				comfortable: 'px-4 py-2',
			},
		},
		defaultVariants: { density: 'comfortable' },
	}
);

const mobileHeaderVariants = cva(
	'flex items-center justify-between md:hidden',
	{
		variants: {
			density: {
				compact: 'px-2 py-1',
				comfortable: 'px-3 py-2',
			},
		},
		defaultVariants: { density: 'comfortable' },
	}
);

export function DesktopHeader({
	logo,
	nav,
	userMenu,
	cta,
	className,
	density,
}: HeaderProps) {
	return (
		<header className={cn(desktopHeaderVariants({ density }), className)}>
			<div className="flex items-center gap-4">
				{logo}
				<Separator orientation="vertical" className="h-6" />
				<NavMain items={nav} />
			</div>
			<div className="flex items-center gap-2">
				{cta && (
					<ButtonLink variant={cta.variant} href={cta.href}>
						{cta.label}
					</ButtonLink>
				)}
				{userMenu && <NavUser {...userMenu} />}
			</div>
		</header>
	);
}

export function MobileHeader({
	logo,
	userMenu,
	mobileSidebar,
	className,
	density,
}: HeaderProps) {
	const [open, setOpen] = React.useState(false);
	return (
		<header className={cn(mobileHeaderVariants({ density }), className)}>
			<AdaptivePanel
				mode="drawer"
				drawerDirection="left"
				open={open}
				onOpenChange={setOpen}
				trigger={
					<Button variant="ghost" size="icon" aria-label="Open menu">
						<Menu className="h-5 w-5" />
					</Button>
				}
				title="Menu"
				headerClassName="sr-only"
				className="w-[300px] p-0"
			>
				{mobileSidebar ? (
					<AppSidebar
						sections={mobileSidebar.sections}
						top={mobileSidebar.top}
						bottom={mobileSidebar.bottom}
						className="h-svh"
					/>
				) : (
					<div className="p-4">No sidebar configured</div>
				)}
			</AdaptivePanel>
			<div className="flex-1 px-2">{logo}</div>
			<div className="flex items-center gap-2">
				{userMenu && <NavUser {...userMenu} />}
			</div>
		</header>
	);
}

export function Header(props: HeaderProps) {
	return (
		<>
			<MobileHeader {...props} />
			<DesktopHeader {...props} />
		</>
	);
}
