import { Elysia } from 'elysia';
import { getBuilderRuntimeResources } from './builder-runtime-resources';
import {
	readString,
	safeParseJson,
	toControlPlaneErrorResponse,
} from './channel-control-plane-handler.utils';
import { resolveInternalControlPlaneActor } from './channel-internal-auth';

function authorizeBuilderActor(
	request: Request
): 'unauthorized' | 'forbidden' | null {
	const actor = resolveInternalControlPlaneActor(request);
	if (!actor) {
		return 'unauthorized';
	}
	const hasBuilderGrant = actor.capabilityGrants.some(
		(grant) => grant.startsWith('builder.') || grant === 'control-plane.core'
	);
	return hasBuilderGrant ? null : 'forbidden';
}

function parseBuilderOperationInput(body: Record<string, unknown>) {
	return {
		workspaceId: readString(body.workspaceId),
		entityId: readString(body.entityId),
		conversationId: readString(body.conversationId),
		payload:
			typeof body.payload === 'object' && body.payload !== null
				? (body.payload as Record<string, unknown>)
				: body,
	};
}

export const builderControlPlaneHandler = new Elysia()
	.post(
		'/internal/builder/commands/:commandKey',
		async ({ request, params, set }) => {
			const authResult = authorizeBuilderActor(request);
			if (authResult) {
				set.status = authResult === 'unauthorized' ? 401 : 403;
				return {
					ok: false,
					error: authResult,
				};
			}
			try {
				const body = await safeParseJson(request);
				const runtime = await getBuilderRuntimeResources();
				const result = await runtime.service.executeCommand(
					params.commandKey,
					parseBuilderOperationInput(body)
				);
				return {
					ok: true,
					result,
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	)
	.get(
		'/internal/builder/queries/:queryKey',
		async ({ request, params, query, set }) => {
			const authResult = authorizeBuilderActor(request);
			if (authResult) {
				set.status = authResult === 'unauthorized' ? 401 : 403;
				return {
					ok: false,
					error: authResult,
				};
			}
			try {
				const runtime = await getBuilderRuntimeResources();
				const result = await runtime.service.executeQuery(params.queryKey, {
					workspaceId: readString(query.workspaceId),
					entityId: readString(query.entityId),
					conversationId: readString(query.conversationId),
				});
				return {
					ok: true,
					result,
				};
			} catch (error) {
				return toControlPlaneErrorResponse(error, set);
			}
		}
	);
