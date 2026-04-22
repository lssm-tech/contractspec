'use client';

import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface BottomTabItem {
	key: string;
	label: string;
	icon?: React.ReactNode;
	active?: boolean;
	onPress: () => void;
}

export function BottomTabs({
	items,
	className,
}: {
	items: BottomTabItem[];
	className?: string;
}) {
	return (
		<View
			className={cn(
				'flex flex-row items-stretch border-t bg-background',
				className
			)}
		>
			{items.map((it) => (
				<Pressable
					key={it.key}
					className={cn(
						'flex-1 items-center justify-center py-2',
						it.active ? 'bg-muted' : undefined
					)}
					onPress={it.onPress}
					accessibilityRole="tab"
					accessibilityState={{ selected: !!it.active }}
					accessibilityLabel={it.label}
				>
					{it.icon}
					<Text
						className={cn(
							'mt-1 text-xs',
							it.active ? 'text-foreground' : 'text-muted-foreground'
						)}
					>
						{it.label}
					</Text>
				</Pressable>
			))}
		</View>
	);
}
