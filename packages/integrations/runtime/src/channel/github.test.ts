import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'bun:test';

import {
  normalizeGithubInboundEvent,
  parseGithubWebhookPayload,
  verifyGithubSignature,
} from './github';

describe('GitHub webhook helpers', () => {
  it('verifies a valid signature', () => {
    const rawBody = JSON.stringify({ ping: true });
    const secret = 'github-secret';
    const signature = `sha256=${createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')}`;

    const result = verifyGithubSignature({
      webhookSecret: secret,
      signatureHeader: signature,
      rawBody,
    });

    expect(result.valid).toBe(true);
  });

  it('normalizes issue comment payloads', () => {
    const payload = parseGithubWebhookPayload(
      JSON.stringify({
        action: 'created',
        repository: {
          name: 'contractspec',
          owner: { login: 'lssm-tech' },
        },
        issue: {
          number: 42,
        },
        comment: {
          id: 2001,
          body: 'Please review this update',
        },
        sender: {
          login: 'tboutron',
        },
      })
    );

    const event = normalizeGithubInboundEvent({
      workspaceId: 'workspace-1',
      payload,
      deliveryId: 'delivery-1',
      eventName: 'issue_comment',
      signatureValid: true,
    });

    expect(event).not.toBeNull();
    expect(event?.providerKey).toBe('messaging.github');
    expect(event?.thread.externalThreadId).toBe('lssm-tech/contractspec#42');
    expect(event?.message?.text).toContain('Please review');
  });
});
