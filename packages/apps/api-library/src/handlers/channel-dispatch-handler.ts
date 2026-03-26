import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { Elysia } from 'elysia';
import { isDispatchRequestAuthorized } from './channel-internal-auth';
import { getChannelRuntimeResources } from './channel-runtime-resources';
import { resolveMessagingSender } from './channel-sender-resolver';

export const channelDispatchHandler = new Elysia()
	.post('/internal/channel/dispatch', async ({ request, set }) => {
		const limit = extractLimitFromBody(await safeParseJson(request));
		return dispatch(request, set, limit);
	})
	.get('/internal/channel/dispatch', async ({ request, set, query }) => {
		const parsedLimit = Number.parseInt(String(query.limit ?? ''), 10);
		const limit =
			Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;
		return dispatch(request, set, limit);
	});

async function dispatch(
	request: Request,
	set: { status?: number | string },
	limit?: number
): Promise<Record<string, unknown>> {
	if (!isDispatchAuthorized(request)) {
		set.status = 401;
		return {
			ok: false,
			error: 'unauthorized',
		};
	}

	try {
		const runtime = await getChannelRuntimeResources();
		const summary = await runtime.dispatcher.dispatchBatch(
			resolveMessagingSender,
			limit
		);

		return {
			ok: true,
			summary,
		};
	} catch (error) {
		appLogger.error('Channel dispatch failed', {
			error: error instanceof Error ? error.message : String(error),
		});
		set.status = 500;
		return {
			ok: false,
			error: 'dispatch_failed',
		};
	}
}

async function safeParseJson(request: Request): Promise<unknown> {
	try {
		return await request.json();
	} catch {
		return {};
	}
}

function extractLimitFromBody(body: unknown): number | undefined {
	const candidate = (body as { limit?: unknown })?.limit;
	return typeof candidate === 'number' && candidate > 0
		? Math.floor(candidate)
		: undefined;
}

function isDispatchAuthorized(request: Request): boolean {
	return isDispatchRequestAuthorized(request);
}
