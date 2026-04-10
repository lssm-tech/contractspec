import type { BuilderWorkspaceSnapshot } from '@contractspec/lib.builder-spec';

export function getBuilderApiBaseUrl(): string | null {
	return (
		process.env.CONTRACTSPEC_API_BASE_URL ??
		process.env.NEXT_PUBLIC_CONTRACTSPEC_API_BASE_URL ??
		null
	);
}

export function createEmptyBuilderSnapshot(
	workspaceId: string
): BuilderWorkspaceSnapshot {
	const now = new Date().toISOString();
	return {
		workspace: {
			id: workspaceId,
			tenantId: 'builder',
			name: `Builder Workspace ${workspaceId}`,
			status: 'draft',
			appClass: 'internal_workflow',
			defaultRuntimeMode: 'managed',
			mobileParityRequired: true,
			ownerIds: ['builder_owner'],
			defaultLocale: 'en',
			defaultChannelPolicy: {
				approvedVoiceLocales: ['en', 'fr', 'es', 'de'],
				audioRetention: 'policy',
			},
			createdAt: now,
			updatedAt: now,
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
	};
}

export async function fetchInitialBuilderSnapshot(
	workspaceId: string
): Promise<BuilderWorkspaceSnapshot> {
	const apiBaseUrl = getBuilderApiBaseUrl();
	const token = process.env.CONTROL_PLANE_API_TOKEN;
	if (!apiBaseUrl || !token) {
		return createEmptyBuilderSnapshot(workspaceId);
	}
	const target = new URL(
		'/internal/builder/queries/builder.workspace.snapshot',
		apiBaseUrl
	);
	target.searchParams.set('workspaceId', workspaceId);
	const response = await fetch(target, {
		headers: {
			authorization: `Bearer ${token}`,
		},
		cache: 'no-store',
	});
	if (!response.ok) {
		return createEmptyBuilderSnapshot(workspaceId);
	}
	const payload = (await response.json()) as {
		ok: boolean;
		result?: BuilderWorkspaceSnapshot;
	};
	return payload.result ?? createEmptyBuilderSnapshot(workspaceId);
}
