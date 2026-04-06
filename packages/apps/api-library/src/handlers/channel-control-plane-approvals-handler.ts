import { Elysia } from 'elysia';
import {
	authorizeActor,
	deny,
	readPositiveInt,
	readString,
	readVerifiedOperatorIdentity,
	safeParseJson,
	toControlPlaneErrorResponse,
} from './channel-control-plane-handler.utils';
import { getChannelRuntimeResources } from './channel-runtime-resources';

export const channelControlPlaneApprovalsHandler = new Elysia()
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
	);
