import { describe, expect, it } from 'bun:test';
import {
  emitPatchProposed,
  emitPatchApproved,
  emitPatchRejected,
  emitPolicyDenied,
} from './audit-events';
import type { BundleAuditEmitter } from '../spec/types';

function createCollector(): BundleAuditEmitter & {
  events: import('../spec/types').BundleAuditEvent[];
} {
  const events: import('../spec/types').BundleAuditEvent[] = [];
  return {
    emit(event) {
      events.push(event);
    },
    events,
  };
}

describe('audit-events', () => {
  it('emitPatchProposed emits patch.proposed', () => {
    const audit = createCollector();
    emitPatchProposed(audit, {
      bundleKey: 'b1',
      surfaceId: 's1',
      proposal: {
        proposalId: 'p1',
        source: 'assistant',
        ops: [],
        approvalState: 'proposed',
      },
    });
    expect(audit.events).toHaveLength(1);
    expect(audit.events[0]?.eventType).toBe('patch.proposed');
    expect(audit.events[0]?.payload).toMatchObject({
      proposalId: 'p1',
      source: 'assistant',
      opsCount: 0,
    });
  });

  it('emitPatchApproved emits patch.approved', () => {
    const audit = createCollector();
    emitPatchApproved(audit, {
      bundleKey: 'b1',
      proposalId: 'p1',
      source: 'assistant',
      opsCount: 2,
      actorId: 'user1',
    });
    expect(audit.events).toHaveLength(1);
    expect(audit.events[0]?.eventType).toBe('patch.approved');
  });

  it('emitPatchRejected emits patch.rejected', () => {
    const audit = createCollector();
    emitPatchRejected(audit, {
      bundleKey: 'b1',
      proposalId: 'p1',
      source: 'assistant',
      opsCount: 2,
      reason: 'user declined',
    });
    expect(audit.events).toHaveLength(1);
    expect(audit.events[0]?.eventType).toBe('patch.rejected');
  });

  it('emitPolicyDenied emits policy.denied', () => {
    const audit = createCollector();
    emitPolicyDenied(audit, {
      bundleKey: 'b1',
      targetId: 'patch-proposal',
      reason: 'restricted',
    });
    expect(audit.events).toHaveLength(1);
    expect(audit.events[0]?.eventType).toBe('policy.denied');
    expect(audit.events[0]?.source).toBe('policy');
  });
});
