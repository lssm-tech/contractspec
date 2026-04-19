import type {
	BuilderBlueprint,
	BuilderMobileReviewCard,
} from '@contractspec/lib.builder-spec';
import type { BuilderMobileParitySummary } from '@contractspec/lib.builder-spec/types';

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

export function buildBuilderMobileParitySummary(
	blueprint: BuilderBlueprint,
	mobileReviewCards: BuilderMobileReviewCard[]
): BuilderMobileParitySummary {
	const channelNativeFeatures = blueprint.featureParity
		.filter(
			(feature) =>
				feature.mobileSupport === 'full' &&
				feature.channelSupport.some(
					(channel) => channel === 'telegram' || channel === 'whatsapp'
				)
		)
		.map((feature) => feature.featureKey);
	const deepLinkFeatures = blueprint.featureParity
		.filter(
			(feature) =>
				feature.mobileSupport === 'partial' ||
				Boolean(feature.mobileFallbackRef?.trim())
		)
		.map((feature) => feature.featureKey);
	const blockedFeatures = blueprint.featureParity
		.filter((feature) => feature.mobileSupport === 'blocked')
		.map((feature) => feature.featureKey);
	const actions = mobileReviewCards.flatMap((card) => card.actions);

	return {
		channelNativeFeatures,
		deepLinkFeatures,
		blockedFeatures,
		channelNativeActionCount: actions.filter(
			(action) => action.deliveryMode === 'channel_native'
		).length,
		deepLinkActionCount: actions.filter(
			(action) => action.deliveryMode === 'mobile_web'
		).length,
	};
}

export function createBuilderMobileReviewActions(input?: {
	deepLinkHref?: string;
	includeApproveReject?: boolean;
	includeAcknowledge?: boolean;
	includeRequestChanges?: boolean;
}) {
	const actions: BuilderMobileReviewCard['actions'] = [];
	if (input?.includeApproveReject !== false) {
		actions.push({
			id: 'approve',
			label: 'Approve',
			deliveryMode: 'channel_native',
			statusNote: 'Safe for direct channel approval.',
		});
		actions.push({
			id: 'reject',
			label: 'Reject',
			deliveryMode: 'channel_native',
			statusNote: 'Safe for direct channel rejection.',
		});
	}
	if (input?.includeRequestChanges) {
		actions.push({
			id: 'request_changes',
			label: 'Request changes',
			deliveryMode: 'channel_native',
			statusNote: 'Use in-channel correction when the quick summary is enough.',
		});
	}
	if (input?.includeAcknowledge) {
		actions.push({
			id: 'acknowledge',
			label: 'Acknowledge',
			deliveryMode: 'channel_native',
			statusNote: 'Acknowledge the incident directly from the channel.',
		});
	}
	actions.push(
		input?.deepLinkHref
			? {
					id: 'open_details',
					label: 'Open details',
					deepLinkHref: input.deepLinkHref,
					deliveryMode: 'mobile_web',
					statusNote:
						'Use secure mobile web for long diffs, receipts, and detailed evidence.',
				}
			: {
					id: 'open_details',
					label: 'Open details',
					deliveryMode: 'mobile_web',
					statusNote:
						'Use secure mobile web for long diffs, receipts, and detailed evidence.',
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
		status: 'open',
		actions:
			input.actions && input.actions.length > 0
				? input.actions
				: createBuilderMobileReviewActions(),
		createdAt: input.createdAt,
		updatedAt: input.updatedAt ?? input.createdAt,
	};
}
export * from './mobile-control.feature';
