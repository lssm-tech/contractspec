'use client';

import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { Button } from '../atoms/Button';
import { CommandSearchTrigger } from '../molecules/CommandSearchTrigger';
import { LangSwitchDropdown } from '../molecules/LangSwitchDropdown';
import { MobileNavMenu } from '../molecules/MobileNavMenu';
import { AdaptivePanel } from '../overlays';
import type { MarketingHeaderProps } from './MarketingHeader';

export function MarketingHeaderMobile({
	logo,
	nav = [],
	className,
	right,
	commandPaletteGroups,
	langSwitchProps,
}: MarketingHeaderProps) {
	const [open, setOpen] = React.useState(false);
	return (
		<div
			className={cn(
				'w-full border-b bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60 md:hidden',
				className
			)}
		>
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2">
				<div className="flex items-center gap-2">
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
						className="w-[320px]"
					>
						<div className="px-4 pb-4">
							{!!commandPaletteGroups?.length && (
								<div className="mb-3">
									<CommandSearchTrigger groups={commandPaletteGroups} compact />
								</div>
							)}
							<VStack>
								<MobileNavMenu items={nav} />
							</VStack>
							{right ? <div className="mt-4">{right}</div> : null}
						</div>
					</AdaptivePanel>
					{logo}
				</div>
				<div className="flex items-center gap-2">
					{!!(langSwitchProps?.options?.length > 1) && (
						<LangSwitchDropdown
							value={langSwitchProps.value}
							options={langSwitchProps.options}
							onChange={langSwitchProps.onChange}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
