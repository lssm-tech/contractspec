import { createHash, randomUUID } from 'node:crypto';

import {
	ChannelAuthorizationEngine,
	type ChannelAuthorizationEvaluator,
} from './authorization';
import { resolveEventTraceId } from './plan-utils';
import {
	buildChannelPlanTrace,
	compileChannelPlan,
	finalizeChannelPlan,
	getExecutionStep,
	resolveChannelExecutionActor,
} from './planner';
import { MessagingPolicyEngine, type MessagingPolicyEvaluator } from './policy';
import type { ChannelRuntimeStore } from './store';
import type { ChannelTelemetryEmitter } from './telemetry';
import { recordChannelTelemetry } from './telemetry-recorder';
import type {
	ChannelExecutionActor,
	ChannelInboundEvent,
	ChannelIngestResult,
} from './types';

export interface ChannelRuntimeServiceOptions {
	policy?: MessagingPolicyEvaluator;
	asyncProcessing?: boolean;
	processInBackground?: (task: () => Promise<void>) => void;
	modelName?: string;
	promptVersion?: string;
	policyVersion?: string;
	approvalTimeoutMs?: number;
	defaultCapabilityGrants?: string[];
	defaultCapabilitySource?: string;
	authorization?: ChannelAuthorizationEvaluator;
	actorResolver?: (event: ChannelInboundEvent) => ChannelExecutionActor;
	now?: () => Date;
	telemetry?: ChannelTelemetryEmitter;
}

export class ChannelRuntimeService {
	private readonly policy: MessagingPolicyEvaluator;
	private readonly asyncProcessing: boolean;
	private readonly processInBackground: (task: () => Promise<void>) => void;
	private readonly modelName: string;
	private readonly promptVersion: string;
	private readonly policyVersion: string;
	private readonly approvalTimeoutMs: number;
	private readonly defaultCapabilityGrants: string[];
	private readonly defaultCapabilitySource?: string;
	private readonly authorization: ChannelAuthorizationEvaluator;
	private readonly actorResolver?: (
		event: ChannelInboundEvent
	) => ChannelExecutionActor;
	private readonly now: () => Date;
	private readonly telemetry?: ChannelTelemetryEmitter;

	constructor(
		private readonly store: ChannelRuntimeStore,
		options: ChannelRuntimeServiceOptions = {}
	) {
		this.policy = options.policy ?? new MessagingPolicyEngine();
		this.asyncProcessing = options.asyncProcessing ?? true;
		this.processInBackground =
			options.processInBackground ??
			((task) => {
				setTimeout(() => {
					void task();
				}, 0);
			});
		this.modelName = options.modelName ?? 'policy-heuristics-v1';
		this.promptVersion = options.promptVersion ?? 'channel-runtime.v1';
		this.policyVersion =
			options.policyVersion ?? 'channel.messaging-policy.v2.0.0';
		this.approvalTimeoutMs = options.approvalTimeoutMs ?? 15 * 60 * 1000;
		this.defaultCapabilityGrants = [...(options.defaultCapabilityGrants ?? [])];
		this.defaultCapabilitySource = options.defaultCapabilitySource;
		this.authorization =
			options.authorization ?? new ChannelAuthorizationEngine();
		this.actorResolver = options.actorResolver;
		this.now = options.now ?? (() => new Date());
		this.telemetry = options.telemetry;
	}

	async ingest(event: ChannelInboundEvent): Promise<ChannelIngestResult> {
		const startedAtMs = Date.now();
		const traceId = resolveEventTraceId(event);
		const claim = await this.store.claimEventReceipt({
			workspaceId: event.workspaceId,
			providerKey: event.providerKey,
			externalEventId: event.externalEventId,
			eventType: event.eventType,
			signatureValid: event.signatureValid,
			payloadHash: event.rawPayload ? sha256(event.rawPayload) : undefined,
			traceId,
		});

		if (claim.duplicate) {
			await recordChannelTelemetry(this.store, this.telemetry, {
				stage: 'ingest',
				status: 'duplicate',
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				receiptId: claim.receiptId,
				traceId,
				latencyMs: Date.now() - startedAtMs,
			});
			return {
				status: 'duplicate',
				receiptId: claim.receiptId,
			};
		}

		await recordChannelTelemetry(this.store, this.telemetry, {
			stage: 'ingest',
			status: 'accepted',
			workspaceId: event.workspaceId,
			providerKey: event.providerKey,
			receiptId: claim.receiptId,
			sessionId: event.metadata?.['sessionId'],
			workflowId: event.metadata?.['workflowId'],
			traceId,
			latencyMs: Date.now() - startedAtMs,
		});

		if (!event.signatureValid) {
			await this.store.updateReceiptStatus(claim.receiptId, 'rejected', {
				code: 'INVALID_SIGNATURE',
				message: 'Inbound event signature is invalid.',
			});
			await recordChannelTelemetry(this.store, this.telemetry, {
				stage: 'ingest',
				status: 'rejected',
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				receiptId: claim.receiptId,
				sessionId: event.metadata?.['sessionId'],
				workflowId: event.metadata?.['workflowId'],
				traceId,
				latencyMs: Date.now() - startedAtMs,
				metadata: {
					errorCode: 'INVALID_SIGNATURE',
				},
			});
			return {
				status: 'rejected',
				receiptId: claim.receiptId,
			};
		}

		const task = async () => {
			await this.processAcceptedEvent(claim.receiptId, event);
		};

		if (this.asyncProcessing) {
			this.processInBackground(task);
		} else {
			await task();
		}

		return {
			status: 'accepted',
			receiptId: claim.receiptId,
		};
	}

	private async processAcceptedEvent(
		receiptId: string,
		event: ChannelInboundEvent
	): Promise<void> {
		const traceId = resolveEventTraceId(event);
		try {
			await this.store.updateReceiptStatus(receiptId, 'processing');

			const thread = await this.store.upsertThread({
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				externalThreadId: event.thread.externalThreadId,
				externalChannelId: event.thread.externalChannelId,
				externalUserId: event.thread.externalUserId,
				occurredAt: event.occurredAt,
			});
			const actor =
				this.actorResolver?.(event) ??
				resolveChannelExecutionActor(event, {
					capabilityGrants: this.defaultCapabilityGrants,
					capabilitySource: this.defaultCapabilitySource,
				});
			const compiledPlan = compileChannelPlan({
				event,
				receiptId,
				threadId: thread.id,
				actor,
				now: this.now(),
			});

			const policyDecision = this.policy.evaluate({
				event,
				receiptId,
				threadId: thread.id,
				sessionId: event.metadata?.['sessionId'],
				workflowId: event.metadata?.['workflowId'],
				threadState: thread.state,
				compiledPlan,
				actor,
			});
			const authorizedDecision = this.authorization.authorizePlan({
				actor,
				plan: compiledPlan,
				decision: policyDecision,
			});
			const finalizedPlan = finalizeChannelPlan({
				plan: compiledPlan,
				decision: authorizedDecision,
				approvalTimeoutMs: this.approvalTimeoutMs,
				now: this.now(),
			});
			const decision = await this.store.saveDecision({
				receiptId,
				threadId: thread.id,
				policyMode: toPolicyMode(authorizedDecision.verdict),
				riskTier: authorizedDecision.riskTier,
				confidence: authorizedDecision.confidence,
				modelName: this.modelName,
				promptVersion: this.promptVersion,
				policyVersion: authorizedDecision.policyRef
					? `${authorizedDecision.policyRef.key}.v${authorizedDecision.policyRef.version}`
					: this.policyVersion,
				toolTrace: buildChannelPlanTrace(finalizedPlan),
				actionPlan: finalizedPlan,
				requiresApproval: authorizedDecision.requiresApproval,
				approvalStatus: authorizedDecision.requiresApproval
					? 'pending'
					: 'not_required',
			});
			await recordChannelTelemetry(
				this.store,
				this.telemetry,
				{
					stage: 'decision',
					status: 'processed',
					workspaceId: event.workspaceId,
					providerKey: event.providerKey,
					receiptId,
					sessionId: event.metadata?.['sessionId'],
					workflowId: event.metadata?.['workflowId'],
					traceId: finalizedPlan.traceId,
					metadata: {
						verdict: authorizedDecision.verdict,
						riskTier: authorizedDecision.riskTier,
						confidence: authorizedDecision.confidence,
						planId: finalizedPlan.id,
						actorId: finalizedPlan.actor.id,
						actorType: finalizedPlan.actor.type,
					},
				},
				decision.id
			);

			if (authorizedDecision.verdict === 'autonomous') {
				const executionStep = getExecutionStep(finalizedPlan);
				if (!executionStep || executionStep.status !== 'completed') {
					throw new Error(
						'Autonomous dispatch requires a compiled execution step in completed state.'
					);
				}
				const outboxAction = await this.store.enqueueOutboxAction({
					workspaceId: event.workspaceId,
					providerKey: event.providerKey,
					decisionId: decision.id,
					threadId: thread.id,
					actionType: 'reply',
					idempotencyKey: buildOutboxIdempotencyKey(
						finalizedPlan.id,
						executionStep.id,
						authorizedDecision.responseText
					),
					target: {
						externalThreadId: event.thread.externalThreadId,
						externalChannelId: event.thread.externalChannelId,
						externalUserId: event.thread.externalUserId,
					},
					payload: {
						id: randomUUID(),
						text: authorizedDecision.responseText,
					},
				});
				await recordChannelTelemetry(
					this.store,
					this.telemetry,
					{
						stage: 'outbox',
						status: 'accepted',
						workspaceId: event.workspaceId,
						providerKey: event.providerKey,
						receiptId,
						actionId: outboxAction.actionId,
						sessionId: event.metadata?.['sessionId'],
						workflowId: event.metadata?.['workflowId'],
						traceId: finalizedPlan.traceId,
						metadata: {
							actionType: 'reply',
							actorId: finalizedPlan.actor.id,
							actorType: finalizedPlan.actor.type,
							planId: finalizedPlan.id,
						},
					},
					decision.id
				);
			}

			await this.store.updateReceiptStatus(receiptId, 'processed');
			await recordChannelTelemetry(this.store, this.telemetry, {
				stage: 'ingest',
				status: 'processed',
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				receiptId,
				sessionId: event.metadata?.['sessionId'],
				workflowId: event.metadata?.['workflowId'],
				traceId,
			});
		} catch (error) {
			await this.store.updateReceiptStatus(receiptId, 'failed', {
				code: 'PROCESSING_FAILED',
				message: error instanceof Error ? error.message : String(error),
			});
			await recordChannelTelemetry(this.store, this.telemetry, {
				stage: 'ingest',
				status: 'failed',
				workspaceId: event.workspaceId,
				providerKey: event.providerKey,
				receiptId,
				sessionId: event.metadata?.['sessionId'],
				workflowId: event.metadata?.['workflowId'],
				traceId,
				metadata: {
					errorCode: 'PROCESSING_FAILED',
				},
			});
		}
	}
}

function buildOutboxIdempotencyKey(
	planId: string,
	stepId: string,
	responseText: string
): string {
	return sha256(`${planId}:${stepId}:reply:${responseText}`);
}

function toPolicyMode(
	verdict: 'autonomous' | 'assist' | 'blocked'
): 'autonomous' | 'assist' | 'blocked' {
	return verdict;
}

function sha256(value: string): string {
	return createHash('sha256').update(value).digest('hex');
}
