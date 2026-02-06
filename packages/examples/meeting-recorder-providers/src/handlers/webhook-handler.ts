import type {
  MeetingRecorderWebhookEvent,
  MeetingRecorderWebhookRequest,
} from '@contractspec/lib.contracts/integrations/providers/meeting-recorder';

import {
  createMeetingRecorderProvider,
  type MeetingRecorderProviderFactoryInput,
} from './create-provider';

export interface MeetingRecorderWebhookHandlerInput extends MeetingRecorderProviderFactoryInput {
  request: Request;
}

export async function handleMeetingRecorderWebhook(
  input: MeetingRecorderWebhookHandlerInput
): Promise<Response> {
  const { integrationKey, request } = input;
  const provider = createMeetingRecorderProvider(input);
  const rawBody = await request.text();
  const parsedBody = safeJsonParse(rawBody);
  const webhookRequest: MeetingRecorderWebhookRequest = {
    headers: toHeaderRecord(request.headers),
    rawBody,
    parsedBody,
  };

  if (provider.verifyWebhook) {
    const verified = await provider.verifyWebhook(webhookRequest);
    if (!verified) {
      return new Response('Invalid webhook signature', { status: 401 });
    }
  }

  const event = provider.parseWebhook
    ? await provider.parseWebhook(webhookRequest)
    : fallbackWebhookEvent(integrationKey, parsedBody ?? rawBody);

  return new Response(JSON.stringify({ status: 'ok', event }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function toHeaderRecord(
  headers: Headers
): Record<string, string | string[] | undefined> {
  const record: Record<string, string | string[] | undefined> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function safeJsonParse(payload: string): unknown | undefined {
  if (!payload) return undefined;
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return undefined;
  }
}

function fallbackWebhookEvent(
  providerKey: string,
  payload: unknown
): MeetingRecorderWebhookEvent {
  return {
    providerKey,
    payload,
    receivedAt: new Date().toISOString(),
  };
}
