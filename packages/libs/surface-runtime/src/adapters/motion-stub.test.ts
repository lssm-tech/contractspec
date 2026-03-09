import { describe, expect, it } from 'bun:test';
import { motionAdapterStub } from './motion-stub';

describe('motionAdapterStub', () => {
  it('returns deliberate tokens for deliberate pace', () => {
    const tokens = motionAdapterStub.getTokens('deliberate');
    expect(tokens.durationMs).toBe(300);
    expect(tokens.enableEntrance).toBe(true);
    expect(tokens.layout).toBe(true);
  });

  it('returns balanced tokens for balanced pace', () => {
    const tokens = motionAdapterStub.getTokens('balanced');
    expect(tokens.durationMs).toBe(150);
    expect(tokens.enableEntrance).toBe(true);
  });

  it('returns rapid tokens with no entrance for rapid pace', () => {
    const tokens = motionAdapterStub.getTokens('rapid');
    expect(tokens.durationMs).toBe(50);
    expect(tokens.enableEntrance).toBe(false);
    expect(tokens.layout).toBe(false);
  });
});
