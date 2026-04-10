import { Elysia } from 'elysia';
import { channelControlPlaneApprovalsHandler } from './channel-control-plane-approvals-handler';
import { channelControlPlaneConnectReviewHandler } from './channel-control-plane-connect-review-handler';
import { channelControlPlaneExecutionLanesHandler } from './channel-control-plane-execution-lanes-handler';
import {
	authorizeActor,
	deny,
	readDate,
	readPositiveInt,
	readString,
	safeParseJson,
	toPolicyExplainEvent,
} from './channel-control-plane-handler.utils';
import { channelControlPlaneSkillsHandler } from './channel-control-plane-skills-handler';
import { getChannelRuntimeResources } from './channel-runtime-resources';

export const channelControlPlaneHandler = new Elysia()
	.use(channelControlPlaneApprovalsHandler)
	.use(channelControlPlaneConnectReviewHandler)
	.use(channelControlPlaneSkillsHandler)
	.use(channelControlPlaneExecutionLanesHandler)
	.get('/internal/control-plane/dashboard', async ({ request, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const runtime = await getChannelRuntimeResources();
		const [approvals, connectReviewQueue, traces, skills] = await Promise.all([
			runtime.approvalService.listPendingApprovals({ limit: 25 }),
			runtime.connectReviewService.list({ limit: 25, status: 'pending' }),
			runtime.traceService.listExecutionTraces({ limit: 25 }),
			runtime.skillRegistry.list({ includeDisabled: true, limit: 50 }),
		]);
		return {
			ok: true,
			dashboard: {
				connectReviewQueue,
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
