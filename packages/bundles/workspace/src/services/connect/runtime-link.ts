import {
	buildChannelPlanTrace,
	type ChannelPolicyDecision,
	type ChannelRuntimeStore,
	type ChannelTraceService,
	compileChannelPlan,
	finalizeChannelPlan,
	replayExecutionTrace as replayStoredTrace,
	resolveChannelExecutionActor,
} from '@contractspec/integration.runtime/channel';
import { createHash } from 'crypto';
import { connectVerdictToPolicy } from './assessment';
import type {
	ConnectControlPlaneRuntime,
	ConnectTraceLookup,
} from './runtime-types';
import type { ConnectRuntimeLink } from './types';

const CONNECT_PROVIDER_KEY = 'connect.local';
const CONNECT_PROMPT_VERSION = 'connect.runtime-link.v1';
const CONNECT_POLICY_VERSION = 'connect.adapter.v1';
const CONNECT_MODEL_NAME = 'connect-control-plane-bridge';

export function createConnectControlPlaneRuntime(input: {
	store: ChannelRuntimeStore;
	traceService: ChannelTraceService;
	now?: () => Date;
}): ConnectControlPlaneRuntime {
	return {
		linkDecision: async ({
			connectDecisionId,
			createdAt,
			input: verifyInput,
			patchVerdict,
			planPacket,
			workspace,
		}) => {
			const occurredAt = new Date(createdAt);
			const rawPayload = JSON.stringify({
				connectDecisionId,
				objective: planPacket.objective,
				taskId: planPacket.taskId,
				tool: verifyInput.tool,
				verdict: patchVerdict.verdict,
			});
			const event = {
				workspaceId: workspace.repoId,
				providerKey: CONNECT_PROVIDER_KEY,
				externalEventId: connectDecisionId,
				eventType:
					verifyInput.tool === 'acp.fs.access'
						? `connect.fs.${verifyInput.operation}`
						: 'connect.terminal.exec',
				occurredAt,
				signatureValid: true,
				traceId: patchVerdict.controlPlane.traceId,
				thread: {
					externalThreadId: `connect:${planPacket.taskId}`,
					externalUserId: planPacket.actor.id,
				},
				message: {
					text: buildSummary(planPacket.objective, verifyInput),
				},
				metadata: compactRecord({
					connectDecisionId,
					connectVerdict: patchVerdict.verdict,
					sessionId: planPacket.actor.sessionId,
					workflowId: `connect:${planPacket.taskId}`,
				}),
				rawPayload,
			};
			const claim = await input.store.claimEventReceipt({
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				externalEventId: event.externalEventId,
				eventType: event.eventType,
				signatureValid: true,
				payloadHash: sha256(rawPayload),
				traceId: event.traceId,
			});
			if (claim.duplicate) {
				return findExistingRuntimeLink(
					input.store,
					workspace.repoId,
					connectDecisionId
				);
			}

			const thread = await input.store.upsertThread({
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				externalThreadId: event.thread.externalThreadId,
				externalUserId: event.thread.externalUserId,
				occurredAt,
			});
			const actor = resolveChannelExecutionActor(event, {
				actorId: planPacket.actor.id,
				actorType: planPacket.actor.type,
				capabilityGrants: capabilityGrantsFor(patchVerdict.verdict),
				capabilitySource: 'connect',
				sessionId: planPacket.actor.sessionId,
			});
			const compiledPlan = compileChannelPlan({
				event,
				receiptId: claim.receiptId,
				threadId: thread.id,
				actor,
				now: occurredAt,
			});
			const finalizedPlan = finalizeChannelPlan({
				plan: compiledPlan,
				decision: toPolicyDecision(patchVerdict),
				approvalTimeoutMs: 15 * 60 * 1000,
				now: occurredAt,
			});
			const decision = await input.store.saveDecision({
				receiptId: claim.receiptId,
				threadId: thread.id,
				policyMode: finalizedPlan.policy?.verdict ?? 'blocked',
				riskTier: finalizedPlan.policy?.riskTier ?? 'blocked',
				confidence: finalizedPlan.policy?.confidence ?? 0.5,
				modelName: CONNECT_MODEL_NAME,
				promptVersion: CONNECT_PROMPT_VERSION,
				policyVersion: CONNECT_POLICY_VERSION,
				toolTrace: buildChannelPlanTrace(finalizedPlan),
				actionPlan: finalizedPlan,
				requiresApproval: finalizedPlan.approval.required,
				approvalStatus: finalizedPlan.approval.required
					? 'pending'
					: 'not_required',
			});
			await input.store.appendTraceEvent({
				stage: 'decision',
				status: finalizedPlan.approval.required ? 'pending' : 'processed',
				decisionId: decision.id,
				receiptId: claim.receiptId,
				traceId: finalizedPlan.traceId,
				workspaceId: workspace.repoId,
				providerKey: CONNECT_PROVIDER_KEY,
				sessionId: planPacket.actor.sessionId,
				workflowId: `connect:${planPacket.taskId}`,
				metadata: compactRecord({
					connectDecisionId,
					connectVerdict: patchVerdict.verdict,
					tool: verifyInput.tool,
				}),
			});

			return {
				approvalStatus: decision.approvalStatus,
				decisionId: decision.id,
				planId: finalizedPlan.id,
				providerKey: CONNECT_PROVIDER_KEY,
				receiptId: claim.receiptId,
				threadId: thread.id,
				traceId: finalizedPlan.traceId,
				workspaceId: workspace.repoId,
			};
		},
		getExecutionTrace: (lookup) => resolveTrace(input.traceService, lookup),
		replayExecutionTrace: async (lookup) => {
			if (lookup.decisionId) {
				return input.traceService.replayExecutionTrace(lookup.decisionId);
			}
			const trace = await resolveTrace(input.traceService, lookup);
			return trace
				? replayStoredTrace(trace as Parameters<typeof replayStoredTrace>[0])
				: null;
		},
	};
}

async function findExistingRuntimeLink(
	store: ChannelRuntimeStore,
	workspaceId: string,
	connectDecisionId: string
): Promise<ConnectRuntimeLink | null> {
	const existing = await store.listDecisions({
		externalEventId: connectDecisionId,
		limit: 1,
		providerKey: CONNECT_PROVIDER_KEY,
		workspaceId,
	});
	const decision = existing[0];
	return decision
		? {
				approvalStatus: decision.approvalStatus,
				decisionId: decision.id,
				planId: decision.actionPlan.id,
				providerKey: CONNECT_PROVIDER_KEY,
				receiptId: decision.receiptId,
				threadId: decision.threadId,
				traceId: decision.actionPlan.traceId,
				workspaceId,
			}
		: null;
}

async function resolveTrace(
	traceService: ChannelTraceService,
	lookup: ConnectTraceLookup
) {
	if (lookup.decisionId) {
		return traceService.getExecutionTrace(lookup.decisionId);
	}
	if (!lookup.traceId) {
		return null;
	}
	const traces = await traceService.listExecutionTraces({
		limit: 1,
		traceId: lookup.traceId,
	});
	return traces[0] ?? null;
}

function toPolicyDecision(patchVerdict: {
	verdict: 'permit' | 'rewrite' | 'require_review' | 'deny';
	checks: Array<{ detail: string; status: 'pass' | 'fail' | 'warn' }>;
	summary?: string;
}): ChannelPolicyDecision {
	const policy = connectVerdictToPolicy(patchVerdict.verdict);
	return {
		confidence: patchVerdict.verdict === 'deny' ? 0.98 : 0.82,
		policyRef: undefined,
		reasons: patchVerdict.checks.map(
			(check) => `${check.status}:${check.detail}`
		),
		responseText: patchVerdict.summary ?? 'Connect decision recorded.',
		requiresApproval: policy.requiresApproval,
		riskTier:
			patchVerdict.verdict === 'permit'
				? 'low'
				: patchVerdict.verdict === 'rewrite'
					? 'medium'
					: patchVerdict.verdict === 'require_review'
						? 'high'
						: 'blocked',
		verdict: policy.controlPlaneVerdict,
	};
}

function capabilityGrantsFor(
	verdict: 'permit' | 'rewrite' | 'require_review' | 'deny'
) {
	return verdict === 'require_review'
		? ['control-plane.approval.request']
		: ['control-plane.channel-runtime.reply.autonomous'];
}

function buildSummary(objective: string, input: { tool: string }) {
	return `${objective} [${input.tool}]`;
}

function sha256(value: string) {
	return createHash('sha256').update(value).digest('hex');
}

function compactRecord(
	record: Record<string, string | undefined>
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(record).filter((entry): entry is [string, string] =>
			Boolean(entry[1])
		)
	);
}
