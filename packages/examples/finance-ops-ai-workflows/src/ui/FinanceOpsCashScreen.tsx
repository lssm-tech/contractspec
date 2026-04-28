'use client';

import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { PreviewPanel, ReviewItem } from './FinanceOpsPreviewParts';
import { readString } from './finance-ops-ai-workflows-preview.helpers';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function CashAgingScreen({ model }: { model: FinanceOpsPreviewModel }) {
	return (
		<VStack gap="lg">
			<PreviewPanel
				title="Cash aging prioritization"
				description={model.cash.result.executiveSummary}
			>
				<HStack align="start" className="gap-3 lg:flex-nowrap">
					<ReviewItem
						label="Total exposure"
						value={`${model.cash.result.totalExposure} ${model.cash.result.currency}`}
					/>
					<ReviewItem
						label="Overdue"
						value={`${model.cash.result.overdueExposure} ${model.cash.result.currency}`}
					/>
					<ReviewItem
						label="Disputed"
						value={`${model.cash.result.disputedExposure} ${model.cash.result.currency}`}
					/>
				</HStack>
			</PreviewPanel>

			<Box className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
				<PreviewPanel title="Priority queue">
					<VStack gap="sm">
						{model.cash.priorities.map((priority) => (
							<CashPriorityCard key={priority.invoiceId} priority={priority} />
						))}
					</VStack>
				</PreviewPanel>

				<PreviewPanel title="Action pack">
					<VStack gap="sm">
						{model.cash.actions.slice(0, 5).map((action, index) => (
							<VStack
								key={`${index}-${readString(action, 'invoiceId')}`}
								gap="xs"
								className="rounded-md border border-border bg-background p-3"
							>
								<Text className="font-semibold text-sm">
									{readString(action, 'invoiceId')}
								</Text>
								<Text className="text-muted-foreground text-xs">
									{readString(action, 'owner')}
								</Text>
								<Text className="text-sm leading-5">
									{readString(action, 'action')}
								</Text>
							</VStack>
						))}
					</VStack>
				</PreviewPanel>
			</Box>
		</VStack>
	);
}

function CashPriorityCard({
	priority,
}: {
	priority: FinanceOpsPreviewModel['cash']['priorities'][number];
}) {
	return (
		<HStack
			justify="between"
			align="start"
			wrap="nowrap"
			className="gap-3 rounded-md border border-border bg-background p-3"
		>
			<VStack gap="xs" className="min-w-0">
				<Text className="font-semibold text-sm">
					{priority.invoiceId} · {priority.clientName}
				</Text>
				<Text className="text-muted-foreground text-xs">
					{priority.owner} · {priority.amountLabel}
				</Text>
				<Text className="text-muted-foreground text-xs leading-5">
					{priority.action}
				</Text>
			</VStack>
			<VStack gap="xs" className="shrink-0 items-end text-right">
				<Text className="font-semibold text-xs capitalize">
					{priority.priority}
				</Text>
				<Text className="text-muted-foreground text-xs">
					{priority.overdueDays} days
				</Text>
			</VStack>
		</HStack>
	);
}
