import { describe, expect, it } from 'bun:test';
import type {
	BuilderBlueprint,
	BuilderChannelMessage,
	BuilderParticipantBinding,
	BuilderReadinessReport,
	BuilderSourceRecord,
	BuilderWorkspace,
} from '../types';
import {
	validateBuilderBlueprint,
	validateBuilderChannelMessage,
	validateBuilderParticipantBinding,
	validateBuilderReadinessReport,
	validateBuilderSourceRecord,
	validateBuilderWorkspace,
} from './entities';

describe('builder-spec validation', () => {
	it('validates builder workspace requirements', () => {
		const workspace: BuilderWorkspace = {
			id: '',
			tenantId: '',
			name: '',
			status: 'draft',
			appClass: 'internal_workflow',
			defaultRuntimeMode: 'managed',
			mobileParityRequired: true,
			ownerIds: [],
			defaultLocale: '',
			defaultChannelPolicy: {},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		expect(validateBuilderWorkspace(workspace).length).toBeGreaterThan(0);
	});

	it('validates blueprint coverage presence', () => {
		const blueprint: BuilderBlueprint = {
			id: 'bp_1',
			workspaceId: 'ws_1',
			appBrief: '',
			personas: [],
			domainObjects: [],
			workflows: [],
			surfaces: [],
			integrations: [],
			policies: [],
			runtimeProfiles: [],
			channelSurfaces: [],
			featureParity: [],
			assumptions: [],
			openQuestions: [],
			coverageReport: {
				explicitCount: 0,
				inferredCount: 0,
				conflictedCount: 0,
				missingCount: 0,
				fields: [],
			},
			version: 1,
			lockedFieldPaths: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		expect(validateBuilderBlueprint(blueprint).length).toBeGreaterThan(0);
	});

	it('validates readiness score range', () => {
		const report: BuilderReadinessReport = {
			id: 'rr_1',
			workspaceId: 'ws_1',
			overallStatus: 'blocked',
			score: 101,
			supportedRuntimeModes: [],
			managedReady: false,
			localReady: false,
			hybridReady: false,
			mobileParityStatus: 'blocked',
			blockingIssues: [],
			warnings: [],
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
			recommendedNextAction: '',
		};

		expect(validateBuilderReadinessReport(report).length).toBeGreaterThan(0);
	});

	it('validates participant binding requirements', () => {
		const binding: BuilderParticipantBinding = {
			id: 'binding_1',
			workspaceId: 'ws_1',
			participantId: '',
			workspaceRole: 'admin',
			channelType: 'telegram',
			externalIdentityRef: '',
			identityAssurance: 'high',
			channelBindingStrength: 'high',
			allowedActions: [],
			approvalStrength: 'admin_signed',
			messageAuthenticity: 'high',
			createdAt: new Date().toISOString(),
		};

		expect(validateBuilderParticipantBinding(binding).length).toBeGreaterThan(
			0
		);
	});

	it('validates source provenance fields', () => {
		const source: BuilderSourceRecord = {
			id: 'source_1',
			workspaceId: 'ws_1',
			sourceType: 'file',
			title: '',
			provenance: {
				sourceId: 'source_1',
				sourceType: 'file',
				capturedAt: new Date().toISOString(),
				extractorType: 'builder-runtime',
				confidence: 1.2,
				hash: '',
				policyClassification: 'internal',
			},
			policyClassification: 'internal',
			approvalState: 'draft',
			hash: 'source_hash',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		expect(validateBuilderSourceRecord(source).length).toBeGreaterThan(0);
	});

	it('validates channel message trust confidence range', () => {
		const message: BuilderChannelMessage = {
			id: 'message_1',
			workspaceId: 'ws_1',
			conversationId: 'conversation_1',
			channelType: 'whatsapp',
			direction: 'inbound',
			externalConversationId: '',
			externalMessageId: '',
			messageKind: 'text',
			contentRef: 'approve export',
			directiveCandidates: [],
			trustProfile: {
				identityAssurance: 'high',
				channelBindingStrength: 'high',
				messageAuthenticity: 'high',
				transcriptConfidence: 2,
				approvalEligible: true,
			},
			receivedAt: new Date().toISOString(),
		};

		expect(validateBuilderChannelMessage(message).length).toBeGreaterThan(0);
	});
});
