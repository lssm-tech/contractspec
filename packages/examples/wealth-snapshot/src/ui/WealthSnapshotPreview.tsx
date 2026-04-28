'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import {
	wealthSnapshotPreviewAccounts,
	wealthSnapshotPreviewGoals,
	wealthSnapshotPreviewMetrics,
	wealthSnapshotPreviewPresentations,
} from './wealth-snapshot-preview.data';

export function WealthSnapshotPreview() {
	return (
		<VStack as="section" gap="xl" className="p-4 sm:p-6">
			<VStack
				gap="sm"
				className="rounded-lg border border-border bg-card p-5 shadow-sm"
			>
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					Wealth template
				</Text>
				<H2 className="font-serif text-3xl tracking-normal">Wealth Snapshot</H2>
				<Text className="max-w-3xl text-muted-foreground text-sm leading-6">
					An inline preview of the finance template contracts for accounts,
					assets, liabilities, goals, net-worth snapshots, and presentation
					surfaces.
				</Text>
			</VStack>

			<HStack align="stretch" className="gap-3 lg:flex-nowrap">
				{wealthSnapshotPreviewMetrics.map((metric) => (
					<VStack
						key={metric.label}
						gap="xs"
						className="min-w-0 flex-1 rounded-lg border border-border bg-background p-4"
					>
						<Text className="text-muted-foreground text-xs uppercase">
							{metric.label}
						</Text>
						<Text className="font-semibold text-2xl">{metric.value}</Text>
						<Text className="text-muted-foreground text-xs capitalize">
							{metric.tone}
						</Text>
					</VStack>
				))}
			</HStack>

			<HStack align="start" className="gap-6 xl:flex-nowrap">
				<PreviewPanel
					title="Household accounts"
					description="Sample balances show how account and debt entities sit behind the dashboard surface."
				>
					{wealthSnapshotPreviewAccounts.map((account) => (
						<HStack
							key={account.name}
							justify="between"
							wrap="nowrap"
							className="rounded-md border border-border bg-background p-3"
						>
							<VStack gap="xs" className="min-w-0">
								<Text className="font-semibold text-sm">{account.name}</Text>
								<Text className="text-muted-foreground text-xs">
									{account.type} · {account.institution}
								</Text>
							</VStack>
							<Text className="font-semibold text-sm">{account.balance}</Text>
						</HStack>
					))}
				</PreviewPanel>

				<PreviewPanel
					title="Goals and surfaces"
					description="The example also publishes presentation specs that host apps can map to their own UI."
				>
					{wealthSnapshotPreviewGoals.map((goal) => (
						<VStack
							key={goal.name}
							gap="xs"
							className="rounded-md border border-border bg-background p-3"
						>
							<HStack justify="between" wrap="nowrap">
								<Text className="font-semibold text-sm">{goal.name}</Text>
								<Text className="text-muted-foreground text-xs">
									{goal.status}
								</Text>
							</HStack>
							<Text className="text-muted-foreground text-xs">
								Progress {goal.progress}
							</Text>
						</VStack>
					))}
					<VStack
						gap="xs"
						className="rounded-md border border-border bg-muted/40 p-3"
					>
						{wealthSnapshotPreviewPresentations.map((presentation) => (
							<Text key={presentation.key} className="text-xs">
								{presentation.title}
							</Text>
						))}
					</VStack>
				</PreviewPanel>
			</HStack>
		</VStack>
	);
}

function PreviewPanel({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<VStack
			as="article"
			gap="md"
			className="min-w-0 flex-1 rounded-lg border border-border bg-card p-4 shadow-sm"
		>
			<VStack as="header" gap="xs">
				<H3 className="font-semibold text-lg">{title}</H3>
				<Text className="text-muted-foreground text-sm leading-6">
					{description}
				</Text>
			</VStack>
			{children}
		</VStack>
	);
}
