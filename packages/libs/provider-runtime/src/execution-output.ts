import type {
	BuilderMobileReviewCard,
	BuilderProviderActivity,
	BuilderSourceRecord,
	BuilderWorkspace,
} from '@contractspec/lib.builder-spec';
import { createBuilderMobileReviewCard } from '@contractspec/lib.mobile-control';
import type {
	ExternalExecutionContextBundle,
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ExternalPatchProposal,
} from '@contractspec/lib.provider-spec';
import {
	createDeterministicHash,
	isRecord,
	readRuntimeMode,
	readStringArray,
} from './shared';

export function normalizeBuilderExecutionOutput(input: {
	id: string;
	workspace: BuilderWorkspace;
	payload?: Record<string, unknown>;
	provider?: ExternalExecutionProvider | null;
	contextBundle?: ExternalExecutionContextBundle | null;
	nowIso: string;
	channelType?: BuilderMobileReviewCard['channelType'];
}) {
	const payload = input.payload ?? {};
	const runtimeMode = readRuntimeMode(
		payload.runtimeMode,
		input.workspace.defaultRuntimeMode
	);
	const outputArtifactHashes =
		readStringArray(payload.outputArtifactHashes).length > 0
			? readStringArray(payload.outputArtifactHashes)
			: readStringArray(payload.artifactRefs).map((value) =>
					createDeterministicHash(value)
				);
	const receipt = {
		id: input.id,
		workspaceId: input.workspace.id,
		runId: String(
			payload.runId ?? `provider_run_${createDeterministicHash(input.id)}`
		),
		providerId:
			input.provider?.id ?? String(payload.providerId ?? 'provider.unknown'),
		providerKind:
			input.provider?.providerKind ??
			(payload.providerKind as ExternalExecutionReceipt['providerKind']) ??
			'coding',
		modelId: typeof payload.modelId === 'string' ? payload.modelId : undefined,
		taskType:
			(payload.taskType as ExternalExecutionReceipt['taskType']) ??
			'propose_patch',
		runtimeMode,
		runtimeTargetRef:
			typeof payload.runtimeTargetRef === 'string'
				? payload.runtimeTargetRef
				: typeof payload.runtimeTargetId === 'string'
					? payload.runtimeTargetId
					: undefined,
		contextBundleId: input.contextBundle?.id ?? 'exec_ctx_missing',
		contextHash: input.contextBundle?.hash ?? String(payload.contextHash ?? ''),
		outputArtifactHashes,
		costMetrics: isRecord(payload.costMetrics)
			? {
					tokensIn:
						typeof payload.costMetrics.tokensIn === 'number'
							? payload.costMetrics.tokensIn
							: undefined,
					tokensOut:
						typeof payload.costMetrics.tokensOut === 'number'
							? payload.costMetrics.tokensOut
							: undefined,
					latencyMs:
						typeof payload.costMetrics.latencyMs === 'number'
							? payload.costMetrics.latencyMs
							: undefined,
					estimatedCostUsd:
						typeof payload.costMetrics.estimatedCostUsd === 'number'
							? payload.costMetrics.estimatedCostUsd
							: undefined,
				}
			: undefined,
		status:
			(payload.status as ExternalExecutionReceipt['status']) ?? 'succeeded',
		startedAt:
			typeof payload.startedAt === 'string' ? payload.startedAt : input.nowIso,
		completedAt:
			typeof payload.completedAt === 'string'
				? payload.completedAt
				: input.nowIso,
		verificationRefs: readStringArray(payload.verificationRefs),
	} satisfies ExternalExecutionReceipt;
	const outputSummary = String(
		payload.summary ?? payload.outputSummary ?? `${receipt.taskType} output`
	);
	const providerSourceId = `provider_source_${createDeterministicHash(receipt.id)}`;
	const providerSource = {
		id: providerSourceId,
		workspaceId: input.workspace.id,
		sourceType: 'provider_output',
		title: outputSummary,
		provenance: {
			sourceId: providerSourceId,
			sourceType: 'provider_output',
			providerId: receipt.providerId,
			providerKind: receipt.providerKind,
			modelId: receipt.modelId,
			runtimeTargetRef: receipt.runtimeTargetRef,
			contextHash: receipt.contextHash,
			outputArtifactHashes: receipt.outputArtifactHashes,
			capturedAt: receipt.completedAt ?? receipt.startedAt,
			extractorType: 'provider-runtime',
			confidence: 0.75,
			hash: createDeterministicHash(outputSummary),
			policyClassification: 'internal',
		},
		policyClassification: 'internal',
		approvalState: 'draft',
		hash: createDeterministicHash(outputSummary),
		runtimeScope: runtimeMode,
		createdAt: input.nowIso,
		updatedAt: input.nowIso,
	} satisfies BuilderSourceRecord;
	let patchProposal: ExternalPatchProposal | null = null;
	let mobileReviewCard: BuilderMobileReviewCard | null = null;
	if (
		typeof payload.diffHash === 'string' ||
		isRecord(payload.patchProposal) ||
		receipt.taskType === 'propose_patch'
	) {
		const patchPayload: Record<string, unknown> = isRecord(
			payload.patchProposal
		)
			? payload.patchProposal
			: payload;
		patchProposal = {
			id: String(
				patchPayload.id ?? `patch_${createDeterministicHash(receipt.id)}`
			),
			workspaceId: input.workspace.id,
			receiptId: receipt.id,
			runId: receipt.runId,
			summary: String(patchPayload.summary ?? outputSummary),
			changedAreas: readStringArray(patchPayload.changedAreas),
			diffHash: String(
				patchPayload.diffHash ??
					payload.diffHash ??
					createDeterministicHash(outputSummary)
			),
			outputArtifactRefs: readStringArray(
				patchPayload.outputArtifactRefs ?? payload.artifactRefs
			),
			allowedWriteScopes: readStringArray(
				patchPayload.allowedWriteScopes ??
					input.contextBundle?.allowedWriteScopes
			),
			riskLevel:
				(patchPayload.riskLevel as ExternalPatchProposal['riskLevel']) ??
				'medium',
			verificationRequirements:
				readStringArray(
					patchPayload.verificationRequirements ??
						payload.verificationRequirements
				).length > 0
					? readStringArray(
							patchPayload.verificationRequirements ??
								payload.verificationRequirements
						)
					: ['Run Builder readiness before approval.'],
			status:
				(patchPayload.status as ExternalPatchProposal['status']) ?? 'proposed',
			createdAt: input.nowIso,
			updatedAt: input.nowIso,
		};
		mobileReviewCard = createBuilderMobileReviewCard({
			id: `mobile_review_${createDeterministicHash(patchProposal.id)}`,
			workspaceId: input.workspace.id,
			channelType: input.channelType ?? 'mobile_web',
			subjectType: 'patch_proposal',
			subjectId: patchProposal.id,
			summary: patchProposal.summary,
			riskLevel: patchProposal.riskLevel,
			provider: {
				id: receipt.providerId,
				runId: receipt.runId,
			},
			affectedAreas: patchProposal.changedAreas,
			sourceRefs: input.contextBundle?.sourceRefs ?? [],
			receiptId: receipt.id,
			harnessSummary:
				'Patch proposal normalized; run readiness to confirm export status.',
			createdAt: input.nowIso,
		});
	}
	const providerActivity = {
		id: `provider_activity_${createDeterministicHash(receipt.id)}`,
		workspaceId: input.workspace.id,
		taskType: receipt.taskType,
		status:
			receipt.status === 'failed'
				? 'failed'
				: receipt.status === 'partial'
					? 'running'
					: 'completed',
		receiptId: receipt.id,
		providerId: receipt.providerId,
		recordedAt: input.nowIso,
	} satisfies BuilderProviderActivity;
	return {
		receipt,
		providerSource,
		patchProposal,
		providerActivity,
		mobileReviewCard,
	};
}
