'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import {
	pocketFamilyOfficePreviewConnections,
	pocketFamilyOfficePreviewKnowledge,
	pocketFamilyOfficePreviewMetrics,
	pocketFamilyOfficePreviewWorkflows,
} from './pocket-family-office-preview.data';

export function PocketFamilyOfficePreview() {
	return (
		<VStack as="section" gap="xl" className="p-4 sm:p-6">
			<VStack
				gap="sm"
				className="rounded-lg border border-border bg-card p-5 shadow-sm"
			>
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					Finance automation template
				</Text>
				<H2 className="font-serif text-3xl tracking-normal">
					Pocket Family Office
				</H2>
				<Text className="max-w-3xl text-muted-foreground text-sm leading-6">
					A household finance automation blueprint for open banking, document
					ingestion, bill reminders, financial summaries, and tenant-scoped
					integration bindings.
				</Text>
			</VStack>

			<HStack align="stretch" className="gap-3 lg:flex-nowrap">
				{pocketFamilyOfficePreviewMetrics.map((metric) => (
					<VStack
						key={metric.label}
						gap="xs"
						className="min-w-0 flex-1 rounded-lg border border-border bg-background p-4"
					>
						<Text className="text-muted-foreground text-xs uppercase">
							{metric.label}
						</Text>
						<Text className="font-semibold text-2xl">{metric.value}</Text>
					</VStack>
				))}
			</HStack>

			<HStack align="start" className="gap-6 xl:flex-nowrap">
				<PreviewPanel
					title="Connected operating layer"
					description="Sample tenant bindings show how the template wires managed and BYOK integrations."
				>
					{pocketFamilyOfficePreviewConnections.map((connection) => (
						<HStack
							key={connection.id}
							justify="between"
							wrap="nowrap"
							className="rounded-md border border-border bg-background p-3"
						>
							<VStack gap="xs" className="min-w-0">
								<Text className="font-semibold text-sm">
									{connection.label}
								</Text>
								<Text className="text-muted-foreground text-xs">
									{connection.mode}
								</Text>
							</VStack>
							<Text className="text-muted-foreground text-xs capitalize">
								{connection.status}
							</Text>
						</HStack>
					))}
				</PreviewPanel>

				<PreviewPanel
					title="Workflows and knowledge"
					description="The package exposes durable workflow specs plus knowledge sources for documents, email, and bank data."
				>
					<VStack gap="xs">
						{pocketFamilyOfficePreviewWorkflows.slice(0, 5).map((workflow) => (
							<Text
								key={workflow.key}
								className="rounded-md border border-border bg-background px-3 py-2 text-xs"
							>
								{workflow.key}
							</Text>
						))}
					</VStack>
					<VStack
						gap="xs"
						className="rounded-md border border-border bg-muted/40 p-3"
					>
						{pocketFamilyOfficePreviewKnowledge.map((source) => (
							<HStack key={source.id} justify="between" wrap="nowrap">
								<Text className="text-xs">{source.label}</Text>
								<Text className="text-muted-foreground text-xs">
									{source.enabled ? 'syncing' : source.type}
								</Text>
							</HStack>
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
