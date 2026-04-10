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

export const channelControlPlaneConnectReviewHandler = new Elysia()
	.post('/internal/control-plane/connect/reviews', async ({ request, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.audit']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		try {
			const runtime = await getChannelRuntimeResources();
			const body = await safeParseJson(request);
			return {
				ok: true,
				item: await runtime.connectReviewService.ingest({
					queue: readString(body.queue),
					reviewPacket: body.reviewPacket as never,
					contextPack: body.contextPack as never,
					planPacket: body.planPacket as never,
					patchVerdict: body.patchVerdict as never,
					decisionEnvelope: body.decisionEnvelope as never,
				}),
			};
		} catch (error) {
			return toControlPlaneErrorResponse(error, set);
		}
	})
	.get(
		'/internal/control-plane/connect/reviews',
		async ({ request, query, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const runtime = await getChannelRuntimeResources();
			return {
				ok: true,
				items: await runtime.connectReviewService.list({
					queue: readString(query.queue),
					sourceDecisionId: readString(query.sourceDecisionId),
					status: readString(query.status) as never,
					limit: readPositiveInt(query.limit),
				}),
			};
		}
	)
	.get(
		'/internal/control-plane/connect/reviews/:id',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, ['control-plane.audit']);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const runtime = await getChannelRuntimeResources();
			const item = await runtime.connectReviewService.get(params.id);
			if (!item) {
				set.status = 404;
				return { ok: false, error: 'not_found' };
			}
			return { ok: true, item };
		}
	);
