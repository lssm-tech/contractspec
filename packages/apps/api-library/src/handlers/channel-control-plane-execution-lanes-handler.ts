import { Elysia } from 'elysia';
import {
	authorizeActor,
	deny,
	readPositiveInt,
	readString,
	safeParseJson,
	toControlPlaneErrorResponse,
} from './channel-control-plane-handler.utils';
import { getChannelRuntimeResources } from './channel-runtime-resources';

export const channelControlPlaneExecutionLanesHandler = new Elysia()
	.get('/internal/control-plane/lanes', async ({ request, query, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const runtime = await getChannelRuntimeResources();
		return {
			ok: true,
			items: await runtime.executionLaneService.list({
				lane: readString(query.lane),
				status: readString(query.status),
				limit: readPositiveInt(query.limit),
			}),
		};
	})
	.get(
		'/internal/control-plane/lanes/:runId',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const runtime = await getChannelRuntimeResources();
			const snapshot = await runtime.executionLaneService.get(params.runId);
			if (!snapshot) {
				set.status = 404;
				return { ok: false, error: 'not_found' };
			}
			return {
				ok: true,
				run: snapshot,
				team: await runtime.executionLaneService.getTeamStatus(params.runId),
				completion: await runtime.executionLaneService.getCompletionStatus(
					params.runId
				),
			};
		}
	)
	.get(
		'/internal/control-plane/lanes/:runId/evidence',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					exported: await runtime.executionLaneService.exportEvidence(
						params.runId
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.get(
		'/internal/control-plane/lanes/:runId/replay',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					replay: await runtime.executionLaneService.openReplay(
						params.runId,
						auth.actor.id
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/pause',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.pause',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					run: await runtime.executionLaneService.pause(
						params.runId,
						auth.actor.id
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/resume',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.resume',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					run: await runtime.executionLaneService.resume(
						params.runId,
						auth.actor.id
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/retry',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.retry',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					run: await runtime.executionLaneService.retry(
						params.runId,
						auth.actor.id
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/abort',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.shutdown',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const body = await safeParseJson(request);
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					run: await runtime.executionLaneService.abort(
						params.runId,
						readString(body.reason),
						auth.actor.id
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/shutdown',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.shutdown',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const body = await safeParseJson(request);
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					run: await runtime.executionLaneService.shutdown(
						params.runId,
						readString(body.reason),
						auth.actor.id
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/request-approval',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.approve',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const body = await safeParseJson(request);
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					approval: await runtime.executionLaneService.requestApproval(
						params.runId,
						{
							role: readString(body.role) ?? 'verifier',
							verdict:
								(readString(body.verdict) as
									| 'approve'
									| 'acknowledge'
									| undefined) ?? 'approve',
							comment: readString(body.comment),
							actorId: auth.actor.id,
						}
					),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.post(
		'/internal/control-plane/lanes/:runId/escalate',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.execution.shutdown',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			try {
				const body = await safeParseJson(request);
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					run: await runtime.executionLaneService.escalate(params.runId, {
						reason: readString(body.reason) ?? 'Operator escalation requested.',
						target: readString(body.target) ?? 'human',
						actorId: auth.actor.id,
					}),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	);
