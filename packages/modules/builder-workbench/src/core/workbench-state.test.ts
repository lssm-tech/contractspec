import { describe, expect, it } from 'bun:test';
import { summarizeBuilderWorkbench } from './workbench-state';

describe('builder workbench summary', () => {
	it('summarizes workspace counts and readiness', () => {
		const summary = summarizeBuilderWorkbench({
			workspace: {
				id: 'ws_1',
				tenantId: 'tenant_1',
				name: 'Ops Builder',
				status: 'review',
				appClass: 'internal_workflow',
				defaultRuntimeMode: 'managed',
				mobileParityRequired: true,
				ownerIds: ['owner_1'],
				defaultLocale: 'en',
				defaultChannelPolicy: {},
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			blueprint: null,
			readinessReport: {
				id: 'rr_1',
				workspaceId: 'ws_1',
				overallStatus: 'needs_review',
				score: 75,
				supportedRuntimeModes: ['managed'],
				managedReady: true,
				localReady: false,
				hybridReady: false,
				mobileParityStatus: 'partial',
				blockingIssues: [
					{
						code: 'POLICY_REVIEW',
						message: 'Policy review required.',
					},
				],
				warnings: [
					{
						code: 'MISSING_SOURCE',
						message: 'Missing source coverage.',
					},
				],
				sourceCoverage: {
					explicitCount: 0,
					inferredCount: 0,
					conflictedCount: 0,
					missingCount: 0,
					fields: [],
				},
				policySummary: [],
				channelSummary: [],
				providerSummary: {
					runs: 0,
					verifiedRuns: 0,
					comparisonRuns: 0,
					activeProviderIds: [],
				},
				runtimeSummary: {
					selectedDefault: 'managed',
					registeredTargets: [],
					healthyTargetIds: [],
				},
				requiredApprovals: [],
				harnessRunRefs: [],
				evidenceBundleRef: {
					id: 'bundle_1',
					runId: 'run_1',
					artifactIds: [],
					classes: [],
					createdAt: new Date().toISOString(),
				},
				recommendedNextAction: 'Review',
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
			plan: null,
			preview: null,
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
		});

		expect(summary.workspaceName).toBe('Ops Builder');
		expect(summary.blockerCount).toBe(1);
		expect(summary.warningCount).toBe(1);
	});
});
