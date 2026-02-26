import { Elysia } from 'elysia';

import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
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
  const configuredTokens = [
    process.env.CHANNEL_DISPATCH_TOKEN,
    process.env.CRON_SECRET,
  ].filter((token): token is string => Boolean(token && token.length > 0));

  if (configuredTokens.length === 0) {
    return process.env.NODE_ENV !== 'production';
  }

  const headerToken = request.headers.get('x-channel-dispatch-token');
  const bearerToken = parseBearerToken(request.headers.get('authorization'));
  return configuredTokens.some(
    (token) => token === headerToken || token === bearerToken
  );
}

function parseBearerToken(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}
