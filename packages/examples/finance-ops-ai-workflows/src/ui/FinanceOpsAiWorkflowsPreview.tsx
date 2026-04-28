'use client';

import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { H2, H3, Text } from '@contractspec/lib.design-system/typography';
import type { ReactNode } from 'react';
import {
	financeOpsAgingRows,
	financeOpsDemoFlow,
	financeOpsSafetyChecklist,
	financeOpsWorkflowCards,
	financeOpsWorkflowMetrics,
} from './finance-ops-ai-workflows-preview.data';

export function FinanceOpsAiWorkflowsPreview() {
	return (
		<VStack as="section" gap="xl" className="p-4 sm:p-6">
			<VStack
				gap="sm"
				className="rounded-lg border border-border bg-card p-5 shadow-sm"
			>
				<Text className="font-semibold text-muted-foreground text-xs uppercase">
					Governed finance operations
				</Text>
				<H2 className="font-serif text-3xl tracking-normal">
					Finance Ops AI Workflows
				</H2>
				<Text className="max-w-3xl text-muted-foreground text-sm leading-6">
					A ContractSpec template for safe, deterministic, human-reviewed
					AI-assisted finance operations: mission triage, cash management,
					procedure drafting, reporting narrative and adoption ROI.
				</Text>
			</VStack>

			<HStack align="stretch" className="gap-3 lg:flex-nowrap">
				{financeOpsWorkflowMetrics.map((metric) => (
					<VStack
						key={metric.label}
						gap="xs"
						className="min-w-0 flex-1 rounded-lg border border-border bg-background p-4"
					>
						<Text className="text-muted-foreground text-xs uppercase">
							{metric.label}
						</Text>
						<Text className="font-semibold text-2xl">{metric.value}</Text>
						<Text className="text-muted-foreground text-xs">
							{metric.detail}
						</Text>
					</VStack>
				))}
			</HStack>

			<HStack align="start" className="gap-6 xl:flex-nowrap">
				<PreviewPanel
					title="Workflow contracts"
					description="Each operation turns a business input into an explicit contract, deterministic handler output, and reviewable workflow artifact."
				>
					{financeOpsWorkflowCards.map((workflow) => (
						<VStack
							key={workflow.key}
							gap="xs"
							className="rounded-md border border-border bg-background p-3"
						>
							<Text className="font-semibold text-sm">{workflow.title}</Text>
							<Text className="font-mono text-muted-foreground text-xs">
								{workflow.key}
							</Text>
							<Text className="text-muted-foreground text-xs leading-5">
								{workflow.description}
							</Text>
							<HStack className="gap-2">
								{workflow.outputs.map((output) => (
									<Text
										key={output}
										className="rounded-full border border-border px-2 py-1 text-muted-foreground text-xs"
									>
										{output}
									</Text>
								))}
							</HStack>
						</VStack>
					))}
				</PreviewPanel>

				<PreviewPanel
					title="Demo flow and controls"
					description="The commercial demo shows workflows, not prompts: every output remains synthetic, traceable and human-reviewed."
				>
					<VStack gap="xs" className="rounded-md border border-border p-3">
						{financeOpsDemoFlow.map((step, index) => (
							<HStack key={step} wrap="nowrap" className="gap-3">
								<Text className="font-semibold text-muted-foreground text-xs">
									{index + 1}
								</Text>
								<Text className="text-sm">{step}</Text>
							</HStack>
						))}
					</VStack>
					<VStack gap="xs">
						{financeOpsSafetyChecklist.map((item) => (
							<Text
								key={item}
								className="rounded-md border border-border bg-background px-3 py-2 text-xs"
							>
								{item}
							</Text>
						))}
					</VStack>
					<VStack
						gap="xs"
						className="rounded-md border border-border bg-muted/40 p-3"
					>
						{financeOpsAgingRows.map((row) => (
							<HStack key={row.invoiceId} justify="between" wrap="nowrap">
								<VStack gap="xs" className="min-w-0">
									<Text className="font-semibold text-sm">{row.invoiceId}</Text>
									<Text className="text-muted-foreground text-xs">
										{row.counterparty} · {row.amountDue}
									</Text>
								</VStack>
								<VStack gap="xs" className="items-end text-right">
									<Text className="font-semibold text-xs capitalize">
										{row.priority}
									</Text>
									<Text className="text-muted-foreground text-xs">
										{row.daysLate} days late
									</Text>
									<Text className="text-muted-foreground text-xs">
										{row.action}
									</Text>
								</VStack>
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
