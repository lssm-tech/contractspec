import { appLogger } from '../../../infrastructure';

const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://eu.posthog.com';
const POSTHOG_PROJECT_KEY = process.env.POSTHOG_PROJECT_KEY ?? '';

export async function trackChatEvent(
  event: string,
  properties: Record<string, unknown>
): Promise<void> {
  if (!POSTHOG_PROJECT_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_PROJECT_KEY,
        event: `contractspec.ai_chat.${event}`,
        distinct_id:
          properties.userId ?? properties.organizationId ?? 'anonymous',
        properties: {
          ...properties,
          $lib: 'contractspec-studio',
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (error) {
    appLogger.warn('Failed to track chat event', { error, event });
  }
}
