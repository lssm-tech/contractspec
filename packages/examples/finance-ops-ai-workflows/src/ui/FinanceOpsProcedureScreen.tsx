'use client';

import { Box, VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import {
	OrderedList,
	PreviewPanel,
	ReviewItem,
} from './FinanceOpsPreviewParts';
import { readString } from './finance-ops-ai-workflows-preview.helpers';
import type { FinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

export function ProcedureDraftScreen({
	model,
}: {
	model: FinanceOpsPreviewModel;
}) {
	return (
		<VStack gap="lg">
			<PreviewPanel
				title="Procedure draft"
				description={model.procedure.result.purpose}
			>
				<Text className="text-muted-foreground text-sm leading-6">
					{model.procedure.result.scope}
				</Text>
			</PreviewPanel>

			<Box className="grid gap-5 lg:grid-cols-2">
				<PreviewPanel title="Roles and responsibilities">
					<VStack gap="sm">
						{model.procedure.roles.map((role, index) => (
							<ReviewItem
								key={`${index}-${readString(role, 'role')}`}
								label={readString(role, 'role') || `Role ${index + 1}`}
								value={readString(role, 'responsibility')}
							/>
						))}
					</VStack>
				</PreviewPanel>
				<PreviewPanel title="Step-by-step procedure">
					<OrderedList items={model.procedure.steps} />
				</PreviewPanel>
			</Box>

			<Box className="grid gap-5 lg:grid-cols-3">
				<PreviewPanel title="Controls">
					<OrderedList items={model.procedure.controls} />
				</PreviewPanel>
				<PreviewPanel title="KPIs">
					<OrderedList items={model.procedure.kpis} />
				</PreviewPanel>
				<PreviewPanel title="Open questions">
					<OrderedList items={model.procedure.openQuestions} />
				</PreviewPanel>
			</Box>
		</VStack>
	);
}
