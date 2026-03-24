import { Elysia } from 'elysia';

import {
	authorizeActor,
	deny,
	readBoolean,
	readPositiveInt,
	readSkillRequest,
	readString,
	readVerifiedOperatorIdentity,
	safeParseJson,
	toControlPlaneErrorResponse,
} from './channel-control-plane-handler.utils';
import { getChannelRuntimeResources } from './channel-runtime-resources';

export const channelControlPlaneSkillsHandler = new Elysia()
	.get('/internal/control-plane/skills', async ({ request, query, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.skill-registry']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const runtime = await getChannelRuntimeResources();
		return {
			ok: true,
			...(await runtime.skillRegistry.list({
				includeDisabled: readBoolean(query.includeDisabled),
				limit: readPositiveInt(query.limit),
				offset: readPositiveInt(query.offset),
				skillKey: readString(query.skillKey),
			})),
		};
	})
	.post('/internal/control-plane/skills/verify', async ({ request, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.skill-registry']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const body = await safeParseJson(request);
		let skillRequest;
		try {
			skillRequest = readSkillRequest(body);
		} catch (error) {
			set.status = 400;
			return {
				ok: false,
				error: error instanceof Error ? error.message : 'invalid_request',
			};
		}
		const runtime = await getChannelRuntimeResources();
		return {
			ok: true,
			verification: runtime.skillRegistry.verify(skillRequest),
		};
	})
	.post('/internal/control-plane/skills/install', async ({ request, set }) => {
		const auth = authorizeActor(request, set, ['control-plane.skill-registry']);
		if (!auth.actor) return deny(auth.error ?? 'unauthorized');
		const body = await safeParseJson(request);
		const operator = readVerifiedOperatorIdentity(request, body);
		if (!operator) {
			set.status = 403;
			return deny('forbidden');
		}
		let skillRequest;
		try {
			skillRequest = readSkillRequest(body);
		} catch (error) {
			set.status = 400;
			return {
				ok: false,
				error: error instanceof Error ? error.message : 'invalid_request',
			};
		}
		const runtime = await getChannelRuntimeResources();
		try {
			return {
				ok: true,
				installation: await runtime.skillRegistry.install({
					...skillRequest,
					installedBy: operator?.operatorId ?? auth.actor.id,
				}),
			};
		} catch (error) {
			return toControlPlaneErrorResponse(error, set);
		}
	})
	.post(
		'/internal/control-plane/skills/:installationId/disable',
		async ({ request, params, set }) => {
			const auth = authorizeActor(request, set, [
				'control-plane.skill-registry',
			]);
			if (!auth.actor) return deny(auth.error ?? 'unauthorized');
			const operator = readVerifiedOperatorIdentity(request);
			if (!operator) {
				set.status = 403;
				return deny('forbidden');
			}
			try {
				const runtime = await getChannelRuntimeResources();
				return {
					ok: true,
					installation: await runtime.skillRegistry.disable({
						installationId: params.installationId,
						disabledBy: operator?.operatorId ?? auth.actor.id,
					}),
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	);
