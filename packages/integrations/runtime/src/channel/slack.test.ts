import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'bun:test';

import {
  isSlackUrlVerificationPayload,
  normalizeSlackInboundEvent,
  parseSlackWebhookPayload,
  verifySlackSignature,
} from './slack';

describe('Slack signature verification', () => {
  it('validates signed payload', () => {
    const signingSecret = 'test-secret';
    const rawBody = JSON.stringify({ type: 'event_callback' });
    const timestamp = '1730000000';
    const signature = `v0=${createHmac('sha256', signingSecret)
      .update(`v0:${timestamp}:${rawBody}`)
      .digest('hex')}`;

    const result = verifySlackSignature({
      signingSecret,
      requestTimestamp: timestamp,
      requestSignature: signature,
      rawBody,
      nowMs: Number(timestamp) * 1000,
    });

    expect(result.valid).toBe(true);
  });

  it('rejects expired payloads', () => {
    const result = verifySlackSignature({
      signingSecret: 'secret',
      requestTimestamp: '1',
      requestSignature: 'v0=invalid',
      rawBody: '{}',
      nowMs: 600_000,
      toleranceSeconds: 300,
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('timestamp_out_of_range');
  });
});

describe('Slack payload normalization', () => {
  it('detects url verification payloads', () => {
    const payload = parseSlackWebhookPayload(
      JSON.stringify({ type: 'url_verification', challenge: 'ok' })
    );
    expect(isSlackUrlVerificationPayload(payload)).toBe(true);
  });

  it('normalizes event callback payloads', () => {
    const payload = parseSlackWebhookPayload(
      JSON.stringify({
        type: 'event_callback',
        team_id: 'T123',
        event_id: 'Ev123',
        event_time: 1730000100,
        event: {
          type: 'message',
          user: 'U123',
          text: 'hello',
          ts: '1730000100.000001',
          channel: 'C123',
        },
      })
    );

    const normalized = normalizeSlackInboundEvent({
      workspaceId: 'workspace-1',
      payload,
      signatureValid: true,
      traceId: 'trace-1',
    });

    expect(normalized).not.toBeNull();
    expect(normalized?.externalEventId).toBe('Ev123');
    expect(normalized?.providerKey).toBe('messaging.slack');
    expect(normalized?.thread.externalChannelId).toBe('C123');
    expect(normalized?.message?.text).toBe('hello');
  });

  it('ignores bot messages', () => {
    const payload = parseSlackWebhookPayload(
      JSON.stringify({
        type: 'event_callback',
        event_id: 'Ev124',
        event: {
          type: 'message',
          bot_id: 'B123',
          text: 'bot',
          ts: '1730000101.000001',
          channel: 'C123',
        },
      })
    );

    const normalized = normalizeSlackInboundEvent({
      workspaceId: 'workspace-1',
      payload,
      signatureValid: true,
    });

    expect(normalized).toBeNull();
  });
});
