'use client';

import type {
	BuilderBlueprint,
	BuilderMobileReviewCard,
	BuilderReadinessReport,
} from '@contractspec/lib.builder-spec';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
	MobileReviewPanel,
	ReadinessReviewPanel,
} from '@contractspec/module.builder-workbench/presentation/components';

export function BuilderMobileReviewSurface(props: {
	featureParity: BuilderBlueprint['featureParity'];
	cards: BuilderMobileReviewCard[];
	report?: BuilderReadinessReport | null;
	onApproveCard?: (cardId: string) => void | Promise<void>;
	onRejectCard?: (cardId: string) => void | Promise<void>;
	onAcknowledgeCard?: (cardId: string) => void | Promise<void>;
	onOpenDetails?: (cardId: string, href?: string) => void | Promise<void>;
	busyCardId?: string | null;
}) {
	return (
		<VStack gap="lg" align="stretch">
			<MobileReviewPanel
				featureParity={props.featureParity}
				cards={props.cards}
				onApproveCard={props.onApproveCard}
				onRejectCard={props.onRejectCard}
				onAcknowledgeCard={props.onAcknowledgeCard}
				onOpenDetails={props.onOpenDetails}
				busyCardId={props.busyCardId}
			/>
			<ReadinessReviewPanel report={props.report} />
		</VStack>
	);
}

export {
	MobileReviewPanel,
	ReadinessReviewPanel,
} from '@contractspec/module.builder-workbench/presentation/components';
