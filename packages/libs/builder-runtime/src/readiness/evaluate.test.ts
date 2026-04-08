import { describe, expect, it } from 'bun:test';
import { createBuilderExportArtifactRefs } from '../runtime/export-artifacts';
import { evaluateBuilderReadiness } from './evaluate';

function createReadinessInput(): Parameters<
	typeof evaluateBuilderReadiness
>[0] {
	return {
		workspace: {
			id: 'ws_1',
			tenantId: 'tenant_1',
			name: 'Builder Workspace',
			status: 'draft',
			appClass: 'internal_workflow',
			defaultRuntimeMode: 'managed',
			mobileParityRequired: true,
			ownerIds: ['owner_1'],
			defaultLocale: 'en',
			defaultChannelPolicy: {},
			createdAt: '2026-04-07T00:00:00.000Z',
			updatedAt: '2026-04-07T00:00:00.000Z',
		},
		blueprint: {
			id: 'bp_1',
			workspaceId: 'ws_1',
			appBrief: 'Approval workflow',
			personas: [],
			domainObjects: [],
			workflows: [],
			surfaces: [],
			integrations: [],
			policies: [],
			runtimeProfiles: [
				{
					id: 'runtime_managed',
					label: 'Managed',
					runtimeMode: 'managed',
					status: 'candidate',
				},
			],
			channelSurfaces: [],
			featureParity: [
				{
					featureKey: 'requirements.capture',
					label: 'Capture requirements',
					mobileSupport: 'full',
					channelSupport: ['mobile_web'],
					approvalStrengthRequired: 'weak_channel_ack',
					evidenceShape: 'summary_only',
				},
			],
			assumptions: [],
			openQuestions: [],
			coverageReport: {
				explicitCount: 1,
				inferredCount: 0,
				conflictedCount: 0,
				missingCount: 0,
				fields: [
					{
						fieldPath: 'brief',
						sourceIds: ['src_1'],
						decisionReceiptIds: [],
						explicit: true,
						conflicted: false,
						locked: false,
						confidence: 0.9,
					},
				],
			},
			version: 1,
			lockedFieldPaths: [],
			createdAt: '2026-04-07T00:00:00.000Z',
			updatedAt: '2026-04-07T00:00:00.000Z',
		},
		conversations: [],
		bindings: [],
		transcripts: [],
		approvals: [],
		conflicts: [],
		messages: [],
		runtimeTargets: [],
		providers: [
			{
				id: 'provider.codex',
				workspaceId: 'ws_1',
				providerKind: 'coding',
				displayName: 'Codex',
				integrationPackage: '@contractspec/integration.provider.codex',
				authMode: 'managed',
				capabilityProfile: {
					providerId: 'provider.codex',
					supportsRepoScopedPatch: true,
					supportsStructuredDiff: true,
					supportsLongContext: true,
					supportsFunctionCalling: true,
					supportsSTT: false,
					supportsVision: false,
					supportsStreaming: true,
					supportsLocalExecution: false,
					supportedArtifactTypes: ['diff'],
					knownConstraints: [],
				},
				supportedRuntimeModes: ['managed'],
				supportedTaskTypes: ['propose_patch'],
				defaultRiskPolicy: {
					propose_patch: 'medium',
				},
				status: 'active',
				createdAt: '2026-04-07T00:00:00.000Z',
				updatedAt: '2026-04-07T00:00:00.000Z',
			},
		],
		executionReceipts: [],
		patchProposals: [],
		comparisonRuns: [],
		mobileReviewCards: [
			{
				id: 'review_1',
				workspaceId: 'ws_1',
				channelType: 'mobile_web',
				subjectType: 'patch_proposal',
				subjectId: 'patch_1',
				summary: 'Review pending',
				riskLevel: 'medium',
				affectedAreas: ['workflow'],
				evidence: {
					sourceRefs: ['src_1'],
					harnessSummary: 'Pending review.',
				},
				actions: [{ id: 'open', label: 'Open' }],
				createdAt: '2026-04-07T00:00:00.000Z',
				updatedAt: '2026-04-07T00:00:00.000Z',
			},
		],
		exportBundle: null,
	};
}

describe('builder readiness evaluation', () => {
	it('blocks when transcript confirmation is still required', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			transcripts: [
				{
					id: 'seg_1',
					workspaceId: 'ws_1',
					sourceId: 'src_1',
					startMs: 0,
					endMs: 1000,
					language: 'en',
					text: 'remove auth',
					confidence: 0.4,
					transcriptionModel: 'test',
					requiresConfirmation: true,
					status: 'draft',
				},
			],
		});

		expect(result.report.overallStatus).toBe('blocked');
		expect(result.report.supportedRuntimeModes).toEqual(['managed']);
	});

	it('blocks when required approvals are still open', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			approvals: [
				{
					id: 'approval_1',
					workspaceId: 'ws_1',
					reason: 'Export approval required.',
					riskLevel: 'high',
					requestedVia: 'web_ui',
					requiredStrength: 'admin_signed',
					status: 'open',
				},
			],
		});

		expect(result.report.overallStatus).toBe('blocked');
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'APPROVAL_REQUIRED'
			)
		).toBe(true);
	});

	it('surfaces low-confidence and language-mismatched transcripts for review', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			transcripts: [
				{
					id: 'seg_warning_1',
					workspaceId: 'ws_1',
					sourceId: 'src_1',
					startMs: 0,
					endMs: 1000,
					language: 'fr',
					text: 'Créer une règle de validation.',
					confidence: 0.7,
					transcriptionModel: 'test',
					requiresConfirmation: false,
					status: 'confirmed',
				},
			],
		});

		expect(result.report.overallStatus).toBe('needs_review');
		expect(
			result.report.warnings.some(
				(issue) => issue.code === 'STT_CONFIDENCE_LOW'
			)
		).toBe(true);
		expect(
			result.report.warnings.some(
				(issue) => issue.code === 'STT_LANGUAGE_MISMATCH'
			)
		).toBe(true);
	});

	it('blocks required mobile parity gaps and duplicate replay deliveries', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			blueprint: {
				...createReadinessInput().blueprint,
				featureParity: [
					{
						featureKey: 'diff.review',
						label: 'Diff review',
						mobileSupport: 'partial',
						channelSupport: ['mobile_web'],
						approvalStrengthRequired: 'bound_channel_ack',
						evidenceShape: 'diff_with_provenance',
					},
				],
			},
			messages: [
				{
					id: 'message_1',
					workspaceId: 'ws_1',
					conversationId: 'conversation_1',
					channelType: 'telegram',
					direction: 'inbound',
					externalConversationId: 'thread_1',
					externalMessageId: 'message_1',
					messageKind: 'text',
					contentRef: 'Create a workflow.',
					directiveCandidates: [],
					receivedAt: '2026-04-07T00:00:00.000Z',
				},
				{
					id: 'message_2',
					workspaceId: 'ws_1',
					conversationId: 'conversation_1',
					channelType: 'telegram',
					direction: 'inbound',
					externalConversationId: 'thread_1',
					externalMessageId: 'message_1',
					messageKind: 'text',
					contentRef: 'Create a workflow.',
					directiveCandidates: [],
					receivedAt: '2026-04-07T00:00:01.000Z',
				},
			],
		});

		expect(result.report.overallStatus).toBe('blocked');
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'MOBILE_PARITY_BLOCKED'
			)
		).toBe(true);
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'CHANNEL_DUPLICATE_DELIVERY'
			)
		).toBe(true);
	});

	it('blocks messaging review cards that have no deep-link fallback', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			mobileReviewCards: [
				{
					id: 'review_1',
					workspaceId: 'ws_1',
					channelType: 'telegram',
					subjectType: 'patch_proposal',
					subjectId: 'patch_1',
					summary: 'Review pending',
					riskLevel: 'medium',
					affectedAreas: ['workflow'],
					evidence: {
						sourceRefs: ['src_1'],
						harnessSummary: 'Pending review.',
					},
					actions: [{ id: 'open_details', label: 'Open details' }],
					createdAt: '2026-04-07T00:00:00.000Z',
					updatedAt: '2026-04-07T00:00:00.000Z',
				},
			],
		});

		expect(result.report.overallStatus).toBe('blocked');
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'MOBILE_REVIEW_DEEP_LINK_MISSING'
			)
		).toBe(true);
	});

	it('blocks export bundles whose artifact refs do not match the deterministic signature', () => {
		const input = createReadinessInput();
		const preview = {
			id: 'preview_1',
			workspaceId: 'ws_1',
			previewUrl: 'builder://preview/ws_1/managed/1',
			generatedWorkspaceRef: 'builder://workspace/ws_1/generated',
			dataMode: 'mock' as const,
			runtimeMode: 'managed' as const,
			buildStatus: 'ready' as const,
			readinessSummary: 'Ready to export.',
			comparisonRunIds: [],
			mobileReviewCardIds: [],
			createdAt: '2026-04-07T00:00:00.000Z',
			updatedAt: '2026-04-07T00:00:00.000Z',
		};
		const executionReceipts = [
			{
				id: 'receipt_1',
				workspaceId: 'ws_1',
				runId: 'run_1',
				providerId: 'provider.codex',
				providerKind: 'coding' as const,
				taskType: 'propose_patch' as const,
				runtimeMode: 'managed' as const,
				contextBundleId: 'ctx_1',
				contextHash: 'ctx_hash_1',
				outputArtifactHashes: ['artifact_hash_1'],
				status: 'succeeded' as const,
				startedAt: '2026-04-07T00:00:00.000Z',
				completedAt: '2026-04-07T00:00:01.000Z',
				verificationRefs: ['verify_1'],
			},
		];
		const deterministicArtifactRefs = createBuilderExportArtifactRefs({
			blueprint: input.blueprint,
			executionReceipts,
			preview,
			runtimeMode: 'managed',
			targetType: 'oss_workspace',
			workspaceId: 'ws_1',
		});
		const [exportArtifactRef, , generatedWorkspaceRef] =
			deterministicArtifactRefs;
		if (!exportArtifactRef || !generatedWorkspaceRef) {
			throw new Error('Deterministic export artifact refs should be present.');
		}
		const result = evaluateBuilderReadiness({
			...input,
			preview,
			executionReceipts,
			exportBundle: {
				id: 'export_1',
				workspaceId: 'ws_1',
				targetType: 'oss_workspace',
				runtimeMode: 'managed',
				artifactRefs: [
					exportArtifactRef,
					'builder://preview/unexpected',
					generatedWorkspaceRef,
				],
				verificationRef: 'builder://verification/export/bad',
				receiptIds: executionReceipts.map((receipt) => receipt.id),
				auditPackageRefs: ['audit_1'],
			},
		});

		expect(result.report.overallStatus).toBe('blocked');
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'EXPORT_BUNDLE_NONDETERMINISTIC'
			)
		).toBe(true);
	});

	it('blocks incomplete provider receipts and incomplete patch proposals', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			executionReceipts: [
				{
					id: 'receipt_1',
					workspaceId: 'ws_1',
					runId: 'run_1',
					providerId: 'provider.codex',
					providerKind: 'coding',
					taskType: 'propose_patch',
					runtimeMode: 'managed',
					contextBundleId: 'ctx_1',
					contextHash: 'ctx_hash_1',
					outputArtifactHashes: ['artifact_hash_1'],
					status: 'succeeded',
					startedAt: '2026-04-07T00:00:00.000Z',
					completedAt: '2026-04-07T00:00:01.000Z',
					verificationRefs: [],
				},
			],
			patchProposals: [
				{
					id: 'proposal_1',
					workspaceId: 'ws_1',
					receiptId: 'receipt_1',
					runId: 'run_1',
					summary: 'Review the diff',
					changedAreas: [],
					diffHash: 'diff_1',
					outputArtifactRefs: [],
					allowedWriteScopes: ['packages/libs/builder-runtime'],
					riskLevel: 'high',
					verificationRequirements: ['Run readiness'],
					status: 'proposed',
					createdAt: '2026-04-07T00:00:00.000Z',
					updatedAt: '2026-04-07T00:00:00.000Z',
				},
			],
		});

		expect(result.report.overallStatus).toBe('blocked');
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'PROVIDER_RECEIPT_INVALID'
			)
		).toBe(true);
		expect(
			result.report.blockingIssues.some(
				(issue) => issue.code === 'PATCH_PROPOSAL_INVALID'
			)
		).toBe(true);
	});

	it('does not mark offline local runtime targets as compatible', () => {
		const result = evaluateBuilderReadiness({
			...createReadinessInput(),
			runtimeTargets: [
				{
					id: 'rt_local_offline',
					workspaceId: 'ws_1',
					type: 'local_daemon',
					runtimeMode: 'local',
					displayName: 'Offline local daemon',
					registrationState: 'offline',
					capabilityProfile: {
						supportsPreview: true,
						supportsExport: true,
						supportsMobileInspection: true,
						supportsLocalExecution: true,
						availableProviders: ['provider.local'],
						dataLocality: 'local',
					},
					networkPolicy: 'restricted',
					dataLocality: 'local',
					secretHandlingMode: 'local',
					createdAt: '2026-04-07T00:00:00.000Z',
					updatedAt: '2026-04-07T00:00:00.000Z',
				},
			],
		});

		expect(result.report.localReady).toBe(false);
		expect(result.report.supportedRuntimeModes).toEqual(['managed']);
		expect(
			result.report.warnings.some(
				(issue) => issue.code === 'LOCAL_RUNTIME_UNAVAILABLE'
			)
		).toBe(true);
	});
});
