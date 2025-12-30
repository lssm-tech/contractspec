/**
 * Telemetry ingest handler for ContractSpec API.
 *
 * Receives telemetry events from VS Code extension (and other clients)
 * and forwards them to PostHog.
 */

import { Elysia, t } from 'elysia';
import { appLogger } from '@contractspec/bundle.studio/infrastructure';

/**
 * PostHog configuration from environment.
 */
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://eu.posthog.com';
const POSTHOG_PROJECT_KEY = process.env.POSTHOG_PROJECT_KEY ?? '';

/**
 * Track an MCP request for telemetry.
 */
export async function trackMcpRequest(
  endpoint: string,
  method: string,
  success: boolean,
  durationMs: number,
  clientId?: string
): Promise<void> {
  if (!POSTHOG_PROJECT_KEY) {
    return;
  }

  try {
    await sendToPostHog({
      event: 'contractspec.api.mcp_request',
      distinct_id: clientId ?? 'anonymous',
      properties: {
        endpoint,
        method,
        success,
        duration_ms: durationMs,
        $lib: 'contractspec-api',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    appLogger.warn('Failed to send MCP telemetry', { error });
  }
}

/**
 * Send event to PostHog.
 */
async function sendToPostHog(payload: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: POSTHOG_PROJECT_KEY,
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`PostHog returned ${response.status}`);
  }
}

/**
 * Telemetry ingest schema.
 */
const telemetryEventSchema = t.Object({
  event: t.String(),
  distinct_id: t.String(),
  properties: t.Optional(t.Record(t.String(), t.Unknown())),
  timestamp: t.Optional(t.String()),
});

/**
 * Telemetry ingest handler.
 *
 * This endpoint receives telemetry events from clients (e.g., VS Code extension)
 * and forwards them to PostHog.
 */
export const telemetryHandler = new Elysia().group('/api/telemetry', (app) =>
  app
    .post(
      '/ingest',
      async ({ body, headers }) => {
        if (!POSTHOG_PROJECT_KEY) {
          appLogger.debug(
            'Telemetry ingest received but POSTHOG_PROJECT_KEY not configured'
          );
          return { success: true, message: 'Telemetry disabled (no key)' };
        }

        const clientId = headers['x-contractspec-client-id'];

        try {
          // Forward to PostHog
          await sendToPostHog({
            event: body.event,
            distinct_id: body.distinct_id ?? clientId ?? 'anonymous',
            properties: {
              ...body.properties,
              $lib: 'contractspec-vscode',
              ingested_at: new Date().toISOString(),
            },
          });

          appLogger.debug('Telemetry event ingested', { event: body.event });

          return { success: true };
        } catch (error) {
          appLogger.warn('Failed to ingest telemetry', {
            error: error instanceof Error ? error.message : String(error),
            event: body.event,
          });

          return { success: false, error: 'Failed to ingest event' };
        }
      },
      {
        body: telemetryEventSchema,
        detail: {
          summary: 'Ingest telemetry event',
          description:
            'Receives telemetry events from clients and forwards them to PostHog.',
          tags: ['telemetry'],
        },
      }
    )
    .get('/', () => ({
      status: 'ok',
      message: 'Telemetry ingest available at POST /api/telemetry/ingest',
      enabled: !!POSTHOG_PROJECT_KEY,
    }))
);
