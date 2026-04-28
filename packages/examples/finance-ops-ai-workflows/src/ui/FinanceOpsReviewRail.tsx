'use client';

import { VStack } from '@contractspec/lib.design-system/layout';
import { PreviewPanel } from './FinanceOpsPreviewChrome';
import { ReviewItem } from './FinanceOpsPreviewLists';
import { formatMoney } from './finance-ops-ai-workflows-preview.model';

export function ReviewRail({
	cashDecision,
	decisionMoment,
	nextWorkflow,
	presenterAngle,
	totalExposure,
	currency,
}: {
	cashDecision: string;
	currency: string;
	decisionMoment: string;
	nextWorkflow: string;
	presenterAngle: string;
	totalExposure: number;
}) {
	return (
		<PreviewPanel title="Demo review drawer">
			<VStack gap="md">
				<ReviewItem label="Presenter angle" value={presenterAngle} />
				<ReviewItem label="Decision moment" value={decisionMoment} />
				<ReviewItem
					label="Cash pack"
					value={cashDecision.replaceAll('_', ' ')}
				/>
				<ReviewItem label="Next workflow" value={nextWorkflow} />
				<ReviewItem
					label="Exposure in fixture"
					value={formatMoney(totalExposure, currency)}
				/>
			</VStack>
		</PreviewPanel>
	);
}
