'use client';

import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { PreviewPanel, ReviewItem } from './FinanceOpsPreviewParts';
import type {
	AdoptionUsageView,
	FinanceOpsPreviewModel,
} from './finance-ops-ai-workflows-preview.model';

export function AdoptionRoiScreen({
	model,
}: {
	model: FinanceOpsPreviewModel;
}) {
	return (
		<VStack gap="lg">
			<PreviewPanel
				title="AI adoption ROI log"
				description="The demo measures workflow-level adoption: gains, quality, data risk and the next governance move."
			>
				<HStack align="start" className="gap-3 lg:flex-nowrap">
					<ReviewItem
						label="Minutes saved"
						value={String(model.adoption.totalMinutesSaved)}
					/>
					<ReviewItem
						label="Hours saved"
						value={String(model.adoption.totalHoursSaved)}
					/>
					<ReviewItem
						label="Recommendations"
						value={model.adoption.recommendations.join(', ')}
					/>
				</HStack>
			</PreviewPanel>

			<Box className="grid gap-3 md:grid-cols-2">
				{model.adoption.usages.map((usage) => (
					<AdoptionUsageCard key={usage.result.usageLogId} usage={usage} />
				))}
			</Box>
		</VStack>
	);
}

function AdoptionUsageCard({ usage }: { usage: AdoptionUsageView }) {
	return (
		<VStack gap="sm" className="rounded-lg border border-border bg-card p-4">
			<VStack gap="xs">
				<Text className="font-semibold text-sm">{usage.useCase}</Text>
				<Text className="font-mono text-muted-foreground text-xs">
					{usage.workflowKey}
				</Text>
			</VStack>
			<Text className="text-muted-foreground text-xs leading-5">
				{usage.result.roiSummary}
			</Text>
			<HStack className="gap-2">
				<Text className="rounded-full border border-border px-2 py-1 text-xs">
					{usage.team}
				</Text>
				<Text className="rounded-full border border-border px-2 py-1 text-xs">
					quality {usage.quality}
				</Text>
				<Text className="rounded-full border border-border px-2 py-1 text-xs">
					{usage.result.recommendedNextStep}
				</Text>
			</HStack>
		</VStack>
	);
}
