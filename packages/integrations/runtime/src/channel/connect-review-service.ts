import {
	createLaneRuntime,
	createLaneSelector,
	type LaneRuntimeStore,
	type LaneStatusView,
} from '@contractspec/lib.execution-lanes';
import type { ChannelApprovalService } from './approval';
import type { ConnectReviewQueueStore } from './connect-review-store';
import type {
	ConnectReviewIngestInput,
	ConnectReviewQueueItem,
	ConnectReviewQueueRecord,
	ConnectReviewQueueStatus,
	ConnectReviewSweepInput,
	ConnectReviewSweepResult,
	ListConnectReviewQueueItemsInput,
} from './connect-review-types';
import type { ChannelRuntimeStore } from './store';

export class ConnectReviewBridgeService {
	constructor(
		private readonly reviewStore: ConnectReviewQueueStore,
		private readonly dependencies: {
			approvalService?: Pick<ChannelApprovalService, 'listPendingApprovals'>;
			channelStore?: Pick<ChannelRuntimeStore, 'getDecision'>;
			executionLaneService?: {
				get(runId: string): Promise<
					| {
							approvals: Array<{ state: string }>;
							run: { lane: string; status: string };
					  }
					| undefined
				>;
				nudge(
					runId: string,
					input: { actorId?: string; message: string }
				): Promise<unknown>;
				requestApproval(
					runId: string,
					input: {
						role: string;
						verdict?: 'approve' | 'acknowledge';
						comment?: string;
						actorId?: string;
					}
				): Promise<unknown>;
			};
			laneStore: LaneRuntimeStore;
			now?: () => Date;
		}
	) {}

	async ingest(
		input: ConnectReviewIngestInput
	): Promise<ConnectReviewQueueItem> {
		const now = this.now();
		const existing = await this.reviewStore.getConnectReviewBySourceDecisionId(
			input.reviewPacket.sourceDecisionId
		);
		const queue =
			input.queue ?? input.reviewPacket.studio?.queue ?? 'connect-default';
		const laneRunId =
			existing?.laneRunId ??
			buildLaneRunId(input.reviewPacket.sourceDecisionId);
		const nextLane =
			existing?.nextLane ?? this.selectNextLane(input.planPacket);

		await this.ensureLaneRun(laneRunId, input, nextLane, existing == null);

		const record = await this.reviewStore.upsertConnectReview({
			id: existing?.id ?? input.reviewPacket.id,
			workspaceId:
				input.contextPack?.repoId ??
				input.planPacket?.repoId ??
				'connect-review',
			queue,
			sourceDecisionId: input.reviewPacket.sourceDecisionId,
			runtimeDecisionId: resolveRuntimeDecisionId(input),
			traceId: resolveTraceId(input),
			laneRunId,
			nextLane,
			canonPackRefs: collectCanonPackRefs(input.contextPack),
			knowledge: input.contextPack?.knowledge ?? [],
			configRefs: input.contextPack?.configRefs ?? [],
			reviewPacket: input.reviewPacket,
			contextPack: input.contextPack,
			planPacket: input.planPacket,
			patchVerdict: input.patchVerdict,
			decisionEnvelope: input.decisionEnvelope,
			createdAt: existing?.createdAt ?? now,
			updatedAt: now,
			syncedAt: now,
		});
		return this.enrich(record);
	}

	async get(id: string): Promise<ConnectReviewQueueItem | null> {
		const record = await this.reviewStore.getConnectReview(id);
		return record ? this.enrich(record) : null;
	}

	async list(
		input: ListConnectReviewQueueItemsInput = {}
	): Promise<ConnectReviewQueueItem[]> {
		const records = await this.reviewStore.listConnectReviews(input);
		const items = await Promise.all(
			records.map((record) => this.enrich(record))
		);
		return input.status
			? items.filter((item) => item.status === input.status)
			: items;
	}

	async sweepPendingReviews(
		input: ConnectReviewSweepInput
	): Promise<ConnectReviewSweepResult> {
		const nudgeMessage =
			input.nudgeMessage ??
			'Connect review is still pending. Re-check the queue and continue follow-up.';
		const items = await this.list({ limit: input.limit });
		const pendingDecisionIds = new Set(
			(
				(await this.dependencies.approvalService?.listPendingApprovals({
					limit: Math.max(25, input.limit ?? 100),
				})) ?? []
			).map((decision) => decision.id)
		);
		const result: ConnectReviewSweepResult = {
			scanned: items.length,
			nudged: [],
			requestedApproval: [],
			skipped: [],
		};

		for (const item of items) {
			if (!isSweepCandidate(item, input.staleAfterMs)) {
				result.skipped.push(item.id);
				continue;
			}
			if (
				item.runtimeDecisionId &&
				pendingDecisionIds.has(item.runtimeDecisionId)
			) {
				result.skipped.push(item.id);
				continue;
			}
			const snapshot = item.laneRunId
				? await this.dependencies.executionLaneService?.get(item.laneRunId)
				: undefined;
			if (!snapshot || !item.laneRunId) {
				result.skipped.push(item.id);
				continue;
			}
			if (snapshot.run.lane === 'team.coordinated') {
				await this.dependencies.executionLaneService?.nudge(item.laneRunId, {
					actorId: input.actorId,
					message: nudgeMessage,
				});
				result.nudged.push(item.id);
				continue;
			}
			if (
				snapshot.approvals.some((approval) => approval.state === 'requested')
			) {
				result.skipped.push(item.id);
				continue;
			}
			await this.dependencies.executionLaneService?.requestApproval(
				item.laneRunId,
				{
					role: 'verifier',
					verdict: 'acknowledge',
					comment: nudgeMessage,
					actorId: input.actorId,
				}
			);
			result.requestedApproval.push(item.id);
		}

		return result;
	}

	private async enrich(
		record: ConnectReviewQueueRecord
	): Promise<ConnectReviewQueueItem> {
		const decision = record.runtimeDecisionId
			? await this.dependencies.channelStore?.getDecision(
					record.runtimeDecisionId
				)
			: null;
		const lane = record.laneRunId
			? await this.dependencies.executionLaneService?.get(record.laneRunId)
			: undefined;
		return {
			...record,
			approvalStatus:
				decision?.approvalStatus ??
				record.patchVerdict?.controlPlane.approvalStatus ??
				record.reviewPacket.controlPlane.approvalStatus,
			laneStatus: lane?.run.status as ConnectReviewQueueItem['laneStatus'],
			status: deriveStatus(
				decision?.approvalStatus ??
					record.patchVerdict?.controlPlane.approvalStatus ??
					record.reviewPacket.controlPlane.approvalStatus,
				lane?.run.status as LaneStatusView['status'] | undefined
			),
		};
	}

	private async ensureLaneRun(
		runId: string,
		input: ConnectReviewIngestInput,
		nextLane: ConnectReviewQueueRecord['nextLane'],
		createArtifacts: boolean
	) {
		const runtime = createLaneRuntime(this.dependencies.laneStore);
		const existing = await runtime.getSnapshot(runId);
		if (!existing) {
			await runtime.startRun(
				{
					runId,
					lane: 'plan.consensus',
					objective: input.reviewPacket.objective,
					sourceRequest: input.reviewPacket.reason,
					scopeClass:
						input.planPacket?.riskScore && input.planPacket.riskScore >= 0.75
							? 'high-risk'
							: 'medium',
					status: 'running',
					currentPhase: 'review_ingested',
					ownerRole: 'planner',
					authorityContext: {
						policyRefs: ['control-plane.core'],
						ruleContextRefs: ['connect-review-bridge'],
						approvalRefs: input.reviewPacket.requiredApprovals.map(
							(approval) => approval.capability
						),
					},
					verificationPolicyKey: 'lane.plan.consensus',
					blockingRisks: [input.reviewPacket.reason],
					pendingApprovalRoles: [],
					evidenceBundleIds: [],
					runtimeContext: {
						traceId: resolveTraceId(input),
						workflowId: `connect-review:${input.reviewPacket.sourceDecisionId}`,
					},
					recommendedNextLane: nextLane,
					createdAt: this.now(),
					updatedAt: this.now(),
				},
				'connect-review-bridge'
			);
		}
		if (!createArtifacts) {
			return;
		}
		for (const artifact of [
			['connect_context_pack', input.contextPack],
			['connect_plan_packet', input.planPacket],
			['connect_patch_verdict', input.patchVerdict],
			['connect_review_packet', input.reviewPacket],
			['connect_decision_envelope', input.decisionEnvelope],
		] as const) {
			if (!artifact[1]) continue;
			await runtime.appendArtifact(
				runId,
				{
					runId,
					artifactType: artifact[0],
					createdAt: this.now(),
					body: artifact[1],
					summary: input.reviewPacket.objective,
				},
				'connect-review-bridge'
			);
		}
		await runtime.appendEvent(
			runId,
			'connect.review.ingested',
			`Synced review ${input.reviewPacket.id} into the Connect review queue.`,
			'connect-review-bridge'
		);
	}

	private now() {
		return (this.dependencies.now ?? (() => new Date()))().toISOString();
	}

	private selectNextLane(planPacket: ConnectReviewIngestInput['planPacket']) {
		return createLaneSelector().select({
			hasPlanPack: Boolean(planPacket),
			parallelizableTaskCount:
				planPacket?.steps.filter(
					(step) => (step.commands?.length ?? 0) + (step.paths?.length ?? 0) > 1
				).length ?? 0,
		});
	}
}

function buildLaneRunId(sourceDecisionId: string) {
	return `connect-review-${sourceDecisionId.replace(/[^a-zA-Z0-9_-]+/g, '-')}`;
}

function collectCanonPackRefs(input: ConnectReviewIngestInput['contextPack']) {
	return [
		...new Set(
			(input?.knowledge ?? [])
				.filter((entry) => entry.category === 'canonical')
				.map((entry) => entry.spaceKey)
				.concat(
					(input?.configRefs ?? [])
						.filter((entry) => entry.kind === 'canon-pack')
						.map((entry) => entry.ref)
				)
		),
	];
}

function resolveRuntimeDecisionId(input: ConnectReviewIngestInput) {
	return (
		input.patchVerdict?.controlPlane.decisionId ??
		input.reviewPacket.controlPlane.decisionId ??
		input.decisionEnvelope?.runtimeLink?.decisionId
	);
}

function resolveTraceId(input: ConnectReviewIngestInput) {
	return (
		input.patchVerdict?.controlPlane.traceId ??
		input.reviewPacket.controlPlane.traceId ??
		input.contextPack?.actor.traceId ??
		input.decisionEnvelope?.runtimeLink?.traceId
	);
}

function deriveStatus(
	approvalStatus: ConnectReviewQueueItem['approvalStatus'],
	laneStatus: ConnectReviewQueueItem['laneStatus']
): ConnectReviewQueueStatus {
	if (laneStatus === 'completed') return 'completed';
	if (
		laneStatus === 'blocked' ||
		laneStatus === 'failed' ||
		laneStatus === 'aborted'
	)
		return 'blocked';
	if (approvalStatus === 'approved') return 'approved';
	if (approvalStatus === 'rejected') return 'rejected';
	if (approvalStatus === 'expired') return 'expired';
	return 'pending';
}

function isSweepCandidate(item: ConnectReviewQueueItem, staleAfterMs: number) {
	if (item.status !== 'pending') {
		return false;
	}
	return Date.now() - new Date(item.updatedAt).getTime() >= staleAfterMs;
}
