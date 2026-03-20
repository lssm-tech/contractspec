'use client';

import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@contractspec/lib.ui-kit-web/ui/sheet';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { Button } from '../atoms/Button';
import { CommandSearchTrigger } from '../molecules/CommandSearchTrigger';
import { LangSwitchDropdown } from '../molecules/LangSwitchDropdown';
import { MobileNavMenu } from '../molecules/MobileNavMenu';
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
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[320px] p-4">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
								{!!commandPaletteGroups?.length && (
									<div className="mb-3">
										<CommandSearchTrigger
											groups={commandPaletteGroups}
											compact
										/>
									</div>
								)}
							</SheetHeader>
							<VStack>
								<MobileNavMenu items={nav} />
							</VStack>
							<SheetFooter>{right}</SheetFooter>
						</SheetContent>
					</Sheet>
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
