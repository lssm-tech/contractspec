import type {
	BuilderBlueprint,
	BuilderMobileReviewCard,
} from '@contractspec/lib.builder-spec';

export interface CreateBuilderMobileReviewCardInput {
	id: string;
	workspaceId: string;
	channelType?: BuilderMobileReviewCard['channelType'];
	subjectType?: BuilderMobileReviewCard['subjectType'];
	subjectId: string;
	summary: string;
	riskLevel?: BuilderMobileReviewCard['riskLevel'];
	provider?: BuilderMobileReviewCard['provider'];
	affectedAreas?: string[];
	sourceRefs?: string[];
	receiptId?: string;
	harnessSummary?: string;
	actions?: BuilderMobileReviewCard['actions'];
	createdAt: string;
	updatedAt?: string;
}

export function aggregateBuilderMobileParity(
	blueprint: BuilderBlueprint,
	mobileReviewCards: BuilderMobileReviewCard[]
) {
	const missingFeatureFallback = blueprint.featureParity.some(
		(feature) =>
			feature.mobileSupport === 'partial' && !feature.mobileFallbackRef?.trim()
	);
	const missingMessagingReviewLinks = mobileReviewCards.some(
		(card) =>
			card.channelType !== 'mobile_web' &&
			!card.actions.some(
				(action) =>
					action.id === 'open_details' && Boolean(action.deepLinkHref?.trim())
			)
	);
	if (
		blueprint.featureParity.some(
			(feature) => feature.mobileSupport === 'blocked'
		) ||
		missingFeatureFallback
	) {
		return 'blocked' as const;
	}
	if (
		blueprint.featureParity.some(
			(feature) => feature.mobileSupport === 'partial'
		) ||
		missingMessagingReviewLinks ||
		mobileReviewCards.length === 0
	) {
		return 'partial' as const;
	}
	return 'full' as const;
}

export function createBuilderMobileReviewActions(input?: {
	deepLinkHref?: string;
	includeApproveReject?: boolean;
}) {
	const actions: BuilderMobileReviewCard['actions'] = [];
	if (input?.includeApproveReject !== false) {
		actions.push({ id: 'approve', label: 'Approve' });
		actions.push({ id: 'reject', label: 'Reject' });
	}
	actions.push(
		input?.deepLinkHref
			? {
					id: 'open_details',
					label: 'Open details',
					deepLinkHref: input.deepLinkHref,
				}
			: {
					id: 'open_details',
					label: 'Open details',
				}
	);
	return actions;
}

export function createBuilderMobileReviewCard(
	input: CreateBuilderMobileReviewCardInput
): BuilderMobileReviewCard {
	return {
		id: input.id,
		workspaceId: input.workspaceId,
		channelType: input.channelType ?? 'mobile_web',
		subjectType: input.subjectType ?? 'patch_proposal',
		subjectId: input.subjectId,
		summary: input.summary,
		riskLevel: input.riskLevel ?? 'medium',
		provider: input.provider,
		affectedAreas: input.affectedAreas ?? [],
		evidence: {
			sourceRefs: input.sourceRefs ?? [],
			receiptId: input.receiptId,
			harnessSummary:
				input.harnessSummary ?? 'Review evidence before approving the change.',
		},
		actions:
			input.actions && input.actions.length > 0
				? input.actions
				: createBuilderMobileReviewActions(),
		createdAt: input.createdAt,
		updatedAt: input.updatedAt ?? input.createdAt,
	};
}
