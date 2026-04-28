'use client';

import { Button } from '@contractspec/lib.design-system';
import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import type {
	FinanceOpsMetric,
	FinanceOpsPreviewScreen,
	FinanceOpsPreviewScreenId,
} from './finance-ops-ai-workflows-preview.model';

export function PreviewPanel({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description?: string;
	title: string;
}) {
	return (
		<VStack
			as="article"
			gap="md"
			className="min-w-0 rounded-lg border border-border bg-card p-4 shadow-sm"
		>
			<VStack as="header" gap="xs">
				<H3 className="font-semibold text-lg">{title}</H3>
				{description ? (
					<Text className="text-muted-foreground text-sm leading-6">
						{description}
					</Text>
				) : null}
			</VStack>
			{children}
		</VStack>
	);
}

export function MetricGrid({
	metrics,
}: {
	metrics: readonly FinanceOpsMetric[];
}) {
	return (
		<Box
			align="stretch"
			justify="start"
			wrap="wrap"
			className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
		>
			{metrics.map((metric) => (
				<VStack
					key={`${metric.label}-${metric.value}`}
					gap="xs"
					className="rounded-lg border border-border bg-background p-4"
				>
					<Text className="font-semibold text-muted-foreground text-xs uppercase">
						{metric.label}
					</Text>
					<Text className="font-semibold text-2xl">{metric.value}</Text>
					<Text className="text-muted-foreground text-xs">{metric.detail}</Text>
				</VStack>
			))}
		</Box>
	);
}

export function ScreenNav({
	activeScreen,
	onSelect,
	screens,
}: {
	activeScreen: FinanceOpsPreviewScreenId;
	onSelect: (screen: FinanceOpsPreviewScreenId) => void;
	screens: readonly FinanceOpsPreviewScreen[];
}) {
	return (
		<HStack align="stretch" className="gap-2">
			{screens.map((screen) => (
				<Button
					key={screen.id}
					onPress={() => onSelect(screen.id)}
					className={
						screen.id === activeScreen
							? 'min-h-10 flex-1 bg-primary text-primary-foreground'
							: 'min-h-10 flex-1 bg-background'
					}
				>
					{screen.label}
				</Button>
			))}
		</HStack>
	);
}
