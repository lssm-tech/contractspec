import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { BuilderMobileReviewSurface } from './index';

describe('mobile-review module', () => {
	it('renders the dedicated mobile review surface with actions', () => {
		const html = renderToStaticMarkup(
			<BuilderMobileReviewSurface
				featureParity={[
					{
						featureKey: 'approval.review',
						label: 'Approval review',
						mobileSupport: 'full',
						channelSupport: ['mobile_web'],
						approvalStrengthRequired: 'bound_channel_ack',
						evidenceShape: 'receipt_with_harness',
					},
				]}
				cards={[
					{
						id: 'card_1',
						workspaceId: 'ws_1',
						channelType: 'mobile_web',
						subjectType: 'approval_ticket',
						subjectId: 'approval_1',
						summary: 'Approval required before export.',
						riskLevel: 'high',
						affectedAreas: ['export'],
						evidence: {
							sourceRefs: ['source_1'],
							harnessSummary: 'Strong approval required.',
						},
						actions: [
							{
								id: 'approve',
								label: 'Approve',
								deliveryMode: 'channel_native',
							},
							{
								id: 'reject',
								label: 'Reject',
								deliveryMode: 'channel_native',
							},
							{
								id: 'open_details',
								label: 'Open details',
								deliveryMode: 'mobile_web',
								statusNote: 'Use mobile web for the full diff.',
							},
						],
						createdAt: '2026-04-08T09:00:00.000Z',
						updatedAt: '2026-04-08T09:00:00.000Z',
					},
				]}
				report={{
					id: 'readiness_1',
					workspaceId: 'ws_1',
					overallStatus: 'channel_review_required',
					score: 84,
					supportedRuntimeModes: ['managed'],
					managedReady: true,
					localReady: false,
					hybridReady: false,
					mobileParityStatus: 'full',
					mobileParitySummary: {
						channelNativeFeatures: ['approval.review'],
						deepLinkFeatures: [],
						blockedFeatures: [],
						channelNativeActionCount: 2,
						deepLinkActionCount: 1,
					},
					blockingIssues: [],
					warnings: [],
					sourceCoverage: {
						explicitCount: 1,
						inferredCount: 0,
						conflictedCount: 0,
						missingCount: 0,
						fields: [],
					},
					policySummary: ['export approval required'],
					channelSummary: [
						{
							channel: 'mobile_web',
							ready: true,
							blockers: [],
						},
					],
					providerSummary: {
						runs: 1,
						verifiedRuns: 1,
						comparisonRuns: 0,
						activeProviderIds: ['provider.codex'],
					},
					runtimeSummary: {
						selectedDefault: 'managed',
						registeredTargets: ['rt_1'],
						healthyTargetIds: ['rt_1'],
					},
					requiredApprovals: [],
					harnessRunRefs: [],
					evidenceBundleRef: {
						id: 'evidence_1',
						runId: 'run_1',
						artifactIds: ['artifact_1'],
						classes: ['builder-readiness'],
						createdAt: '2026-04-08T09:00:00.000Z',
					},
					recommendedNextAction: 'Approve export.',
				}}
			/>
		);

		expect(html).toContain('Approval required before export.');
		expect(html).toContain('Approve');
		expect(html).toContain('Readiness / Export Review');
		expect(html).toContain('channel_review_required');
	});
});
