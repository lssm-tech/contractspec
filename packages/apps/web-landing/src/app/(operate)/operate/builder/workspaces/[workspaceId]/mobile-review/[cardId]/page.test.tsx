import { describe, expect, it, mock } from 'bun:test';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

mock.module('../../builder-workspace-data', () => ({
	fetchInitialBuilderSnapshot: mock(async (workspaceId: string) => ({
		workspace: {
			id: workspaceId,
			tenantId: 'builder',
			name: 'Builder Workspace',
			status: 'draft',
			appClass: 'internal_workflow',
			defaultRuntimeMode: 'managed',
			mobileParityRequired: true,
			ownerIds: ['owner_1'],
			defaultLocale: 'en',
			defaultChannelPolicy: {},
			createdAt: '2026-04-08T09:00:00.000Z',
			updatedAt: '2026-04-08T09:00:00.000Z',
		},
		participantBindings: [],
		conversations: [],
		sources: [],
		rawAssets: [],
		extractedParts: [],
		evidenceReferences: [],
		messages: [],
		transcripts: [],
		directives: [],
		assumptions: [],
		conflicts: [],
		decisionReceipts: [],
		fusionGraphEdges: [],
		approvalTickets: [],
		blueprint: null,
		plan: null,
		preview: null,
		readinessReport: null,
		exportBundle: null,
		runtimeTargets: [],
		externalProviders: [],
		routingPolicy: null,
		executionContextBundles: [],
		executionReceipts: [],
		patchProposals: [],
		comparisonRuns: [],
		mobileReviewCards: [],
		decisionLedger: {
			decisions: [],
			inferences: [],
		},
		sourceTimeline: [],
		providerProposalRegister: [],
		providerActivity: [],
		stableMemory: {
			approvedDecisionIds: [],
			lockedFieldPaths: [],
			approvedSnapshotSourceIds: [],
			exportBundleIds: [],
		},
		workingMemory: {
			messageIds: [],
			directiveIds: [],
			assumptionIds: [],
			conflictIds: [],
			pendingApprovalIds: [],
		},
	})),
}));

mock.module('./BuilderMobileReviewClient', () => ({
	BuilderMobileReviewClient: (props: {
		cardId: string;
		initialSnapshot: { workspace: { id: string } };
	}) =>
		React.createElement(
			'div',
			null,
			`review:${props.initialSnapshot.workspace.id}:${props.cardId}`
		),
}));

import BuilderMobileReviewPage from './page';

describe('builder mobile review route', () => {
	it('renders the dedicated mobile review page with the requested card id', async () => {
		const html = renderToStaticMarkup(
			await BuilderMobileReviewPage({
				params: Promise.resolve({
					workspaceId: 'ws_route',
					cardId: 'card_route_1',
				}),
			})
		);

		expect(html).toContain('review:ws_route:card_route_1');
	});
});
