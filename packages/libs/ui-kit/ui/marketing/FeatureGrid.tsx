import * as React from 'react';
import { View } from 'react-native';
import { Text } from '../text';
import { P } from '../typography';
import { cn } from '../utils';

export interface FeatureItem {
	title: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
}

export function FeatureGrid({
	items,
	columns = 3,
	className,
}: {
	items: FeatureItem[];
	columns?: 2 | 3 | 4;
	className?: string;
}) {
	const gridCols =
		columns === 4
			? 'md:grid-cols-4'
			: columns === 2
				? 'md:grid-cols-2'
				: 'md:grid-cols-3';
	return (
		<View className={cn('mx-auto max-w-6xl py-12', className)}>
			<View
				className={cn('flex flex-col gap-6 md:flex-row md:flex-wrap', gridCols)}
			>
				{items.map((it, idx) => (
					<View key={idx} className="flex-1 rounded-lg border p-6">
						{it.icon && <View className="mb-3 text-primary">{it.icon}</View>}
						<Text className="font-semibold text-lg">{it.title}</Text>
						{it.description && (
							<P className="mt-2 text-base text-muted-foreground">
								{it.description}
							</P>
						)}
					</View>
				))}
			</View>
		</View>
	);
}
