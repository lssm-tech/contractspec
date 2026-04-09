'use client';

import type {
	BuilderFeatureParity,
	BuilderMobileReviewCard,
} from '@contractspec/lib.builder-spec';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { MobileReviewCardsSection } from './MobileReviewCardsSection';
import { MobileReviewFeatureParitySection } from './MobileReviewFeatureParitySection';

export function MobileReviewPanel(props: {
	featureParity: BuilderFeatureParity[];
	cards: BuilderMobileReviewCard[];
	onApproveCard?: (cardId: string) => void | Promise<void>;
	onRejectCard?: (cardId: string) => void | Promise<void>;
	onAcknowledgeCard?: (cardId: string) => void | Promise<void>;
	onOpenDetails?: (cardId: string, href?: string) => void | Promise<void>;
	busyCardId?: string | null;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Mobile Review</CardTitle>
				<CardDescription>
					Mobile parity markers and review cards stay inspectable without a
					desktop-only escape hatch.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<VStack gap="lg" align="stretch">
					<MobileReviewFeatureParitySection
						featureParity={props.featureParity}
					/>
					<MobileReviewCardsSection
						cards={props.cards}
						onApproveCard={props.onApproveCard}
						onRejectCard={props.onRejectCard}
						onAcknowledgeCard={props.onAcknowledgeCard}
						onOpenDetails={props.onOpenDetails}
						busyCardId={props.busyCardId}
					/>
				</VStack>
			</CardContent>
		</Card>
	);
}
