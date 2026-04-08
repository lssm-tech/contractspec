import { describe, expect, it } from 'bun:test';
import type {
	BuilderBlueprint,
	BuilderMobileReviewCard,
} from '@contractspec/lib.builder-spec';
import {
	aggregateBuilderMobileParity,
	createBuilderMobileReviewActions,
	createBuilderMobileReviewCard,
} from './index';

describe('mobile-control', () => {
	it('creates default deep-link-safe review actions', () => {
		const actions = createBuilderMobileReviewActions({
			deepLinkHref: 'builder://review/card_1',
		});
		expect(actions.map((action) => action.id)).toEqual([
			'approve',
			'reject',
			'open_details',
		]);
		expect(actions[2]?.deepLinkHref).toBe('builder://review/card_1');
	});

	it('creates review cards with default evidence and actions', () => {
		const card = createBuilderMobileReviewCard({
			id: 'card_1',
			workspaceId: 'ws_1',
			subjectId: 'patch_1',
			summary: 'Review payroll approval patch',
			createdAt: '2026-04-08T00:00:00.000Z',
		});
		expect(card.channelType).toBe('mobile_web');
		expect(card.actions.length).toBe(3);
		expect(card.evidence.harnessSummary.length).toBeGreaterThan(0);
	});

	it('aggregates partial parity when cards are missing', () => {
		const blueprint = {
			featureParity: [
				{
					featureKey: 'diff-review',
					label: 'Diff review',
					mobileSupport: 'full',
					channelSupport: ['mobile_web'],
					approvalStrengthRequired: 'studio_signed',
					evidenceShape: 'diff_with_provenance',
				},
			],
		} as Pick<BuilderBlueprint, 'featureParity'> as BuilderBlueprint;
		expect(
			aggregateBuilderMobileParity(blueprint, [] as BuilderMobileReviewCard[])
		).toBe('partial');
	});

	it('blocks partial mobile features that do not declare a fallback path', () => {
		const blueprint = {
			featureParity: [
				{
					featureKey: 'diff-review',
					label: 'Diff review',
					mobileSupport: 'partial',
					channelSupport: ['telegram'],
					approvalStrengthRequired: 'admin_signed',
					evidenceShape: 'diff_with_provenance',
				},
			],
		} as Pick<BuilderBlueprint, 'featureParity'> as BuilderBlueprint;

		expect(
			aggregateBuilderMobileParity(blueprint, [
				createBuilderMobileReviewCard({
					id: 'card_1',
					workspaceId: 'ws_1',
					channelType: 'telegram',
					subjectId: 'patch_1',
					summary: 'Review pending',
					createdAt: '2026-04-08T00:00:00.000Z',
					actions: createBuilderMobileReviewActions({
						deepLinkHref: 'builder://review/card_1',
					}),
				}),
			])
		).toBe('blocked');
	});

	it('keeps parity partial when messaging review cards have no deep-link fallback', () => {
		const blueprint = {
			featureParity: [
				{
					featureKey: 'runtime-review',
					label: 'Runtime review',
					mobileSupport: 'full',
					channelSupport: ['telegram'],
					mobileFallbackRef: 'builder://mobile-review/runtime',
					approvalStrengthRequired: 'bound_channel_ack',
					evidenceShape: 'receipt_with_harness',
				},
			],
		} as Pick<BuilderBlueprint, 'featureParity'> as BuilderBlueprint;

		expect(
			aggregateBuilderMobileParity(blueprint, [
				createBuilderMobileReviewCard({
					id: 'card_1',
					workspaceId: 'ws_1',
					channelType: 'telegram',
					subjectId: 'runtime_1',
					summary: 'Runtime requires attention',
					createdAt: '2026-04-08T00:00:00.000Z',
				}),
			])
		).toBe('partial');
	});
});
