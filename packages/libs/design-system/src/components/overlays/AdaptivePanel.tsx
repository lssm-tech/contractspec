'use client';

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@contractspec/lib.ui-kit-web/ui/drawer';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@contractspec/lib.ui-kit-web/ui/sheet';
import { useMediaQuery } from '@contractspec/lib.ui-kit-web/ui/use-media-query';
import type * as React from 'react';
import { cn } from '../../lib/utils';

export type AdaptivePanelMode = 'sheet' | 'drawer' | 'responsive';

export type AdaptivePanelBreakpoint = 'sm' | 'md' | 'lg' | number;

export type AdaptivePanelStaticMode = Exclude<AdaptivePanelMode, 'responsive'>;

export interface AdaptivePanelProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	trigger: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	mode?: AdaptivePanelMode;
	mobileMode?: AdaptivePanelStaticMode;
	desktopMode?: AdaptivePanelStaticMode;
	breakpoint?: AdaptivePanelBreakpoint;
	sheetSide?: 'top' | 'right' | 'bottom' | 'left';
	drawerDirection?: 'top' | 'right' | 'bottom' | 'left';
	className?: string;
	headerClassName?: string;
	titleClassName?: string;
	descriptionClassName?: string;
	sheetClassName?: string;
	drawerClassName?: string;
	children: React.ReactNode;
}

const BREAKPOINT_QUERY: Record<
	Exclude<AdaptivePanelBreakpoint, number>,
	string
> = {
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
	lg: '(min-width: 1024px)',
};

export function AdaptivePanel({
	open,
	onOpenChange,
	trigger,
	title,
	description,
	mode = 'responsive',
	mobileMode = 'drawer',
	desktopMode = 'sheet',
	breakpoint = 'md',
	sheetSide = 'right',
	drawerDirection = 'bottom',
	className,
	headerClassName,
	titleClassName,
	descriptionClassName,
	sheetClassName,
	drawerClassName,
	children,
}: AdaptivePanelProps) {
	const isDesktop = useMediaQuery(toAdaptivePanelBreakpointQuery(breakpoint));
	const resolvedMode =
		mode === 'responsive' ? (isDesktop ? desktopMode : mobileMode) : mode;

	if (resolvedMode === 'drawer') {
		return (
			<Drawer
				open={open}
				onOpenChange={onOpenChange}
				direction={drawerDirection}
			>
				<DrawerTrigger asChild>{trigger}</DrawerTrigger>
				<DrawerContent
					className={cn('max-h-[85vh]', className, drawerClassName)}
				>
					<DrawerHeader className={headerClassName}>
						<DrawerTitle className={titleClassName}>{title}</DrawerTitle>
						{description ? (
							<DrawerDescription className={descriptionClassName}>
								{description}
							</DrawerDescription>
						) : null}
					</DrawerHeader>
					{children}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent
				side={sheetSide}
				className={cn('sm:max-w-md', className, sheetClassName)}
			>
				<SheetHeader className={headerClassName}>
					<SheetTitle className={titleClassName}>{title}</SheetTitle>
					{description ? (
						<SheetDescription className={descriptionClassName}>
							{description}
						</SheetDescription>
					) : null}
				</SheetHeader>
				{children}
			</SheetContent>
		</Sheet>
	);
}

export function toAdaptivePanelBreakpointQuery(
	breakpoint: AdaptivePanelBreakpoint
): string {
	return typeof breakpoint === 'number'
		? `(min-width: ${breakpoint}px)`
		: BREAKPOINT_QUERY[breakpoint];
}
