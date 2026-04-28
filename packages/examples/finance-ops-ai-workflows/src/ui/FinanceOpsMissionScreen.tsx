'use client';

import { Box, HStack, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import {
	OrderedList,
	PillList,
	PreviewPanel,
	ReviewItem,
} from './FinanceOpsPreviewParts';
import {
	compactRecord,
	readString,
} from './finance-ops-ai-workflows-preview.helpers';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function MissionIntakeScreen({
	model,
}: {
	model: FinanceOpsPreviewModel;
}) {
	return (
		<VStack gap="lg">
			<PreviewPanel
				title="Mission intake triage"
				description="A fictive brief becomes a finance mission note: priority, risks, documents, questions and first execution plan."
			>
				<HStack align="start" className="gap-3 lg:flex-nowrap">
					<ReviewItem
						label="Mission type"
						value={model.mission.result.missionType}
					/>
					<ReviewItem label="Priority" value={model.mission.result.priority} />
					<ReviewItem
						label="Suggested next"
						value={model.mission.result.suggestedNextWorkflow}
					/>
				</HStack>
				<Text className="text-muted-foreground text-sm leading-6">
					{model.mission.result.riskSummary}
				</Text>
			</PreviewPanel>

			<Box className="grid gap-5 lg:grid-cols-2">
				<PreviewPanel title="Risks and documents">
					<VStack gap="md">
						<PillList items={model.mission.risks} />
						<OrderedList items={model.mission.documents.slice(0, 7)} />
					</VStack>
				</PreviewPanel>

				<PreviewPanel title="Executive questions">
					<OrderedList items={model.mission.questions.slice(0, 8)} />
				</PreviewPanel>
			</Box>

			<PreviewPanel title="30 / 60 / 90 plan">
				<Box className="grid gap-3 md:grid-cols-3">
					{model.mission.planPhases.map((phase, index) => (
						<VStack
							key={`${index}-${readString(phase, 'phase')}`}
							gap="xs"
							className="rounded-md border border-border bg-background p-3"
						>
							<Text className="font-semibold text-sm">
								{readString(phase, 'phase') || `Phase ${index + 1}`}
							</Text>
							<Text className="text-muted-foreground text-xs leading-5">
								{compactRecord(phase)}
							</Text>
						</VStack>
					))}
				</Box>
			</PreviewPanel>
		</VStack>
	);
}
