import { Elysia } from 'elysia';

import {
	authorizeActor,
	deny,
	readDate,
	readPositiveInt,
	readString,
	readVerifiedOperatorIdentity,
	safeParseJson,
	toControlPlaneErrorResponse,
	toPolicyExplainEvent,
} from './channel-control-plane-handler.utils';
import { channelControlPlaneSkillsHandler } from './channel-control-plane-skills-handler';
import { getChannelRuntimeResources } from './channel-runtime-resources';

export const channelControlPlaneHandler = new Elysia()
	.use(channelControlPlaneSkillsHandler)
	.get('/internal/control-plane/approvals', async ({ request, query, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const runtime = await getChannelRuntimeResources();
		return {
			ok: true,
			items: await runtime.approvalService.listPendingApprovals({
				workspaceId: readString(query.workspaceId),
				providerKey: readString(query.providerKey),
				limit: readPositiveInt(query.limit),
			}),
		};
	})
	.post(
		'/internal/control-plane/approvals/:decisionId/approve',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.approval',
				'control-plane.execution.approve',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const actor = auth.actor;
			const operator = readVerifiedOperatorIdentity(request);
			if (!operator) {
				set.status = 403;
				return deny('forbidden');
			}
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					decision: await runtime.approvalService.approve({
						decisionId: params.decisionId,
						approvedBy: operator?.operatorId ?? actor.id,
						actorType: operator ? 'human' : actor.type,
						capabilityGrants: actor.capabilityGrants,
						capabilitySource: actor.capabilitySource,
						sessionId: operator?.sessionId ?? actor.sessionId,
					}),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/approvals/:decisionId/reject',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.approval',
				'control-plane.execution.reject',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const actor = auth.actor;
			const body = await safeParseJson(request);
			const operator = readVerifiedOperatorIdentity(request, body);
			if (!operator) {
				set.status = 403;
				return deny('forbidden');
			}
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					decision: await runtime.approvalService.reject({
						decisionId: params.decisionId,
						rejectedBy: operator?.operatorId ?? actor.id,
						actorType: operator ? 'human' : actor.type,
						capabilityGrants: actor.capabilityGrants,
						capabilitySource: actor.capabilitySource,
						sessionId: operator?.sessionId ?? actor.sessionId,
						reason: readString(body.reason),
					}),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/approvals/expire',
		async ({ request, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.approval',
				'control-plane.execution.expire',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const actor = auth.actor;
			const operator = readVerifiedOperatorIdentity(request);
			if (!operator) {
				set.status = 403;
				return deny('forbidden');
			}
			const runtime = await getChannelRuntimeResources();
			return {
				ok: true,
				items: await runtime.approvalService.expirePendingApprovals({
					actorId: operator?.operatorId ?? actor.id,
					actorType: operator ? 'human' : actor.type,
					capabilityGrants: actor.capabilityGrants,
					capabilitySource: actor.capabilitySource,
					sessionId: operator?.sessionId ?? actor.sessionId,
				}),
			};
		}
	)
	.get('/internal/control-plane/dashboard', async ({ request, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const runtime = await getChannelRuntimeResources();
		const [approvals, traces, skills] = await Promise.all([
			runtime.approvalService.listPendingApprovals({ limit: 25 }),
			runtime.traceService.listExecutionTraces({ limit: 25 }),
			runtime.skillRegistry.list({ includeDisabled: true, limit: 50 }),
		]);
		return {
			ok: true,
			dashboard: {
				riskQueue: approvals,
				executionStatus: traces,
				driftAlerts: skills.items.filter(
					(skill) =>
						skill.status !== 'installed' || !skill.verificationReport.verified
				),
			},
		};
	})
	.get('/internal/control-plane/traces', async ({ request, query, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const runtime = await getChannelRuntimeResources();
		return {
			ok: true,
			items: await runtime.traceService.listExecutionTraces({
				workspaceId: readString(query.workspaceId),
				providerKey: readString(query.providerKey),
				traceId: readString(query.traceId),
				receiptId: readString(query.receiptId),
				externalEventId: readString(query.externalEventId),
				approvalStatus: readString(query.approvalStatus) as
					| undefined
					| 'not_required'
					| 'pending'
					| 'approved'
					| 'rejected'
					| 'expired',
				actorId: readString(query.actorId),
				sessionId: readString(query.sessionId),
				workflowId: readString(query.workflowId),
				createdAfter: readDate(query.createdAfter),
				createdBefore: readDate(query.createdBefore),
				limit: readPositiveInt(query.limit),
			}),
		};
	})
	.get(
		'/internal/control-plane/traces/:decisionId',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const runtime = await getChannelRuntimeResources();
			const trace = await runtime.traceService.getExecutionTrace(
				params.decisionId
			);
			if (!trace) {
				set.status = 404;
				return { ok: false, error: 'not_found' };
			}
			return { ok: true, trace };
		}
	)
	.get(
		'/internal/control-plane/traces/:decisionId/replay',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const runtime = await getChannelRuntimeResources();
			const replay = await runtime.traceService.replayExecutionTrace(
				params.decisionId
			);
			if (!replay) {
				set.status = 404;
				return { ok: false, error: 'not_found' };
			}
			return { ok: true, replay };
		}
	)
	.post('/internal/control-plane/policy/explain', async ({ request, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const actor = auth.actor;
		const body = await safeParseJson(request);
		const runtime = await getChannelRuntimeResources();
		const event = toPolicyExplainEvent(body);
		const explanation = runtime.policy.explain
			? runtime.policy.explain({ event, actor })
			: { decision: runtime.policy.evaluate({ event, actor }) };
		return { ok: true, explanation };
	});
