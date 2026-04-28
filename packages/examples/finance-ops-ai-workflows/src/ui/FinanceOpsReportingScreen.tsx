'use client';

import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import { OrderedList, PreviewPanel } from './FinanceOpsPreviewParts';
import { readString } from './finance-ops-ai-workflows-preview.helpers';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function ReportingNarrativeScreen({
	model,
}: {
	model: FinanceOpsPreviewModel;
}) {
	return (
		<VStack gap="lg">
			<PreviewPanel
				title="Reporting narrative"
				description={model.reporting.result.executiveSummary}
			>
				<Text className="text-muted-foreground text-sm leading-6">
					{model.reporting.result.confidenceNotes}
				</Text>
			</PreviewPanel>

			<Box className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
				<PreviewPanel title="Variance highlights">
					<VStack gap="sm">
						{model.reporting.highlights.map((highlight, index) => (
							<VarianceCard
								key={`${index}-${readString(highlight, 'metric')}`}
								highlight={highlight}
							/>
						))}
					</VStack>
				</PreviewPanel>
				<PreviewPanel title="Review questions">
					<OrderedList items={model.reporting.questions} />
				</PreviewPanel>
			</Box>

			<PreviewPanel title="Recommended follow-ups">
				<OrderedList items={model.reporting.followUps} />
			</PreviewPanel>
		</VStack>
	);
}

function VarianceCard({ highlight }: { highlight: Record<string, unknown> }) {
	return (
		<HStack
			justify="between"
			align="start"
			wrap="nowrap"
			className="gap-3 rounded-md border border-border bg-background p-3"
		>
			<VStack gap="xs" className="min-w-0">
				<Text className="font-semibold text-sm">
					{readString(highlight, 'metric')}
				</Text>
				<Text className="text-muted-foreground text-xs">
					Owner: {readString(highlight, 'owner')}
				</Text>
			</VStack>
			<Text className="shrink-0 rounded-full border border-border px-2 py-1 text-xs">
				{readString(highlight, 'classification').replaceAll('_', ' ')}
			</Text>
		</HStack>
	);
}
