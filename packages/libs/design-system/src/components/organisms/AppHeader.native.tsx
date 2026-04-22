'use client';

import { cn } from '@contractspec/lib.ui-kit/ui/utils';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { type BottomTabItem, BottomTabs } from '../native/BottomTabs.native';
import { SheetMenu } from '../native/SheetMenu.native';

export interface AppHeaderMobileProps {
	logo?: React.ReactNode; // typically a brand component
	toolbarRight?: React.ReactNode;
	className?: string;
	menuContent?: React.ReactNode; // sheet menu content
	bottomTabs?: BottomTabItem[];
}

export function AppHeader({
	logo,
	toolbarRight,
	className,
	menuContent,
	bottomTabs,
}: AppHeaderMobileProps) {
	const [open, setOpen] = React.useState(false);
	return (
		<View className={cn('border-b bg-background', className)}>
			<View className="flex-row items-center justify-between px-3 py-2">
				<Pressable accessibilityLabel="Open menu" onPress={() => setOpen(true)}>
					<Text className="text-lg">☰</Text>
				</Pressable>
				<View className="px-2">
					{typeof logo === 'string' ? (
						<Text className="font-bold text-xl">{logo}</Text>
					) : (
						logo
					)}
				</View>
				<View className="flex-row items-center gap-2">{toolbarRight}</View>
			</View>

			{bottomTabs && bottomTabs.length > 0 && <BottomTabs items={bottomTabs} />}

			<SheetMenu open={open} onOpenChange={setOpen} title="Menu">
				{menuContent}
			</SheetMenu>
		</View>
	);
}
