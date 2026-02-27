import { describe, expect, it } from 'bun:test';

import { MessagingPolicyEngine } from './policy';
import { CHANNEL_POLICY_REPLAY_FIXTURES } from './replay-fixtures';
import type { ChannelInboundEvent } from './types';

function makeEvent(text: string, index: number): ChannelInboundEvent {
  return {
    workspaceId: 'workspace-replay',
    providerKey: 'messaging.slack',
    externalEventId: `evt-${index + 1}`,
    eventType: 'slack.message',
    occurredAt: new Date(),
    signatureValid: true,
    thread: {
      externalThreadId: `thread-${index + 1}`,
      externalChannelId: 'C123',
      externalUserId: 'U123',
    },
    message: { text },
  };
}

describe('channel policy replay fixtures', () => {
  const policy = new MessagingPolicyEngine();

  for (const [index, fixture] of CHANNEL_POLICY_REPLAY_FIXTURES.entries()) {
    it(`matches fixture: ${fixture.name}`, () => {
      const result = policy.evaluate({ event: makeEvent(fixture.text, index) });
      expect(result.verdict).toBe(fixture.expectedVerdict);
      expect(result.riskTier).toBe(fixture.expectedRiskTier);
    });
  }
});
